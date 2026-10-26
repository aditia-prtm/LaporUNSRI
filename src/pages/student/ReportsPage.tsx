import { useEffect, useMemo, useState } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Category, Report, ReportStatus } from '../../types/report'
import { getCategories, getReports, toggleReportVote } from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { ReportStatusBadge } from '../../components/report/ReportStatusBadge'
import { ReportFilters } from '../../components/report/ReportFilters'
import { formatReportDate } from '../../utils/date'
import { filterReports } from '../../utils/report'
import { FiHeart, FiSearch } from 'react-icons/fi'

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
    void loadReportsPageData(profile.id, mineOnly).then(([nextReports, nextCategories]) => {
      if (!active) return
      setReports(nextReports)
      setCategories(nextCategories)
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Laporan gagal dimuat.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [profile.id, mineOnly])

  const visibleReports = useMemo(() => filterReports(reports, {
    search,
    status,
    categoryId: category,
    sort,
  }), [reports, search, status, category, sort])

  const handleVote = async (report: Report) => {
    setVotingId(report.id)
    setError('')
    try {
      await toggleReportVote(report.id, profile.id, report.voted_by_me)
      await loadData()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Vote gagal disimpan.')
    } finally {
      setVotingId('')
    }
  }

  return (
    <section className="student-page">
      <div className="page-title-row">
        <div><span className="eyebrow">RUANG LAPORAN</span><h1>{mineOnly ? 'Laporan saya' : 'Semua laporan'}</h1><p>{mineOnly ? 'Pantau dan kelola laporan yang Anda buat.' : 'Temukan laporan fasilitas kampus dan dukung masalah yang juga Anda alami.'}</p></div>
        <button className="button button-primary" onClick={() => onNavigate('/mahasiswa/laporan/baru')}>+ Buat laporan</button>
      </div>

      {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}

      <ReportFilters
        className="report-filters"
        search={search}
        status={status}
        onSearchChange={setSearch}
        onStatusChange={setStatus}
        searchPlaceholder="Cari judul, lokasi, atau deskripsi..."
        categories={categories}
        category={category}
        onCategoryChange={setCategory}
        sort={sort}
        onSortChange={setSort}
      />

      {loading ? <div className="student-empty">Memuat laporan...</div> : visibleReports.length === 0 ? (
        <div className="student-empty"><div className="empty-symbol"><FiSearch aria-hidden="true" /></div><h2>{reports.length ? 'Tidak ada laporan yang cocok' : 'Belum ada laporan'}</h2><p>{reports.length ? 'Coba ubah pencarian atau filter Anda.' : mineOnly ? 'Laporan yang Anda buat akan tampil di sini.' : 'Jadilah yang pertama melaporkan fasilitas yang perlu diperbaiki.'}</p>{!mineOnly && !reports.length && <button className="button button-primary" onClick={() => onNavigate('/mahasiswa/laporan/baru')}>Buat laporan pertama</button>}</div>
      ) : <div className="reports-list">
        {visibleReports.map((report) => <article className="report-list-card" key={report.id}>
          <div className="report-card-main">
            <div className="report-card-meta"><ReportStatusBadge status={report.status} /><span>{report.categories?.name ?? 'Lainnya'}</span><span>{formatReportDate(report.created_at)}</span></div>
            <h2><button className="report-title-link" onClick={() => onNavigate(`/mahasiswa/laporan/${report.id}`)}>{report.title}</button></h2>
            <p>{report.description}</p>
            <div className="report-location">{report.faculty} <span>·</span> {report.building}{report.room ? ` · ${report.room}` : ''}</div>
            <div className="report-card-footer"><span>Oleh {report.profiles?.full_name ?? 'Mahasiswa'}</span><button className={report.voted_by_me ? 'vote-button is-voted' : 'vote-button'} disabled={mineOnly || report.user_id === profile.id || votingId === report.id} onClick={() => void handleVote(report)} title={report.user_id === profile.id ? 'Tidak dapat mendukung laporan sendiri' : 'Saya juga mengalami'}><FiHeart aria-hidden="true" /> Saya juga mengalami <b>{report.vote_count}</b></button></div>
          </div>
          {report.photo_url && <img className="report-thumbnail" src={report.photo_url} alt={`Foto laporan: ${report.title}`} />}
        </article>)}
      </div>}
    </section>
  )
}
