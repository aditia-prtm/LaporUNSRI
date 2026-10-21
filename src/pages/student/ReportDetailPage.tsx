import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Report, ReportComment } from '../../types/report'
import { addReportComment, deleteReport, getReport, getReportComments, toggleReportVote } from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'

type ReportDetailPageProps = {
  profile: UserProfile
  reportId: string
  onNavigate: (path: string) => void
}

const statusLabels = { belum_diproses: 'Belum diproses', diproses: 'Diproses', selesai: 'Selesai' }

export function ReportDetailPage({ profile, reportId, onNavigate }: ReportDetailPageProps) {
  const [report, setReport] = useState<Report | null>(null)
  const [comments, setComments] = useState<ReportComment[]>([])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [nextReport, nextComments] = await Promise.all([
        getReport(reportId, profile.id),
        getReportComments(reportId),
      ])
      setReport(nextReport)
      setComments(nextComments)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Laporan gagal dimuat.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [reportId, profile.id])

  const submitComment = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!message.trim()) return
    setBusy(true)
    setError('')
    try {
      await addReportComment(reportId, profile.id, message.trim())
      setMessage('')
      await load()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Komentar gagal dikirim.')
    } finally {
      setBusy(false)
    }
  }

  const handleVote = async () => {
    if (!report) return
    setBusy(true)
    setError('')
    try {
      await toggleReportVote(report.id, profile.id, report.voted_by_me)
      const updated = await getReport(report.id, profile.id)
      setReport(updated)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Vote gagal disimpan.')
    } finally {
      setBusy(false)
    }
  }

  const handleDelete = async () => {
    if (!report || !window.confirm('Hapus laporan ini? Tindakan ini tidak dapat dibatalkan.')) return
    setBusy(true)
    setError('')
    try {
      await deleteReport(report.id)
      onNavigate('/mahasiswa/laporan-saya')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Laporan gagal dihapus.')
    } finally {
      setBusy(false)
    }
  }

  if (loading) return <div className="student-empty">Memuat laporan...</div>
  if (!report) return <div className="student-empty"><h2>Laporan tidak ditemukan</h2><p>Periksa tautan atau kembali ke daftar laporan.</p><button className="button button-outline" onClick={() => onNavigate('/mahasiswa/laporan')}>Kembali ke laporan</button></div>

  const isOwner = report.user_id === profile.id

  return (
    <section className="student-page detail-page">
      <button className="text-link form-back" onClick={() => onNavigate('/mahasiswa/laporan')}><span aria-hidden="true">&#8592;</span> Semua laporan</button>
      {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
      <article className="report-detail-card">
        <div className="detail-topline"><span className={`status-pill status-${report.status}`}>{statusLabels[report.status]}</span><span>{report.categories?.name ?? 'Lainnya'}</span><time>{new Date(report.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</time></div>
        <h1>{report.title}</h1>
        <p className="detail-location">{report.faculty} <span>·</span> {report.building}{report.room ? ` · ${report.room}` : ''}</p>
        <p className="detail-author">Dilaporkan oleh <strong>{report.profiles?.full_name ?? 'Mahasiswa'}</strong></p>
        {report.photo_url && <img className="detail-photo" src={report.photo_url} alt={`Bukti foto untuk ${report.title}`} />}
        <div className="detail-description">{report.description}</div>
        <div className="detail-actions">
          {!isOwner && <button className={report.voted_by_me ? 'vote-button is-voted' : 'vote-button'} disabled={busy} onClick={() => void handleVote()}><span aria-hidden="true">{report.voted_by_me ? '♥' : '♡'}</span> Saya juga mengalami <b>{report.vote_count}</b></button>}
          {isOwner && <><button className="button button-outline" onClick={() => onNavigate(`/mahasiswa/laporan/${report.id}/edit`)}>Ubah laporan</button><button className="button button-danger" disabled={busy} onClick={() => void handleDelete()}>Hapus</button></>}
        </div>
      </article>

      <section className="comments-section">
        <div className="student-section-heading"><div><h2>Diskusi dan tindak lanjut</h2><p>Gunakan komentar untuk memberi informasi tambahan pada laporan.</p></div></div>
        <form className="comment-form" onSubmit={(event) => void submitComment(event)}><textarea required rows={3} maxLength={1000} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="Tulis komentar atau informasi tambahan..." /><button className="button button-primary" disabled={busy || !message.trim()}>{busy ? 'Mengirim...' : 'Kirim komentar'}</button></form>
        <div className="comment-list">{comments.length ? comments.map((comment) => <article className="comment-card" key={comment.id}><div className="comment-avatar">{(comment.profiles?.full_name ?? '?').slice(0, 1).toUpperCase()}</div><div><div className="comment-meta"><strong>{comment.profiles?.full_name ?? 'Pengguna'}</strong><time>{new Date(comment.created_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</time></div><p>{comment.message}</p>{comment.photo_url && <a className="comment-evidence-link" href={comment.photo_url} target="_blank" rel="noreferrer"><img src={comment.photo_url} alt="Foto bukti tindak lanjut" />Lihat foto bukti</a>}</div></article>) : <p className="comments-empty">Belum ada komentar. Tambahkan informasi jika diperlukan.</p>}</div>
      </section>
    </section>
  )
}
