import { useEffect, useMemo, useState } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Category, Report, ReportStatus } from '../../types/report'
import { getCategories, getReports, toggleReportVote } from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { ReportStatusBadge } from '../../components/report/ReportStatusBadge'
import { ReportFilters } from '../../components/report/ReportFilters'
import { formatReportDate } from '../../utils/date'
import { filterReports } from '../../utils/report'
import { FiHeart, FiMapPin, FiPlus, FiSearch, FiUser } from 'react-icons/fi'

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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#60b6ff]/30 bg-[#60b6ff]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fc3ee]">
            <span className="size-1.5 rounded-full bg-[#60b6ff] shadow-[0_0_8px_#60b6ff]" />
            <span>{mineOnly ? 'Histori Laporan Saya' : 'Katalog Aspirasi'}</span>
          </div>
          <h1 className="mt-2 font-['Poppins','Montserrat','Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            {mineOnly ? 'Laporan Saya' : 'Semua Laporan Fasilitas'}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#8cb6dc]">
            {mineOnly
              ? 'Pantau progres penanganan aduan fasilitas kampus yang telah Anda kirimkan.'
              : 'Dukung laporan yang Anda alami atau cari tahu perbaikan fasilitas terkini di UNSRI.'}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('/mahasiswa/laporan/baru')}
          className="inline-flex shrink-0 items-center gap-2 self-start sm:self-auto rounded-xl bg-gradient-to-r from-[#60b6ff] via-[#48a6ff] to-[#2b8ced] px-4.5 py-2.5 text-xs sm:text-sm font-bold text-[#021427] shadow-[0_4px_16px_rgba(58,147,232,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(58,147,232,0.55)] cursor-pointer"
        >
          <FiPlus className="size-4 stroke-[2.5]" />
          <span>Buat Laporan</span>
        </button>
      </div>

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
        <div className="rounded-2xl border border-white/10 bg-[#072445]/45 p-12 text-center text-xs text-[#8cb6dc] backdrop-blur-md">
          Memuat daftar laporan...
        </div>
      ) : visibleReports.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#072445]/30 p-12 text-center backdrop-blur-md">
          <FiSearch className="size-10 text-[#60b6ff]/50 mb-3" />
          <h2 className="text-sm font-bold text-white">
            {reports.length ? 'Tidak ada laporan yang cocok' : 'Belum ada laporan'}
          </h2>
          <p className="mt-1 text-xs text-[#8cb6dc] max-w-sm">
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
              className="mt-4 rounded-xl bg-gradient-to-r from-[#60b6ff] to-[#2b8ced] px-4 py-2 text-xs font-bold text-[#021427]"
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
              className="group relative flex flex-col md:flex-row items-start justify-between gap-5 rounded-2xl border border-white/10 bg-[#072445]/45 p-5 sm:p-6 backdrop-blur-md shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#4899e8]/50 hover:bg-[#0b2f59]/60 hover:shadow-2xl hover:shadow-[#0c4278]/25"
            >
              <div className="min-w-0 flex-1">
                {/* Meta Topline */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#8cb6dc]">
                  <ReportStatusBadge status={report.status} />
                  <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-[#8fc3ee]">
                    {report.categories?.name ?? 'Lainnya'}
                  </span>
                  <span className="text-[11px] text-[#8cb6dc]/70">·</span>
                  <span className="text-[11px] text-[#8cb6dc]">{formatReportDate(report.created_at)}</span>
                </div>

                {/* Title */}
                <h2 className="mt-3 font-['Poppins','Montserrat','Outfit',sans-serif] text-base sm:text-lg font-bold text-white">
                  <button
                    type="button"
                    onClick={() => onNavigate(`/mahasiswa/laporan/${report.id}`)}
                    className="text-left hover:text-[#60b6ff] transition-colors cursor-pointer"
                  >
                    {report.title}
                  </button>
                </h2>

                {/* Description */}
                <p className="mt-2 text-xs leading-relaxed text-[#a4c1db] line-clamp-2">
                  {report.description}
                </p>

                {/* Location */}
                <div className="mt-3.5 flex items-center gap-1.5 text-xs text-[#8cb6dc]">
                  <FiMapPin className="size-3.5 text-[#60b6ff] shrink-0" />
                  <span>
                    {report.faculty} · {report.building}
                    {report.room ? ` · ${report.room}` : ''}
                  </span>
                </div>

                {/* Card Footer */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3 text-xs text-[#8cb6dc]">
                  <div className="flex items-center gap-1 text-[11px]">
                    <FiUser className="size-3" />
                    <span>
                      Oleh{' '}
                      <strong className="font-semibold text-[#cce5fb]">
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
                    className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                      report.voted_by_me
                        ? 'border-rose-500/40 bg-rose-500/20 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.25)]'
                        : 'border-white/15 bg-white/5 text-[#cce5fb] hover:border-white/30 hover:bg-white/10'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <FiHeart
                      className={`size-3.5 ${
                        report.voted_by_me ? 'fill-rose-400 text-rose-400' : 'text-rose-400'
                      }`}
                    />
                    <span>Saya juga mengalami</span>
                    <b className="ml-0.5 rounded-full bg-white/10 px-1.5 py-0.2 text-[10px] text-white">
                      {report.vote_count}
                    </b>
                  </button>
                </div>
              </div>

              {/* Photo Thumbnail */}
              {report.photo_url && (
                <div className="shrink-0 self-center md:self-start">
                  <img
                    className="size-24 sm:size-28 rounded-xl object-cover border border-white/15 shadow-md shadow-black/30 transition-transform group-hover:scale-102"
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
  )
}
export default ReportsPage
