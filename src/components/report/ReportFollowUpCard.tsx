import type { FormEvent } from 'react'
import type { Report, ReportStatus } from '../../types/report'
import { formatDate } from '../../utils/date'
import { FiAlertTriangle, FiArrowUpRight, FiCamera, FiCheck, FiMapPin, FiUser } from 'react-icons/fi'

export type ReportFollowUpDraft = {
  status: ReportStatus
  message: string
  file: File | null
}

type ReportFollowUpCardProps = {
  report: Report
  draft: ReportFollowUpDraft
  busy: boolean
  photoRequired: boolean
  submitLabel: string
  overdueDays?: number
  onDraftChange: (patch: Partial<ReportFollowUpDraft>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

export function ReportFollowUpCard({
  report,
  draft,
  busy,
  photoRequired,
  submitLabel,
  overdueDays,
  onDraftChange,
  onSubmit,
}: ReportFollowUpCardProps) {
  return (
    <article className="group relative grid grid-cols-1 lg:grid-cols-[1fr_minmax(300px,380px)] gap-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm transition-all duration-200 hover:border-[#08315c]/40 hover:shadow-md">
      {/* Left: Report Overview */}
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
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
            ) : report.status === 'menunggu_konfirmasi' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                <span className="size-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
                <span>Menunggu Konfirmasi</span>
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
            <time className="text-[11px] text-slate-500">{formatDate(report.created_at)}</time>

            {overdueDays !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
                <FiAlertTriangle className="size-3 text-rose-500" aria-hidden="true" />
                <span>Terlambat {overdueDays} hari</span>
              </span>
            )}
          </div>

          <h3 className="mt-3.5 text-base sm:text-lg font-bold text-slate-800 transition-colors group-hover:text-[#08315c]">
            {report.title}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
            {report.description}
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
            <FiMapPin className="size-3.5 text-[#08315c]" aria-hidden="true" />
            <span>
              {report.faculty} · {report.building}
              {report.room ? ` · ${report.room}` : ''}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500">
            <FiUser className="size-3 text-slate-400" aria-hidden="true" />
            <span>
              Pelapor: <strong className="text-slate-700 font-semibold">{report.profiles?.full_name ?? 'Mahasiswa'}</strong> · Dukungan {report.vote_count}
            </span>
          </div>
        </div>

        {report.photo_url && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <a
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#08315c] hover:underline transition-colors"
              href={report.photo_url}
              target="_blank"
              rel="noreferrer"
            >
              <span>Buka foto bukti laporan</span>
              <FiArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        )}
      </div>

      {/* Right: Follow-up Action Form */}
      {report.status === 'menunggu_konfirmasi' ? (
        <div className="flex flex-col justify-center rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-center lg:border-t-0 lg:border-l lg:rounded-none lg:bg-transparent lg:p-0 lg:pl-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
            <FiCheck className="size-6 stroke-[2.5]" aria-hidden="true" />
          </div>
          <h4 className="mt-3 text-sm font-bold text-slate-800">Menunggu Konfirmasi Pelapor</h4>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Bukti penanganan telah dicatat. Sistem sedang menunggu konfirmasi dari mahasiswa pelapor apakah fasilitas sudah benar-benar berfungsi normal.
          </p>
        </div>
      ) : report.status === 'selesai' ? (
        <div className="flex flex-col justify-center rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 text-center lg:border-t-0 lg:border-l lg:rounded-none lg:bg-transparent lg:p-0 lg:pl-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <FiCheck className="size-6 stroke-[3]" aria-hidden="true" />
          </div>
          <h4 className="mt-3 text-sm font-bold text-slate-800">Laporan Telah Tuntas</h4>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Penanganan fasilitas telah selesai dan telah dikonfirmasi tuntas oleh pelapor. Status bersifat final.
          </p>
        </div>
      ) : (
        <form
          className="flex flex-col justify-between gap-3.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6"
          onSubmit={onSubmit}
        >
          <div className="space-y-3">
            <span className="block text-xs font-bold uppercase tracking-wider text-[#08315c]">
              {photoRequired ? 'Catat Tindak Lanjut Petugas' : 'Tindak Lanjut & Status'}
            </span>

            <label className="block text-xs font-semibold text-slate-700">
              <span className="mb-1 block text-[11px] text-slate-500">Ubah Status Laporan</span>
              <select
                aria-label={`Status baru untuk ${report.title}`}
                value={draft.status}
                onChange={(event) => onDraftChange({ status: event.target.value as ReportStatus })}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 shadow-sm focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/15 transition cursor-pointer"
              >
                {report.status === 'belum_diproses' ? (
                  <option value="diproses">Mulai Tangani (Ubah ke Diproses)</option>
                ) : (
                  <option value="menunggu_konfirmasi">Selesai (Ajukan Konfirmasi ke Pelapor)</option>
                )}
              </select>
            </label>

            <label className="block text-xs font-semibold text-slate-700">
              <span className="mb-1 block text-[11px] text-slate-500">
                Catatan Penanganan <span className="text-rose-500">*</span>
              </span>
              <textarea
                required
                maxLength={1000}
                rows={3}
                placeholder={
                  photoRequired
                    ? 'Jelaskan tindakan perbaikan yang telah dilakukan...'
                    : 'Tuliskan catatan tindak lanjut untuk pelapor...'
                }
                value={draft.message}
                onChange={(event) => onDraftChange({ message: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/15 transition resize-vertical"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-700">
              <span className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <FiCamera className="size-3.5 text-[#08315c]" aria-hidden="true" />
                  <span>Foto Bukti Penanganan</span>
                </span>
                <span className="text-[10px] text-slate-400">{photoRequired ? 'Wajib' : 'Opsional'}</span>
              </span>
              <input
                required={photoRequired}
                type="file"
                accept="image/*"
                onChange={(event) => onDraftChange({ file: event.target.files?.[0] ?? null })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600 file:mr-2.5 file:rounded-lg file:border-0 file:bg-[#08315c] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white file:cursor-pointer hover:file:bg-[#0c4278]"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-2 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-[#08315c] hover:bg-[#0c4278] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FiCheck className="size-4 stroke-[3]" aria-hidden="true" />
            <span>{busy ? 'Menyimpan...' : submitLabel}</span>
          </button>
        </form>
      )}
    </article>
  )
}
export default ReportFollowUpCard
