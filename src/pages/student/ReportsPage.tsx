import { useEffect, useMemo, useState } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Category, Report, ReportStatus } from '../../types/report'
import { getCategories, getReports, toggleReportVote } from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'

type ReportsPageProps = {
  profile: UserProfile
  mineOnly?: boolean
  onNavigate: (path: string) => void
}

const statusLabels: Record<ReportStatus, string> = {
  belum_diproses: 'Belum diproses',
  diproses: 'Diproses',
  selesai: 'Selesai',
}

export function ReportsPage({ profile, mineOnly = false, onNavigate }: ReportsPageProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [category, setCategory] = useState('')
  const [sort, setSort] = useState<'newest' | 'votes'>('newest')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [votingId, setVotingId] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [nextReports, nextCategories] = await Promise.all([
        getReports(profile.id, mineOnly),
        getCategories(),
      ])
      setReports(nextReports)
      setCategories(nextCategories)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Laporan gagal dimuat.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadData() }, [profile.id, mineOnly])

  const visibleReports = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('id')
    const filtered = reports.filter((report) => {
      const matchesText = !term || [report.title, report.description, report.faculty, report.building, report.room ?? '']
        .some((value) => value.toLocaleLowerCase('id').includes(term))
      return matchesText
        && (!status || report.status === status)
        && (!category || report.category_id === category)
    })
    return filtered.sort((a, b) => sort === 'votes'
      ? b.vote_count - a.vote_count || Date.parse(b.created_at) - Date.parse(a.created_at)
      : Date.parse(b.created_at) - Date.parse(a.created_at))
  }, [reports, search, status, category, sort])

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

      <div className="report-filters">
        <input aria-label="Cari laporan" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Cari judul, lokasi, atau deskripsi..." />
        <select aria-label="Filter kategori" value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Semua kategori</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select>
        <select aria-label="Filter status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Semua status</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select>
        <select aria-label="Urutkan laporan" value={sort} onChange={(event) => setSort(event.target.value as 'newest' | 'votes')}><option value="newest">Paling baru</option><option value="votes">Dukungan terbanyak</option></select>
      </div>

      {loading ? <div className="student-empty">Memuat laporan...</div> : visibleReports.length === 0 ? (
        <div className="student-empty"><div className="empty-symbol">⌕</div><h2>{reports.length ? 'Tidak ada laporan yang cocok' : 'Belum ada laporan'}</h2><p>{reports.length ? 'Coba ubah pencarian atau filter Anda.' : mineOnly ? 'Laporan yang Anda buat akan tampil di sini.' : 'Jadilah yang pertama melaporkan fasilitas yang perlu diperbaiki.'}</p>{!mineOnly && !reports.length && <button className="button button-primary" onClick={() => onNavigate('/mahasiswa/laporan/baru')}>Buat laporan pertama</button>}</div>
      ) : <div className="reports-list">
        {visibleReports.map((report) => <article className="report-list-card" key={report.id}>
          <div className="report-card-main">
            <div className="report-card-meta"><span className={`status-pill status-${report.status}`}>{statusLabels[report.status]}</span><span>{report.categories?.name ?? 'Lainnya'}</span><span>{new Date(report.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</span></div>
            <h2><button className="report-title-link" onClick={() => onNavigate(`/mahasiswa/laporan/${report.id}`)}>{report.title}</button></h2>
            <p>{report.description}</p>
            <div className="report-location">{report.faculty} <span>·</span> {report.building}{report.room ? ` · ${report.room}` : ''}</div>
            <div className="report-card-footer"><span>Oleh {report.profiles?.full_name ?? 'Mahasiswa'}</span><button className={report.voted_by_me ? 'vote-button is-voted' : 'vote-button'} disabled={mineOnly || report.user_id === profile.id || votingId === report.id} onClick={() => void handleVote(report)} title={report.user_id === profile.id ? 'Tidak dapat mendukung laporan sendiri' : 'Saya juga mengalami'}><span aria-hidden="true">{report.voted_by_me ? '♥' : '♡'}</span> Saya juga mengalami <b>{report.vote_count}</b></button></div>
          </div>
          {report.photo_url && <img className="report-thumbnail" src={report.photo_url} alt={`Foto laporan: ${report.title}`} />}
        </article>)}
      </div>}
    </section>
  )
}
