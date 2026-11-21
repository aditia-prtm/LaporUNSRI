import { useState } from 'react'
import { FiAlertTriangle, FiArrowRight, FiCheck, FiCheckCircle, FiClock, FiHelpCircle } from 'react-icons/fi'
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
  onSelectStatus?: (status: ReportStatus | '') => void
  onSelectSection?: (section: string) => void
}

export function AdminStatusRingCard({
  total,
  openCount,
  progressCount,
  waitingConfirmCount,
  doneCount,
  overdueCount,
  loading = false,
  onSelectStatus,
  onSelectSection,
}: AdminStatusRingCardProps) {
  const [hoveredKey, setHoveredKey] = useState<string | null>(null)

  // Geometri SVG Donut
  const size = 184
  const strokeWidth = 16
  const radius = (size - strokeWidth) / 2
  const center = size / 2
  const circumference = 2 * Math.PI * radius

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

  // Hitung segmen yang memiliki count > 0 untuk digambar di SVG
  const activeSegments = statusItems.filter((item) => item.count > 0)
  const percentDone = total > 0 ? Math.round((doneCount / total) * 100) : 0

  // Perhitungan offset keliling busur lingkaran
  let accumulatedOffset = 0
  const renderedArcs = activeSegments.map((item) => {
    const fraction = item.count / total
    const arcLength = fraction * circumference
    const gap = activeSegments.length > 1 ? 3.5 : 0
    const visibleLength = Math.max(1, arcLength - gap)
    const currentOffset = accumulatedOffset
    accumulatedOffset += arcLength

    return {
      ...item,
      dashArray: `${visibleLength} ${circumference - visibleLength}`,
      dashOffset: -(currentOffset + gap / 2),
      percentage: Math.round(fraction * 100),
    }
  })

  return (
    <div className="rounded-3xl bg-white p-5 sm:p-7 lg:p-8 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col gap-6">
      {/* Header Ringkasan & Alert Eskalasi */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold tracking-tight text-[#08315c] flex items-center gap-2">
            <span>Ringkasan & Distribusi Penanganan Aduan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Proporsi tindak lanjut dan status terkini seluruh aduan fasilitas kampus.
          </p>
        </div>

        {/* Eskalasi Pill */}
        {loading ? (
          <Skeleton className="h-8 w-44 rounded-full" />
        ) : overdueCount > 0 ? (
          <button
            type="button"
            onClick={() => onSelectSection?.('terlambat')}
            className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50/90 px-3.5 py-1.5 text-xs font-bold text-rose-700 hover:bg-rose-100 transition shadow-sm cursor-pointer"
          >
            <FiAlertTriangle className="size-3.5 text-rose-600" aria-hidden="true" />
            <span>{overdueCount} Perlu Eskalasi Segera</span>
            <FiArrowRight className="size-3 ml-0.5 text-rose-500" aria-hidden="true" />
          </button>
        ) : (
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50/70 px-3.5 py-1 text-xs font-semibold text-emerald-700 select-none">
            <FiCheck className="size-3.5 text-emerald-600 stroke-[3]" aria-hidden="true" />
            <span>Seluruh Aduan Tepat Waktu</span>
          </div>
        )}
      </div>

      {/* Konten Utama: Donut Chart (Kiri) & Status Grid List (Kanan) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
        {/* Kolom Kiri: Diagram Ring Donut Chart */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center">
          {loading ? (
            <div className="relative size-44 sm:size-48 flex items-center justify-center">
              <Skeleton className="size-full rounded-full" />
            </div>
          ) : (
            <div className="relative size-[184px] select-none">
              <svg
                width={size}
                height={size}
                viewBox={`0 0 ${size} ${size}`}
                className="size-full transform -rotate-90"
              >
                {/* Background Ring Track */}
                <circle
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke="#eef2f6"
                  strokeWidth={strokeWidth}
                />

                {/* Segmen Warna Status */}
                {renderedArcs.map((arc) => {
                  const isHovered = hoveredKey === arc.key
                  return (
                    <circle
                      key={arc.key}
                      cx={center}
                      cy={center}
                      r={radius}
                      fill="none"
                      stroke={arc.color}
                      strokeWidth={isHovered ? strokeWidth + 3 : strokeWidth}
                      strokeDasharray={arc.dashArray}
                      strokeDashoffset={arc.dashOffset}
                      strokeLinecap="round"
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredKey(arc.key)}
                      onMouseLeave={() => setHoveredKey(null)}
                      onClick={() => onSelectStatus?.(arc.status)}
                    />
                  )
                })}
              </svg>

              {/* Teks di Titik Tengah Donut Ring */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none px-3">
                <span className="text-3xl sm:text-4xl font-extrabold text-[#08315c] tracking-tight leading-none">
                  {total}
                </span>
                <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-1">
                  Total Aduan
                </span>
                {total > 0 && (
                  <span className="mt-1.5 inline-block text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                    {percentDone}% Selesai
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Quick info caption bawah diagram */}
          <p className="text-[11px] text-slate-400 text-center mt-3 max-w-[220px]">
            {total === 0
              ? 'Belum ada aduan terdaftar.'
              : 'Klik segmen atau kartu status untuk memfilter daftar.'}
          </p>
        </div>

        {/* Kolom Kanan: Rincian Angka & Progress Bar Status */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {statusItems.map((item) => {
            const percentage = total > 0 ? Math.round((item.count / total) * 100) : 0
            const isHovered = hoveredKey === item.key

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => onSelectStatus?.(item.status)}
                onMouseEnter={() => setHoveredKey(item.key)}
                onMouseLeave={() => setHoveredKey(null)}
                className={`flex flex-col justify-between p-3.5 sm:p-4 rounded-2xl border text-left transition cursor-pointer ${
                  isHovered
                    ? 'border-[#08315c] bg-slate-50/80 shadow-md ring-2 ring-[#08315c]/10'
                    : 'border-slate-100 bg-slate-50/40 hover:bg-slate-50 hover:border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-slate-700">
                    <span
                      className={`size-2.5 rounded-full ${item.bgClass}`}
                      aria-hidden="true"
                    />
                    <span>{item.label}</span>
                  </span>

                  {/* Badge Persentase */}
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.pillClass}`}>
                    {percentage}%
                  </span>
                </div>

                <div className="mt-3 flex items-baseline justify-between w-full">
                  {loading ? (
                    <Skeleton className="h-7 w-12" />
                  ) : (
                    <span className="text-2xl font-extrabold text-[#08315c]">
                      {item.count}
                    </span>
                  )}
                  <span className="text-[11px] font-medium text-slate-400">
                    dari {total} aduan
                  </span>
                </div>

                {/* Mini Progress Track */}
                <div className="mt-2.5 w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${item.bgClass}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
