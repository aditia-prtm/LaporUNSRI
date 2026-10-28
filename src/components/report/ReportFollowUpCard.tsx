import type { FormEvent } from 'react'
import type { Report, ReportStatus } from '../../types/report'
import { REPORT_STATUS_LABELS } from '../../constants/report'
import { ReportStatusBadge } from './ReportStatusBadge'
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
    <article className="group relative grid grid-cols-1 lg:grid-cols-[1fr_minmax(280px,360px)] gap-6 rounded-2xl border border-white/10 bg-[#072445]/45 p-5 sm:p-6 backdrop-blur-md shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#4899e8]/40 hover:bg-[#092c55]/55">
      {/* Left: Report Overview */}
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-[#8cb6dc]">
            <ReportStatusBadge status={report.status} />
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-medium text-[#cce5fb]">
              {report.categories?.name ?? 'Lainnya'}
            </span>
            <time className="text-[11px] text-[#8cb6dc]/80">{formatDate(report.created_at)}</time>
            {overdueDays !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full border border-rose-500/30 bg-rose-500/10 px-2.5 py-0.5 text-[10px] font-bold text-rose-300">
                <FiAlertTriangle className="size-3" />
                <span>Terlambat {overdueDays} hari</span>
              </span>
            )}
          </div>

          <h3 className="mt-3.5 font-['Poppins','Montserrat','Outfit',sans-serif] text-base sm:text-lg font-bold text-white transition-colors group-hover:text-[#c4e4ff]">
            {report.title}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-[#a4c1db] line-clamp-3">
            {report.description}
          </p>

          <div className="mt-4 flex items-center gap-1.5 text-xs text-[#8cb6dc]">
            <FiMapPin className="size-3.5 text-[#60b6ff]" />
            <span>
              {report.faculty} · {report.building}
              {report.room ? ` · ${report.room}` : ''}
            </span>
          </div>

          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-[#6f96be]">
            <FiUser className="size-3 text-[#6f96be]" />
            <span>
              Pelapor: <strong className="text-[#a4c1db] font-semibold">{report.profiles?.full_name ?? 'Mahasiswa'}</strong> · Dukungan {report.vote_count}
            </span>
          </div>
        </div>

        {report.photo_url && (
          <div className="mt-4 pt-3 border-t border-white/10">
            <a
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#60b6ff] hover:text-[#93d5ba] transition-colors"
              href={report.photo_url}
              target="_blank"
              rel="noreferrer"
            >
              <span>Buka foto bukti laporan</span>
              <FiArrowUpRight className="size-3.5" />
            </a>
          </div>
        )}
      </div>

      {/* Right: Follow-up Action Form */}
      <form
        className="flex flex-col justify-between gap-3.5 border-t lg:border-t-0 lg:border-l border-white/10 pt-4 lg:pt-0 lg:pl-6"
        onSubmit={onSubmit}
      >
        <div className="space-y-3">
          <span className="block text-xs font-bold uppercase tracking-wider text-[#60b6ff]">
            {photoRequired ? 'Catat Tindak Lanjut Petugas' : 'Tindak Lanjut & Status'}
          </span>

          <label className="block text-xs font-medium text-[#cce5fb]">
            <span className="mb-1 block text-[11px] text-[#8cb6dc]">Ubah Status</span>
            <select
              aria-label={`Status baru untuk ${report.title}`}
              value={draft.status}
              onChange={(event) => onDraftChange({ status: event.target.value as ReportStatus })}
              className="h-10 w-full rounded-xl border border-white/15 bg-[#031427] px-3 text-xs text-white backdrop-blur-md transition focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 hover:border-white/25 cursor-pointer [&_option]:bg-[#031427] [&_option]:text-white"
            >
              {Object.entries(REPORT_STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-medium text-[#cce5fb]">
            <span className="mb-1 block text-[11px] text-[#8cb6dc]">
              Catatan Penanganan <span className="text-rose-400">*</span>
            </span>
            <textarea
              required
              maxLength={1000}
              rows={3}
              placeholder={
                photoRequired
                  ? 'Jelaskan tindakan, suku cadang, atau hasil pemeriksaan...'
                  : 'Tuliskan catatan tindak lanjut untuk pelapor...'
              }
              value={draft.message}
              onChange={(event) => onDraftChange({ message: event.target.value })}
              className="w-full rounded-xl border border-white/15 bg-[#031427]/80 p-3 text-xs text-white placeholder:text-[#8cb6dc]/50 backdrop-blur-md transition focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 hover:border-white/25 resize-vertical"
            />
          </label>

          <label className="block text-xs font-medium text-[#cce5fb]">
            <span className="mb-1 flex items-center justify-between text-[11px] text-[#8cb6dc]">
              <span className="inline-flex items-center gap-1">
                <FiCamera className="size-3 text-[#60b6ff]" />
                <span>Foto Bukti Penanganan</span>
              </span>
              <span className="text-[10px] text-[#6f96be]">{photoRequired ? 'Wajib' : 'Opsional'}</span>
            </span>
            <input
              required={photoRequired}
              type="file"
              accept="image/*"
              onChange={(event) => onDraftChange({ file: event.target.files?.[0] ?? null })}
              className="w-full rounded-xl border border-white/15 bg-[#031427]/80 p-2 text-xs text-[#8cb6dc] file:mr-2.5 file:rounded-lg file:border-0 file:bg-white/10 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-[#cce5fb] file:cursor-pointer hover:file:bg-white/20"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={busy}
          className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#60b6ff] via-[#48a6ff] to-[#2b8ced] px-4 py-2 text-xs font-bold text-[#021427] shadow-[0_4px_16px_rgba(58,147,232,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(58,147,232,0.55)] hover:brightness-105 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          <FiCheck className="size-4" />
          <span>{busy ? 'Menyimpan...' : submitLabel}</span>
        </button>
      </form>
    </article>
  )
}
