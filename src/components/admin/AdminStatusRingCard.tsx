import { useState } from 'react'
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiClock,
  FiHelpCircle,
} from 'react-icons/fi'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { motion } from 'framer-motion'
import type { ReportStatus } from '../../types/report'
import { Skeleton } from '../common/Skeleton'

type AdminStatusRingCardProps = {
  total: number
  openCount: number
  progressCount: number
  waitingConfirmCount: number
  doneCount: number
  overdueCount: number
  loading?: boolean
  onSelectSection?: (section: string) => void
}

type ChartDataItem = {
  name: string
  value: number
  status: ReportStatus
  color: string
  percentage: number
  key: string
}

export function AdminStatusRingCard({
  total,
  openCount,
  progressCount,
  waitingConfirmCount,
  doneCount,
  overdueCount,
  loading = false,
  onSelectSection,
}: AdminStatusRingCardProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  // Definisi segment status
  const statusItems = [
    {
      key: 'selesai',
      status: 'selesai' as ReportStatus,
      label: 'Tuntas Selesai',
      count: doneCount,
      color: '#10b981', // emerald-500
      accentClass: 'text-emerald-600',
      bgClass: 'bg-emerald-500',
      pillClass: 'bg-emerald-50 text-emerald-800 border-emerald-200/80',
      icon: FiCheckCircle,
      desc: 'Penanganan telah diverifikasi tuntas oleh pelapor',
    },
    {
      key: 'menunggu_konfirmasi',
      status: 'menunggu_konfirmasi' as ReportStatus,
      label: 'Menunggu Konfirmasi',
      count: waitingConfirmCount,
      color: '#6366f1', // indigo-500
      accentClass: 'text-indigo-600',
      bgClass: 'bg-indigo-500',
      pillClass: 'bg-indigo-50 text-indigo-800 border-indigo-200/80',
      icon: FiHelpCircle,
      desc: 'Pekerjaan selesai, menunggu konfirmasi mahasiswa pelapor',
    },
    {
      key: 'diproses',
      status: 'diproses' as ReportStatus,
      label: 'Sedang Diproses',
      count: progressCount,
      color: '#0284c7', // sky-600
      accentClass: 'text-sky-600',
      bgClass: 'bg-sky-500',
      pillClass: 'bg-sky-50 text-sky-800 border-sky-200/80',
      icon: FiClock,
      desc: 'Sedang ditangani oleh teknisi di lapangan',
    },
    {
      key: 'belum_diproses',
      status: 'belum_diproses' as ReportStatus,
      label: 'Belum Diproses',
      count: openCount,
      color: '#f59e0b', // amber-500
      accentClass: 'text-amber-600',
      bgClass: 'bg-amber-500',
      pillClass: 'bg-amber-50 text-amber-800 border-amber-200/80',
      icon: FiClock,
      desc: 'Laporan baru masuk menunggu penugasan teknisi',
    },
  ]

  const percentDone = total > 0 ? Math.round((doneCount / total) * 100) : 0

  // Dataset untuk Recharts Donut Pie
  const chartData: ChartDataItem[] = statusItems
    .filter((item) => item.count > 0)
    .map((item) => ({
      name: item.label,
      value: item.count,
      status: item.status,
      color: item.color,
      percentage: total > 0 ? Math.round((item.count / total) * 100) : 0,
      key: item.key,
    }))

  const emptyData = [
    {
      name: 'Belum Ada Aduan',
      value: 1,
      color: '#eef2f6',
      percentage: 0,
      key: 'empty',
    },
  ]

  return (
    <div className="rounded-2xl sm:rounded-3xl bg-white p-4 sm:p-6 lg:p-7 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col gap-4 sm:gap-6">
      {/* Header Ringkasan & Alert Eskalasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 border-b border-slate-100 pb-3.5 sm:pb-4">
        <div>
          <h2 className="text-sm sm:text-base lg:text-lg font-bold tracking-tight text-[#08315c] flex items-center gap-2">
            <span>Ringkasan & Distribusi Penanganan Aduan</span>
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">
            Proporsi tindak lanjut dan status terkini seluruh aduan fasilitas kampus.
          </p>
        </div>

        {/* Eskalasi Pill */}
        {loading ? (
          <Skeleton className="h-7 sm:h-8 w-36 sm:w-44 rounded-full" />
        ) : overdueCount > 0 ? (
          <button
            type="button"
            onClick={() => onSelectSection?.('terlambat')}
            className="inline-flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto rounded-full border border-rose-200 bg-rose-50/90 px-3 sm:px-3.5 py-1 sm:py-1.5 text-[11px] sm:text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-sm cursor-pointer"
          >
            <FiAlertTriangle className="size-3 sm:size-3.5 text-rose-600" aria-hidden="true" />
            <span>{overdueCount} Perlu Eskalasi Segera</span>
            <FiArrowRight className="size-3 ml-0.5 text-rose-500" aria-hidden="true" />
          </button>
        ) : (
          <div className="inline-flex items-center gap-1.5 sm:gap-2 self-start sm:self-auto rounded-full border border-emerald-200 bg-emerald-50/70 px-3 sm:px-3.5 py-1 text-[11px] sm:text-xs font-semibold text-emerald-700 select-none">
            <FiCheck className="size-3 sm:size-3.5 text-emerald-600 stroke-[3]" aria-hidden="true" />
            <span>Seluruh Aduan Tepat Waktu</span>
          </div>
        )}
      </div>

      {/* Konten Utama: Donut Chart & Status 2-Kolom (Compact & Mobile-Friendly) */}
      <div className="flex flex-col lg:flex-row items-center gap-4 sm:gap-6 lg:gap-8">
        {/* Donut Chart: Skala Proporsional di Mobile (140px) hingga Desktop (190px) */}
        <div className="shrink-0 flex flex-col items-center justify-center">
          {loading ? (
            <div className="relative size-36 sm:size-44 flex items-center justify-center">
              <Skeleton className="size-full rounded-full" />
            </div>
          ) : (
            <div className="relative size-[140px] sm:size-[170px] lg:size-[190px] select-none">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={total > 0 ? chartData : emptyData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="65%"
                    outerRadius="88%"
                    paddingAngle={chartData.length > 1 ? 3 : 0}
                    cornerRadius={4}
                    stroke="none"
                    isAnimationActive={true}
                    animationBegin={150}
                    animationDuration={850}
                    animationEasing="ease-out"
                  >
                    {(total > 0 ? chartData : emptyData).map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={entry.color}
                        className="transition-opacity duration-150"
                        opacity={hoveredKey && hoveredKey !== entry.key ? 0.45 : 1}
                        onMouseEnter={() => setHoveredKey(entry.key)}
                        onMouseLeave={() => setHoveredKey(null)}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>

              {/* Teks di Titik Tengah Donut Ring (Proporsional & Bersih) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.45, delay: 0.25, ease: 'easeOut' }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-2"
              >
                <span className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#08315c] tracking-tight leading-none">
                  {total}
                </span>
                <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 sm:mt-1">
                  Total Aduan
                </span>
                {total > 0 && (
                  <span className="mt-1 inline-block text-[9px] sm:text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 sm:px-2 py-0.5 rounded-full border border-emerald-200/80">
                    {percentDone}% Selesai
                  </span>
                )}
              </motion.div>
            </div>
          )}

          {/* Quick info caption bawah diagram */}
          <p className="text-[10px] sm:text-[11px] text-slate-400 text-center mt-2 sm:mt-2.5 max-w-[200px]">
            {total === 0
              ? 'Belum ada aduan terdaftar.'
              : 'Proporsi tindak lanjut aduan kampus.'}
          </p>
        </div>

        {/* 4 Kotak Status: 2 Kolom di Mobile & Desktop (Sangat Efisien & Rapi) */}
        <div className="w-full flex-1 grid grid-cols-2 gap-2 sm:gap-3">
          {statusItems.map((item) => {
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0
            const isHovered = hoveredKey === item.key

            return (
              <div
                key={item.key}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className={`flex flex-col justify-between p-2.5 sm:p-3.5 lg:p-4 rounded-xl sm:rounded-2xl border text-left transition select-none ${
                  isHovered
                    ? 'border-[#08315c]/40 bg-slate-50/90 shadow-sm'
                    : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 w-full">
                  <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-slate-700 truncate">
                    <span
                      className={`size-2 sm:size-2.5 rounded-full shrink-0 ${item.bgClass}`}
                      aria-hidden="true"
                    />
                    <span className="truncate">{item.label}</span>
                  </span>

                  {/* Badge Persentase */}
                  <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border shrink-0 ${item.pillClass}`}>
                    {percentage}%
                  </span>
                </div>

                <div className="mt-2 sm:mt-3 flex items-baseline justify-between gap-1 w-full">
                  {loading ? (
                    <Skeleton className="h-6 sm:h-7 w-10 sm:w-12" />
                  ) : (
                    <span className="text-xl sm:text-2xl font-extrabold text-[#08315c]">
                      {item.count}
                    </span>
                  )}
                  <span className="text-[10px] sm:text-[11px] font-medium text-slate-400 shrink-0">
                    dari {total}
                  </span>
                </div>

                {/* Mini Progress Track */}
                <div className="mt-2 w-full h-1 sm:h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.bgClass}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
