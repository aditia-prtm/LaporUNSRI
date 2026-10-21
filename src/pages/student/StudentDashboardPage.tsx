import { useEffect, useState } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Report } from '../../types/report'
import { getReports } from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'

type StudentDashboardPageProps = { profile: UserProfile; onNavigate: (path: string) => void }

const statusLabels = { belum_diproses: 'Belum diproses', diproses: 'Diproses', selesai: 'Selesai' }

export function StudentDashboardPage({ profile, onNavigate }: StudentDashboardPageProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void getReports(profile.id).then((data) => {
      if (active) setReports(data)
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Ringkasan gagal dimuat.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [profile.id])

  const mine = reports.filter((report) => report.user_id === profile.id)
  const inProgress = mine.filter((report) => report.status === 'diproses').length
  const completed = mine.filter((report) => report.status === 'selesai').length
  const recent = reports.slice(0, 4)

  return (
    <section className="student-page">
      <div className="student-welcome"><div><span className="eyebrow">DASHBOARD MAHASISWA</span><h1>Halo, {profile.full_name}</h1><p>Kelola laporan fasilitas kampus dan pantau perkembangannya.</p></div><button className="button button-primary" onClick={() => onNavigate('/mahasiswa/laporan/baru')}>+ Buat laporan</button></div>
      {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
      <div className="summary-grid">
        <article className="summary-card"><span className="summary-icon">▤</span><span className="summary-label">Laporan saya</span><strong>{loading ? '—' : mine.length}</strong><small>Total laporan yang Anda buat</small></article>
        <article className="summary-card"><span className="summary-icon summary-icon-yellow">◷</span><span className="summary-label">Sedang diproses</span><strong>{loading ? '—' : inProgress}</strong><small>Dalam tindak lanjut petugas</small></article>
        <article className="summary-card"><span className="summary-icon summary-icon-blue">✓</span><span className="summary-label">Selesai</span><strong>{loading ? '—' : completed}</strong><small>Laporan sudah ditangani</small></article>
      </div>
      <div className="student-section-heading"><div><h2>Laporan terbaru</h2><p>Pantau masalah yang baru disampaikan komunitas kampus.</p></div><button className="text-link" onClick={() => onNavigate('/mahasiswa/laporan')}>Lihat semua <span aria-hidden="true">&#8594;</span></button></div>
      {loading ? <div className="student-empty compact">Memuat laporan...</div> : recent.length === 0 ? <div className="student-empty compact"><h2>Belum ada laporan</h2><p>Mulai dengan menyampaikan masalah fasilitas kampus.</p><button className="button button-primary" onClick={() => onNavigate('/mahasiswa/laporan/baru')}>Buat laporan</button></div> : <div className="recent-reports">
        {recent.map((report) => <button className="recent-report-row" key={report.id} onClick={() => onNavigate(`/mahasiswa/laporan/${report.id}`)}><span className="recent-status-dot" /><span className="recent-report-copy"><strong>{report.title}</strong><small>{report.faculty} · {report.building}</small></span><span className={`status-pill status-${report.status}`}>{statusLabels[report.status]}</span><span className="recent-votes">♥ {report.vote_count}</span></button>)}
      </div>}
    </section>
  )
}
