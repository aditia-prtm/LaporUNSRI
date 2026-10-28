import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Report, ReportComment } from '../../types/report'
import { addReportComment, deleteReport, getReport, getReportComments, toggleReportVote } from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { ReportStatusBadge } from '../../components/report/ReportStatusBadge'
import { formatDateTime } from '../../utils/date'
import { FiArrowLeft, FiEdit3, FiHeart, FiMapPin, FiMessageSquare, FiSend, FiTrash2, FiUser } from 'react-icons/fi'

type ReportDetailPageProps = {
  profile: UserProfile
  reportId: string
  onNavigate: (path: string) => void
}

function loadReportDetail(reportId: string, userId: string) {
  return Promise.all([getReport(reportId, userId), getReportComments(reportId)])
}

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
      const [nextReport, nextComments] = await loadReportDetail(reportId, profile.id)
      setReport(nextReport)
      setComments(nextComments)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Laporan gagal dimuat.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    void loadReportDetail(reportId, profile.id)
      .then(([nextReport, nextComments]) => {
        if (!active) return
        setReport(nextReport)
        setComments(nextComments)
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
  }, [reportId, profile.id])

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
      setError(cause instanceof Error ? cause.message : 'Dukungan gagal disimpan.')
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

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#072445]/45 p-12 text-center text-xs text-[#8cb6dc] backdrop-blur-md">
        Memuat detail laporan...
      </div>
    )
  }

  if (!report) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#072445]/30 p-12 text-center backdrop-blur-md">
        <h2 className="text-base font-bold text-white">Laporan Tidak Ditemukan</h2>
        <p className="mt-1 text-xs text-[#8cb6dc]">
          Periksa tautan Anda atau kembali ke katalog laporan fasilitas.
        </p>
        <button
          type="button"
          onClick={() => onNavigate('/mahasiswa/laporan')}
          className="mt-4 rounded-xl bg-gradient-to-r from-[#60b6ff] to-[#2b8ced] px-4 py-2 text-xs font-bold text-[#021427]"
        >
          Kembali ke Daftar Laporan
        </button>
      </div>
    )
  }

  const isOwner = report.user_id === profile.id

  return (
    <div className="space-y-6 max-w-4xl">
      <button
        type="button"
        onClick={() => onNavigate('/mahasiswa/laporan')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8cb6dc] hover:text-white transition-colors cursor-pointer"
      >
        <FiArrowLeft className="size-3.5" />
        <span>Semua Laporan</span>
      </button>

      {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}

      {/* Main Report Card */}
      <article className="rounded-3xl border border-white/10 bg-[#072445]/45 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/20">
        {/* Topline Status & Meta */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-[#8cb6dc]">
          <div className="flex items-center gap-2">
            <ReportStatusBadge status={report.status} />
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-[#8fc3ee]">
              {report.categories?.name ?? 'Lainnya'}
            </span>
          </div>
          <time className="text-xs text-[#8cb6dc]">{formatDateTime(report.created_at)}</time>
        </div>

        {/* Title */}
        <h1 className="mt-4 font-['Poppins','Montserrat','Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {report.title}
        </h1>

        {/* Location & Reporter */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-[#8cb6dc]">
          <div className="flex items-center gap-1.5">
            <FiMapPin className="size-3.5 text-[#60b6ff]" />
            <span>
              {report.faculty} · {report.building}
              {report.room ? ` · ${report.room}` : ''}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FiUser className="size-3.5 text-[#60b6ff]" />
            <span>
              Pelapor: <strong className="font-semibold text-white">{report.profiles?.full_name ?? 'Mahasiswa'}</strong>
            </span>
          </div>
        </div>

        {/* Attached Photo */}
        {report.photo_url && (
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-black/40">
            <img
              className="max-h-[460px] w-full object-contain"
              src={report.photo_url}
              alt={`Foto bukti untuk ${report.title}`}
            />
          </div>
        )}

        {/* Description */}
        <div className="mt-6 border-t border-b border-white/10 py-5 text-sm leading-relaxed text-[#cce5fb] whitespace-pre-wrap">
          {report.description}
        </div>

        {/* Action Controls */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          {!isOwner ? (
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleVote()}
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                report.voted_by_me
                  ? 'border-rose-500/40 bg-rose-500/20 text-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.3)]'
                  : 'border-white/20 bg-white/5 text-[#cce5fb] hover:border-white/40 hover:bg-white/10'
              }`}
            >
              <FiHeart className={`size-4 ${report.voted_by_me ? 'fill-rose-400 text-rose-400' : 'text-rose-400'}`} />
              <span>Saya juga mengalami masalah ini</span>
              <b className="ml-1 rounded-full bg-white/15 px-2 py-0.5 text-xs text-white">
                {report.vote_count}
              </b>
            </button>
          ) : (
            <div className="text-xs text-[#8cb6dc]">
              Didukung oleh <strong className="text-white">{report.vote_count}</strong> sivitas kampus
            </div>
          )}

          {isOwner && (
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => onNavigate(`/mahasiswa/laporan/${report.id}/edit`)}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-[#cce5fb] transition hover:bg-white/15 hover:text-white cursor-pointer"
              >
                <FiEdit3 className="size-3.5" />
                <span>Ubah Laporan</span>
              </button>
              <button
                type="button"
                disabled={busy}
                onClick={() => void handleDelete()}
                className="inline-flex items-center gap-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 hover:border-rose-500/50 cursor-pointer"
              >
                <FiTrash2 className="size-3.5" />
                <span>Hapus Laporan</span>
              </button>
            </div>
          )}
        </div>
      </article>

      {/* Discussion & Follow-up Timeline */}
      <section className="space-y-4">
        <div>
          <h2 className="flex items-center gap-2 font-['Poppins','Montserrat','Outfit',sans-serif] text-lg font-bold text-white">
            <FiMessageSquare className="size-4 text-[#60b6ff]" />
            <span>Diskusi & Catatan Tindak Lanjut</span>
          </h2>
          <p className="text-xs text-[#8cb6dc]">
            Informasi tambahan dari mahasiswa maupun catatan perbaikan dari petugas fasilitas.
          </p>
        </div>

        {/* Comment input form */}
        <form
          className="rounded-2xl border border-white/10 bg-[#072445]/45 p-4 backdrop-blur-md shadow-lg"
          onSubmit={(event) => void submitComment(event)}
        >
          <textarea
            required
            rows={3}
            maxLength={1000}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder="Tuliskan komentar, tanggapan, atau informasi perkembangan fasilitas terkait..."
            className="w-full rounded-xl border border-white/15 bg-[#031528]/80 p-3 text-xs text-white placeholder:text-[#8cb6dc]/50 backdrop-blur-md transition-all focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 resize-vertical"
          />
          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              disabled={busy || !message.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#60b6ff] to-[#2b8ced] px-4 py-2 text-xs font-bold text-[#021427] shadow-[0_4px_16px_rgba(58,147,232,0.35)] transition-all hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FiSend className="size-3.5" />
              <span>{busy ? 'Mengirim...' : 'Kirim Komentar'}</span>
            </button>
          </div>
        </form>

        {/* Comment items list */}
        <div className="space-y-3">
          {comments.length ? (
            comments.map((comment) => (
              <article
                key={comment.id}
                className="flex items-start gap-3 rounded-2xl border border-white/10 bg-[#072445]/35 p-4 backdrop-blur-md"
              >
                <div className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0c4278] to-[#60b6ff] text-xs font-bold text-white shadow-sm">
                  {(comment.profiles?.full_name ?? '?').slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <strong className="text-xs font-bold text-white">
                      {comment.profiles?.full_name ?? 'Pengguna'}
                    </strong>
                    <time className="text-[10px] text-[#8cb6dc]">
                      {formatDateTime(comment.created_at)}
                    </time>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-[#cce5fb] whitespace-pre-wrap">
                    {comment.message}
                  </p>
                  {comment.photo_url && (
                    <div className="mt-3">
                      <a
                        href={comment.photo_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-block group"
                      >
                        <img
                          src={comment.photo_url}
                          alt="Foto bukti tindak lanjut"
                          className="max-h-48 max-w-xs rounded-xl border border-white/15 object-cover transition-transform group-hover:scale-102"
                        />
                        <span className="mt-1 block text-[10px] font-semibold text-[#60b6ff]">
                          Lihat foto bukti resolusi penuh ↗
                        </span>
                      </a>
                    </div>
                  )}
                </div>
              </article>
            ))
          ) : (
            <p className="rounded-xl border border-dashed border-white/10 p-6 text-center text-xs text-[#8cb6dc]">
              Belum ada komentar untuk laporan ini. Berikan informasi pertama jika ada keterangan lanjutan.
            </p>
          )}
        </div>
      </section>
    </div>
  )
}
export default ReportDetailPage
