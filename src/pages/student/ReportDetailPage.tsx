import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Report, ReportComment } from '../../types/report'
import {
  addReportComment,
  confirmReportCompletion,
  deleteReport,
  getCachedReport,
  getCachedReportComments,
  getReport,
  getReportComments,
  toggleReportVote,
} from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { ReportDetailSkeleton, Skeleton } from '../../components/common/Skeleton'
import { formatDateTime } from '../../utils/date'
import { FiArrowLeft, FiCheck, FiEdit3, FiHeart, FiMapPin, FiMessageSquare, FiSend, FiTrash2, FiUser } from 'react-icons/fi'
import { LocationViewerMap } from '../../components/report/LocationViewerMap'

type ReportDetailPageProps = {
  profile: UserProfile
  reportId: string
  onNavigate: (path: string) => void
}

function loadReportDetail(reportId: string, userId: string) {
  return Promise.all([getReport(reportId, userId), getReportComments(reportId)])
}

export function ReportDetailPage({ profile, reportId, onNavigate }: ReportDetailPageProps) {
  const cachedReport = getCachedReport(reportId)
  const cachedComments = getCachedReportComments(reportId)
  const [report, setReport] = useState<Report | null>(() => cachedReport)
  const [comments, setComments] = useState<ReportComment[]>(() => cachedComments ?? [])
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(() => !cachedReport)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [confirming, setConfirming] = useState(false)
  const [feedbackNote, setFeedbackNote] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  const load = async (silent = false) => {
    if (!silent) setLoading(true)
    setError('')
    try {
      const [nextReport, nextComments] = await loadReportDetail(reportId, profile.id)
      setReport(nextReport)
      setComments(nextComments)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Laporan gagal dimuat.')
    } finally {
      if (!silent) setLoading(false)
    }
  }

  const handleConfirmCompletion = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!report) return
    setConfirming(true)
    setError('')
    try {
      await confirmReportCompletion(report.id, feedbackNote)
      setSuccessMessage('Terima kasih! Laporan Anda telah berhasil dikonfirmasi selesai.')
      setFeedbackNote('')
      await load(true)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Konfirmasi penyelesaian gagal disimpan.')
    } finally {
      setConfirming(false)
    }
  }

  useEffect(() => {
    let active = true
    const currentCached = getCachedReport(reportId)
    if (!currentCached) {
      setLoading(true)
    }
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
      await load(true)
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

  const isOwner = report?.user_id === profile.id

  return (
    <div className="w-full flex flex-col">
      {/* Navy Top Banner */}
      <section className="w-full bg-[#08315c] text-white px-4 sm:px-8 lg:px-12 py-8 shadow-inner">
        <div className="mx-auto max-w-[1040px] space-y-3">
          <button
            type="button"
            onClick={() => onNavigate('/mahasiswa/laporan')}
            className="inline-flex min-h-[38px] items-center gap-2 text-xs font-semibold text-sky-200 hover:text-white transition cursor-pointer"
          >
            <FiArrowLeft className="size-4" aria-hidden="true" />
            <span>Kembali ke Semua Laporan</span>
          </button>

          {loading ? (
            <div className="space-y-2 pt-1">
              <Skeleton className="h-5 w-28 rounded-full" variant="dark" />
              <Skeleton className="h-8 w-72 max-w-full" variant="dark" />
            </div>
          ) : report ? (
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/10 border border-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ffbb00]">
                  {report.categories?.name ?? 'Umum'}
                </span>
                <span className="text-sky-200/80 text-xs">{formatDateTime(report.created_at)}</span>
              </div>
              <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {report.title}
              </h1>
            </div>
          ) : null}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-8">
        <div className="mx-auto max-w-[1040px] space-y-6">
          {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
          {successMessage && <FeedbackMessage tone="success">{successMessage}</FeedbackMessage>}

          {loading ? (
            <ReportDetailSkeleton />
          ) : !report ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">
              <h2 className="text-base font-bold text-slate-800">Laporan Tidak Ditemukan</h2>
              <p className="mt-1 text-xs text-slate-500">
                Periksa tautan Anda atau kembali ke katalog laporan fasilitas.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('/mahasiswa/laporan')}
                className="mt-4 rounded-xl bg-[#08315c] text-white px-5 py-2 text-xs font-bold"
              >
                Kembali ke Daftar Laporan
              </button>
            </div>
          ) : (
            <>
              {/* Report Main Card */}
              <article className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
                {/* Meta details */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <FiMapPin className="size-4 text-[#08315c]" aria-hidden="true" />
                      <span>
                        {report.faculty} · {report.building}
                        {report.room ? ` · ${report.room}` : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiUser className="size-4 text-slate-400" aria-hidden="true" />
                      <span>
                        Pelapor: <strong className="font-semibold text-slate-800">{report.profiles?.full_name ?? 'Mahasiswa'}</strong>
                      </span>
                    </div>
                  </div>

                  <div>
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
                  </div>
                </div>

                {/* Attached Photo */}
                {report.photo_url && (
                  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-900/5">
                    <img
                      className="max-h-[460px] w-full object-contain"
                      src={report.photo_url}
                      alt={`Foto bukti untuk ${report.title}`}
                    />
                  </div>
                )}

                {/* Description */}
                <div className="text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {report.description}
                </div>

                {/* Location Map if coordinates are present */}
                {typeof report.latitude === 'number' && typeof report.longitude === 'number' && (
                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                      <span className="flex items-center gap-1.5">
                        <FiMapPin className="size-4 text-[#08315c]" aria-hidden="true" />
                        <span>Titik Lokasi Kerusakan pada Peta</span>
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {report.faculty} · {report.building}
                      </span>
                    </div>
                    <LocationViewerMap
                      latitude={report.latitude}
                      longitude={report.longitude}
                      title={report.title}
                      locationName={`${report.faculty} · ${report.building}${report.room ? ` · ${report.room}` : ''}`}
                    />
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-5">
                  {!isOwner ? (
                    <button
                      type="button"
                      disabled={busy}
                      onClick={() => void handleVote()}
                      className={`inline-flex min-h-[44px] items-center gap-2 rounded-xl border px-4 py-2.5 text-xs font-bold transition cursor-pointer ${
                        report.voted_by_me
                          ? 'border-rose-400 bg-rose-50 text-rose-600 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <FiHeart
                        className={`size-4 ${report.voted_by_me ? 'fill-rose-500 text-rose-500' : 'text-rose-500'}`}
                        aria-hidden="true"
                      />
                      <span>Saya juga mengalami kendala ini</span>
                      <b className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-800">
                        {report.vote_count}
                      </b>
                    </button>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Didukung oleh <strong className="text-slate-800">{report.vote_count}</strong> sivitas kampus
                    </div>
                  )}

                  {isOwner && report.status === 'belum_diproses' && (
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onNavigate(`/mahasiswa/laporan/${report.id}/edit`)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
                      >
                        <FiEdit3 className="size-4" aria-hidden="true" />
                        <span>Ubah Laporan</span>
                      </button>
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleDelete()}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 transition cursor-pointer"
                      >
                        <FiTrash2 className="size-4" aria-hidden="true" />
                        <span>Hapus Laporan</span>
                      </button>
                    </div>
                  )}
                </div>
              </article>

              {/* Reporter Confirmation Card */}
              {report.status === 'menunggu_konfirmasi' && isOwner && (
                <section className="rounded-3xl border border-indigo-200 bg-indigo-50/60 p-6 sm:p-7 shadow-sm space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-sm">
                      <FiCheck className="size-6 stroke-[3]" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg font-bold text-slate-900">
                        Konfirmasi Penyelesaian Fasilitas
                      </h2>
                      <p className="mt-1 text-xs sm:text-sm text-slate-600 leading-relaxed">
                        Petugas telah menyelesaikan perbaikan dan memperbarui laporan ini. Mohon verifikasi apakah fasilitas di lokasi telah berfungsi dengan baik sebelum laporan resmi ditutup.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={(e) => void handleConfirmCompletion(e)} className="space-y-3 pt-2">
                    <label className="block text-xs font-semibold text-slate-700">
                      <span className="mb-1 block text-[11px] text-slate-500">
                        Catatan atau Ulasan Singkat (Opsional)
                      </span>
                      <textarea
                        rows={2}
                        maxLength={500}
                        value={feedbackNote}
                        onChange={(e) => setFeedbackNote(e.target.value)}
                        placeholder="Contoh: AC sudah dingin kembali dan berfungsi normal..."
                        className="w-full rounded-xl border border-slate-200 bg-white p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/15 transition resize-vertical"
                      />
                    </label>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <p className="text-[11px] text-slate-500">
                        Setelah dikonfirmasi, status laporan akan berubah menjadi <strong>Selesai</strong> dan tidak dapat diubah kembali.
                      </p>
                      <button
                        type="submit"
                        disabled={confirming}
                        className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      >
                        <FiCheck className="size-4 stroke-[3]" aria-hidden="true" />
                        <span>{confirming ? 'Menyimpan...' : 'Ya, Fasilitas Sudah Benar-Benar Selesai'}</span>
                      </button>
                    </div>
                  </form>
                </section>
              )}

              {/* Waiting Confirmation Banner for other users */}
              {report.status === 'menunggu_konfirmasi' && !isOwner && (
                <div className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5 text-xs text-indigo-900 flex items-center gap-3">
                  <FiCheck className="size-5 text-indigo-600 shrink-0 stroke-[2.5]" aria-hidden="true" />
                  <span>
                    Petugas telah menyatakan perbaikan fasilitas ini selesai. Laporan saat ini sedang menunggu konfirmasi akhir dari mahasiswa pelapor.
                  </span>
                </div>
              )}

              {/* Discussion & Follow-up Timeline */}
              <section className="space-y-4 pt-2">
                <div>
                  <h2 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                    <FiMessageSquare className="size-5 text-[#08315c]" aria-hidden="true" />
                    <span>Diskusi & Catatan Tindak Lanjut</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Informasi tambahan dari pelapor maupun pembaruan progres teknisi sarpras.
                  </p>
                </div>

                {/* Comment input form */}
                <form
                  className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-sm space-y-3"
                  onSubmit={(event) => void submitComment(event)}
                >
                  <textarea
                    required
                    rows={3}
                    maxLength={1000}
                    value={message}
                    onChange={(event) => setMessage(event.target.value)}
                    placeholder="Tuliskan komentar, tanggapan, atau informasi perkembangan fasilitas terkait..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/20 transition resize-vertical"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={busy || !message.trim()}
                      className="inline-flex min-h-[40px] items-center gap-2 rounded-xl bg-[#08315c] hover:bg-[#0c4278] px-5 py-2 text-xs font-bold text-white shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      <FiSend className="size-4" aria-hidden="true" />
                      <span>{busy ? 'Mengirim...' : 'Kirim Komentar'}</span>
                    </button>
                  </div>
                </form>

                {/* Comments list */}
                <div className="space-y-3">
                  {comments.length ? (
                    comments.map((comment) => (
                      <article
                        key={comment.id}
                        className="flex items-start gap-3.5 rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-sm"
                      >
                        <div className="grid size-9 shrink-0 place-items-center rounded-full bg-[#08315c] text-xs font-bold text-white shadow-sm">
                          {(comment.profiles?.full_name ?? '?').slice(0, 1).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <strong className="text-xs font-bold text-slate-800">
                              {comment.profiles?.full_name ?? 'Pengguna'}
                            </strong>
                            <time className="text-[10px] text-slate-400">
                              {formatDateTime(comment.created_at)}
                            </time>
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
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
                                  className="max-h-52 max-w-sm rounded-xl border border-slate-200 object-cover transition-transform group-hover:scale-102"
                                />
                                <span className="mt-1.5 block text-[11px] font-semibold text-[#08315c] hover:underline">
                                  Buka foto bukti resolusi penuh
                                </span>
                              </a>
                            </div>
                          )}
                        </div>
                      </article>
                    ))
                  ) : (
                    <p className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-xs text-slate-400">
                      Belum ada komentar untuk laporan ini. Berikan keterangan lanjutan jika ada perkembangan baru.
                    </p>
                  )}
                </div>
              </section>
            </>
          )}
        </div>
      </section>
    </div>
  )
}
export default ReportDetailPage
