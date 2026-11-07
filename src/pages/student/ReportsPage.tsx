import { useEffect, useMemo, useState } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Category, Report, ReportStatus } from '../../types/report'
import { getCategories, getReports, toggleReportVote } from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { ReportCardSkeleton } from '../../components/common/Skeleton'
import { ReportFilters } from '../../components/report/ReportFilters'
import { formatReportDate } from '../../utils/date'
import { filterReports } from '../../utils/report'
import { FiCheck, FiHeart, FiMapPin, FiPlus, FiSearch, FiUser } from 'react-icons/fi'

type ReportsPageProps = {
  profile: UserProfile
  mineOnly?: boolean
  onNavigate: (path: string) => void
}

function loadReportsPageData(userId: string, mineOnly: boolean) {
  return Promise.all([getReports(userId, mineOnly), getCategories()])
}

export function ReportsPage({ profile, mineOnly = false, onNavigate }: ReportsPageProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ReportStatus | ''>('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState<'newest' | 'votes'>('newest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [votingId, setVotingId] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [nextReports, nextCategories] = await loadReportsPageData(profile.id, mineOnly)
      setReports(nextReports)
      setCategories(nextCategories)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Laporan gagal dimuat.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    void loadReportsPageData(profile.id, mineOnly)
      .then(([nextReports, nextCategories]) => {
        if (!active) return
        setReports(nextReports)
        setCategories(nextCategories)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Laporan gagal dimuat.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [profile.id, mineOnly])

  const visibleReports = useMemo(
    () =>
      filterReports(reports, {
        search,
        status,
        categoryId: category,
        sort,
      }),
    [reports, search, status, category, sort]
  )

  const handleVote = async (report: Report) => {
    setVotingId(report.id)
    setError('')
    try {
      await toggleReportVote(report.id, profile.id, report.voted_by_me)
      await loadData()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Dukungan gagal disimpan.')
    } finally {
      setVotingId('')
    }
  }

  return (
    <div className="w-full flex flex-col">
      {/* Navy Top Banner */}
      <section className="w-full bg-[#08315c] text-white px-4 sm:px-8 lg:px-12 py-8 shadow-inner">
        <div className="mx-auto max-w-[1280px] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffbb00]">
              <span className="size-1.5 rounded-full bg-[#ffbb00]" aria-hidden="true" />
              <span>{mineOnly ? 'Histori Laporan Saya' : 'Katalog Aspirasi Kampus'}</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {mineOnly ? 'Laporan Saya' : 'Semua Laporan Fasilitas'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-sky-100/80">
              {mineOnly
                ? 'Pantau progres penanganan aduan fasilitas kampus yang telah Anda kirimkan.'
                : 'Dukung laporan yang Anda alami atau cari tahu perbaikan fasilitas terkini di UNSRI.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/mahasiswa/laporan/baru')}
            className="inline-flex min-h-[44px] shrink-0 items-center gap-2 self-start sm:self-auto rounded-2xl bg-[#ffbb00] hover:bg-[#ffc824] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#08315c] shadow-md hover:-translate-y-0.5 active:translate-y-0 transition cursor-pointer"
          >
            <FiPlus className="size-4 stroke-[3]" aria-hidden="true" />
            <span>Buat Laporan Baru</span>
          </button>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-8">
        <div className="mx-auto max-w-[1280px] space-y-6">
          {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}

          {/* Filter Bar */}
          <ReportFilters
            search={search}
            status={status}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
            categories={categories}
            category={category}
            onCategoryChange={setCategory}
            sort={sort}
            onSortChange={setSort}
          />

          {/* Report Cards Grid */}
          {loading ? (
            <ReportCardSkeleton count={4} />
          ) : visibleReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">
              <FiSearch className="size-10 text-slate-400 mb-3" aria-hidden="true" />
              <h2 className="text-sm font-bold text-slate-800">
                {reports.length ? 'Tidak ada laporan yang cocok' : 'Belum ada laporan'}
              </h2>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                {reports.length
                  ? 'Coba sesuaikan kata kunci pencarian atau filter status yang Anda pilih.'
                  : mineOnly
                    ? 'Laporan yang Anda kirim akan tersimpan dan tampil di sini.'
                    : 'Jadilah yang pertama melaporkan fasilitas yang membutuhkan perbaikan.'}
              </p>
              {!reports.length && (
                <button
                  type="button"
                  onClick={() => onNavigate('/mahasiswa/laporan/baru')}
                  className="mt-4 rounded-xl bg-[#08315c] text-white px-5 py-2 text-xs font-bold hover:bg-[#0c4278] transition"
                >
                  Buat Laporan Pertama
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {visibleReports.map((report) => (
                <article
                  key={report.id}
                  className="group relative flex flex-col md:flex-row items-start justify-between gap-5 rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm transition-all duration-200 hover:border-[#08315c]/40 hover:shadow-md"
                >
                  <div className="min-w-0 flex-1">
                    {/* Meta Topline */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                      {report.status === 'belum_diproses' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                          <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                          <span>Belum diproses</span>
                        </span>
                      ) : report.status === 'diproses' ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                          <span className="size-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                          <span>Diproses</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                          <FiCheck className="size-3 stroke-[2.5]" aria-hidden="true" />
                          <span>Selesai</span>
                        </span>
                      )}

                      <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
                        {report.categories?.name ?? 'Umum'}
                      </span>
                      <span className="text-[11px] text-slate-400">·</span>
                      <span className="text-[11px] text-slate-500">{formatReportDate(report.created_at)}</span>
                    </div>

                    {/* Title */}
                    <h2 className="mt-3 text-base sm:text-lg font-bold text-slate-800">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/mahasiswa/laporan/${report.id}`)}
                        className="text-left hover:text-[#08315c] transition-colors cursor-pointer"
                      >
                        {report.title}
                      </button>
                    </h2>

                    {/* Description */}
                    <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
                      {report.description}
                    </p>

                    {/* Location */}
                    <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-500">
                      <FiMapPin className="size-3.5 text-[#08315c] shrink-0" aria-hidden="true" />
                      <span>
                        {report.faculty} · {report.building}
                        {report.room ? ` · ${report.room}` : ''}
                      </span>
                    </div>

                    {/* Card Footer */}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 text-[11px]">
                        <FiUser className="size-3 text-slate-400" aria-hidden="true" />
                        <span>
                          Oleh{' '}
                          <strong className="font-semibold text-slate-700">
                            {report.profiles?.full_name ?? 'Mahasiswa'}
                          </strong>
                        </span>
                      </div>

                      <button
                        type="button"
                        disabled={mineOnly || report.user_id === profile.id || votingId === report.id}
                        onClick={() => void handleVote(report)}
                        title={
                          report.user_id === profile.id
                            ? 'Tidak dapat mendukung laporan sendiri'
                            : 'Saya juga mengalami masalah ini'
                        }
                        className={`inline-flex min-h-[38px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                          report.voted_by_me
                            ? 'border-rose-400 bg-rose-50 text-rose-600 shadow-sm'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                      >
                        <FiHeart
                          className={`size-3.5 ${
                            report.voted_by_me ? 'fill-rose-500 text-rose-500' : 'text-rose-500'
                          }`}
                          aria-hidden="true"
                        />
                        <span>Saya juga mengalami</span>
                        <b className="ml-0.5 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700">
                          {report.vote_count}
                        </b>
                      </button>
                    </div>
                  </div>

                  {/* Photo Thumbnail */}
                  {report.photo_url && (
                    <div className="shrink-0 self-center md:self-start">
                      <img
                        className="size-24 sm:size-28 rounded-xl object-cover border border-slate-200 shadow-sm"
                        src={report.photo_url}
                        alt={`Foto laporan: ${report.title}`}
                      />
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
export default ReportsPage
