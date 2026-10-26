import { useEffect, useState } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Report } from '../../types/report'
import { getReports } from '../../services/reportService'
import { MetricCard } from '../../components/common/MetricCard'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { ReportStatusBadge } from '../../components/report/ReportStatusBadge'
import { countReportsByStatus } from '../../utils/report'
import { FiArrowRight, FiCheck, FiClock, FiFileText, FiHeart } from 'react-icons/fi'

type StudentDashboardPageProps = { profile: UserProfile; onNavigate: (path: string) => void }


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
  const { diproses: inProgress, selesai: completed } = countReportsByStatus(mine)
  const recent = reports.slice(0, 4)

  return (
    <section className="student-page">
      <div className="student-welcome"><div><span className="eyebrow">DASHBOARD MAHASISWA</span><h1>Halo, {profile.full_name}</h1><p>Kelola laporan fasilitas kampus dan pantau perkembangannya.</p></div><button className="button button-primary" onClick={() => onNavigate('/mahasiswa/laporan/baru')}>+ Buat laporan</button></div>
      {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
      <div className="summary-grid">
        <MetricCard label="Laporan saya" value={loading ? '—' : mine.length} description="Total laporan yang Anda buat" icon={<FiFileText />} />
        <MetricCard label="Sedang diproses" value={loading ? '—' : inProgress} description="Dalam tindak lanjut petugas" icon={<FiClock />} iconClassName="summary-icon-yellow" />
        <MetricCard label="Selesai" value={loading ? '—' : completed} description="Laporan sudah ditangani" icon={<FiCheck />} iconClassName="summary-icon-blue" />
      </div>
      <div className="student-section-heading"><div><h2>Laporan terbaru</h2><p>Pantau masalah yang baru disampaikan komunitas kampus.</p></div><button className="text-link" onClick={() => onNavigate('/mahasiswa/laporan')}>Lihat semua <FiArrowRight aria-hidden="true" /></button></div>
      {loading ? <div className="student-empty compact">Memuat laporan...</div> : recent.length === 0 ? <div className="student-empty compact"><h2>Belum ada laporan</h2><p>Mulai dengan menyampaikan masalah fasilitas kampus.</p><button className="button button-primary" onClick={() => onNavigate('/mahasiswa/laporan/baru')}>Buat laporan</button></div> : <div className="recent-reports">
        {recent.map((report) => <button className="recent-report-row" key={report.id} onClick={() => onNavigate(`/mahasiswa/laporan/${report.id}`)}><span className="recent-status-dot" /><span className="recent-report-copy"><strong>{report.title}</strong><small>{report.faculty} · {report.building}</small></span><ReportStatusBadge status={report.status} /><span className="recent-votes"><FiHeart aria-hidden="true" /> {report.vote_count}</span></button>)}
      </div>}
    </section>
  )
}
