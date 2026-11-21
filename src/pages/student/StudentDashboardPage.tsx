import { useEffect, useMemo, useState } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Report, ReportStatus } from '../../types/report'
import { getCachedReports, getReports } from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { Skeleton, TableSkeleton } from '../../components/common/Skeleton'
import { countReportsByStatus } from '../../utils/report'
import { formatDate } from '../../utils/date'
import mascotImg from '../../assets/dashboard/mascot-2.png'
import { FiArrowRight, FiCheck, FiHeart, FiPlus } from 'react-icons/fi'

type StudentDashboardPageProps = { profile: UserProfile; onNavigate: (path: string) => void }

function getFirstName(fullName: string) {
  if (!fullName) return 'Mahasiswa'
  const parts = fullName.trim().split(/\s+/)
  if (parts.length > 1 && (parts[0].length <= 2 || parts[0].endsWith('.'))) {
    return parts[1]
  }
  return parts[0]
}

export function StudentDashboardPage({ profile, onNavigate }: StudentDashboardPageProps) {
  const cached = getCachedReports(profile.id)
  const [reports, setReports] = useState<Report[]>(() => cached ?? [])
  const [loading, setLoading] = useState(() => !cached)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState<ReportStatus | ''>('')

  useEffect(() => {
    let active = true
    const currentCached = getCachedReports(profile.id)
    if (!currentCached) {
      setLoading(true)
    }
    void getReports(profile.id)
      .then((data) => {
        if (active) setReports(data)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Ringkasan laporan gagal dimuat.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [profile.id])

  const firstName = getFirstName(profile.full_name)
  const mine = reports.filter((report) => report.user_id === profile.id)
  const { diproses: inProgress, selesai: completed } = countReportsByStatus(mine)

  const filteredRecent = useMemo(() => {
    const list = statusFilter
      ? reports.filter((report) => report.status === statusFilter)
      : reports
    return list.slice(0, 5)
  }, [reports, statusFilter])

  return (
    <div className="w-full flex flex-col">
      {/* Blue Hero Header Zone */}
      <section className="w-full bg-[#08315c] text-white px-4 sm:px-8 lg:px-12 pt-8 pb-20 sm:pb-24 shadow-inner">
        <div className="mx-auto max-w-[1280px] flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          {/* Left Greeting & Headline */}
          <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold tracking-tight text-white leading-[1.15]">
              Halo, {firstName}{' '}
              <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#ffbb00]">
                selamat
              </span>
              <br />
              <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#ffbb00]">
                datang!
              </span>
            </h1>

            <p className="mt-3 text-xs sm:text-sm text-sky-100/90 leading-relaxed max-w-md">
              Pantau laporan fasilitas kampus dan status penanganannya.
            </p>

            <button
              type="button"
              onClick={() => onNavigate('/mahasiswa/laporan/baru')}
              className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-[#ffbb00] hover:bg-[#ffc824] px-6 py-3 text-xs sm:text-sm font-bold text-[#08315c] shadow-lg shadow-black/20 hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer"
            >
              <FiPlus className="size-4 stroke-[3]" aria-hidden="true" />
              <span>Buat Laporan Baru</span>
            </button>
          </div>

          {/* Right Speech Bubble & Mascot */}
          <div className="hidden lg:flex items-center justify-end gap-3 sm:gap-4 select-none">
            {/* Speech Bubble with pointer */}
            <div className="relative rounded-2xl bg-white px-4 py-3 sm:px-5 sm:py-3.5 text-xs sm:text-sm font-semibold text-[#08315c] shadow-lg max-w-[240px] sm:max-w-[270px] leading-snug">
              <span>Halo, {firstName}! Ada yang bisa dilaporkan hari ini?</span>
              {/* Right tail pointer pointing to mascot */}
              <div
                className="absolute -right-2 top-1/2 -translate-y-1/2 size-0 border-y-8 border-y-transparent border-l-8 border-l-white"
                aria-hidden="true"
              />
            </div>

            {/* Mascot Image */}
            <div className="relative shrink-0">
              <img
                src={mascotImg}
                alt="Maskot Mamang Sarpras melambai"
                className="h-28 sm:h-36 lg:h-40 w-auto object-contain drop-shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Floating 3 Metric Cards */}
      <section className="-mt-12 sm:-mt-14 relative z-10 w-full px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px] grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          {/* Card 1: Laporan Saya */}
          <div className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Laporan saya
            </span>
            {loading ? (
              <Skeleton className="h-9 w-14 mt-2" />
            ) : (
              <strong className="block text-3xl sm:text-4xl font-extrabold text-[#08315c] mt-2">
                {mine.length}
              </strong>
            )}
          </div>

          {/* Card 2: Sedang Diproses */}
          <div className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-amber-400" aria-hidden="true" />
              <span>Sedang diproses</span>
            </span>
            {loading ? (
              <Skeleton className="h-9 w-14 mt-2" />
            ) : (
              <strong className="block text-3xl sm:text-4xl font-extrabold text-[#08315c] mt-2">
                {inProgress}
              </strong>
            )}
          </div>

          {/* Card 3: Selesai */}
          <div className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 inline-flex items-center gap-1.5">
              <FiCheck className="size-3.5 text-emerald-500 stroke-[2.5]" aria-hidden="true" />
              <span>Selesai</span>
            </span>
            {loading ? (
              <Skeleton className="h-9 w-14 mt-2" />
            ) : (
              <strong className="block text-3xl sm:text-4xl font-extrabold text-[#08315c] mt-2">
                {completed}
              </strong>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area: Laporan Kampus Terbaru */}
      <section className="w-full px-4 sm:px-8 lg:px-12 pt-10 pb-16">
        <div className="mx-auto max-w-[1280px] space-y-5">
          {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}

          {/* Section Heading & Filter Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#08315c] tracking-tight leading-tight">
                Laporan kampus
                <br />
                terbaru
              </h2>
            </div>

            {/* Filter Pills */}
            <div className="flex flex-wrap items-center gap-2" role="tablist" aria-label="Filter status laporan">
              <button
                type="button"
                onClick={() => setStatusFilter('')}
                className={`min-h-[38px] rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === ''
                    ? 'bg-[#08315c] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Semua
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('belum_diproses')}
                className={`min-h-[38px] rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'belum_diproses'
                    ? 'bg-[#08315c] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Belum diproses
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('diproses')}
                className={`min-h-[38px] rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'diproses'
                    ? 'bg-[#08315c] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Diproses
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('menunggu_konfirmasi')}
                className={`min-h-[38px] rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'menunggu_konfirmasi'
                    ? 'bg-[#08315c] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Menunggu Konfirmasi
              </button>
              <button
                type="button"
                onClick={() => setStatusFilter('selesai')}
                className={`min-h-[38px] rounded-full px-4 py-1.5 text-xs font-bold transition cursor-pointer ${
                  statusFilter === 'selesai'
                    ? 'bg-[#08315c] text-white shadow-sm'
                    : 'bg-white border border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                Selesai
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/90 overflow-hidden">
            {loading ? (
              <TableSkeleton rows={4} />
            ) : filteredRecent.length === 0 ? (
              <div className="py-16 text-center space-y-2">
                <p className="text-sm font-bold text-slate-700">Tidak ada laporan untuk filter ini</p>
                <p className="text-xs text-slate-400">Seluruh aduan sarpras yang masuk akan ditampilkan di sini.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      <th className="py-4 px-5 sm:px-6">Laporan</th>
                      <th className="py-4 px-5 sm:px-6">Lokasi</th>
                      <th className="py-4 px-5 sm:px-6">Tanggal</th>
                      <th className="py-4 px-5 sm:px-6">Status</th>
                      <th className="py-4 px-5 sm:px-6 text-right">Dukungan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs">
                    {filteredRecent.map((report) => (
                      <tr
                        key={report.id}
                        onClick={() => onNavigate(`/mahasiswa/laporan/${report.id}`)}
                        className="group hover:bg-slate-50/80 transition-colors cursor-pointer"
                      >
                        {/* Laporan Title & Category */}
                        <td className="py-4 px-5 sm:px-6 max-w-[280px]">
                          <strong className="block text-sm font-bold text-slate-800 group-hover:text-[#08315c] transition-colors truncate">
                            {report.title}
                          </strong>
                          <span className="block text-xs text-slate-400 mt-0.5">
                            {report.categories?.name ?? 'Umum'}
                          </span>
                        </td>

                        {/* Lokasi */}
                        <td className="py-4 px-5 sm:px-6 text-slate-600 whitespace-nowrap">
                          <div>{report.faculty} · {report.building}</div>
                          {typeof report.latitude === 'number' && typeof report.longitude === 'number' && (
                            <span className="inline-block mt-0.5 text-[10px] text-sky-700 font-medium">
                              📍 Peta Tersemat
                            </span>
                          )}
                        </td>

                        {/* Tanggal */}
                        <td className="py-4 px-5 sm:px-6 text-slate-600 whitespace-nowrap">
                          {formatDate(report.created_at)}
                        </td>

                        {/* Status Badge */}
                        <td className="py-4 px-5 sm:px-6 whitespace-nowrap">
                          {report.status === 'belum_diproses' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-3 py-1 text-xs font-semibold text-amber-700">
                              <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                              <span>Belum diproses</span>
                            </span>
                          ) : report.status === 'diproses' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200/80 px-3 py-1 text-xs font-semibold text-sky-700">
                              <span className="size-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                              <span>Diproses</span>
                            </span>
                          ) : report.status === 'menunggu_konfirmasi' ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 px-3 py-1 text-xs font-semibold text-indigo-700">
                              <span className="size-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
                              <span>Menunggu Konfirmasi</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-3 py-1 text-xs font-semibold text-emerald-700">
                              <FiCheck className="size-3.5 stroke-[2.5]" aria-hidden="true" />
                              <span>Selesai</span>
                            </span>
                          )}
                        </td>

                        {/* Dukungan */}
                        <td className="py-4 px-5 sm:px-6 text-right font-bold text-slate-700 whitespace-nowrap">
                          <span className="inline-flex items-center gap-1 text-xs">
                            <FiHeart className="size-3 text-rose-500 fill-rose-500" aria-hidden="true" />
                            <span>{report.vote_count}</span>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Bottom Right Link */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => onNavigate('/mahasiswa/laporan')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#08315c] hover:text-[#0c4278] hover:underline transition cursor-pointer"
            >
              <span>Lihat semua laporan</span>
              <FiArrowRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
export default StudentDashboardPage
