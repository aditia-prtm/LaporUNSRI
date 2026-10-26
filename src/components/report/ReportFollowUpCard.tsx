import type { FormEvent } from 'react'
import type { Report, ReportStatus } from '../../types/report'
import { REPORT_STATUS_LABELS } from '../../constants/report'
import { ReportStatusBadge } from './ReportStatusBadge'
import { formatDate } from '../../utils/date'

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
    <article className="officer-report-card">
      <div className="officer-report-overview">
        <div className="report-card-meta">
          <ReportStatusBadge status={report.status} />
          <span>{report.categories?.name ?? 'Lainnya'}</span>
          <time>{formatDate(report.created_at)}</time>
          {overdueDays !== undefined && <b className="admin-overdue-tag">Terlambat {overdueDays} hari</b>}
        </div>
        <h3>{report.title}</h3>
        <p>{report.description}</p>
        <div className="report-location">{report.faculty} · {report.building}{report.room ? ` · ${report.room}` : ''}</div>
        <small className="officer-reporter">Pelapor: {report.profiles?.full_name ?? 'Mahasiswa'} · Dukungan {report.vote_count}</small>
        {report.photo_url && (
          <a className="officer-evidence-link" href={report.photo_url} target="_blank" rel="noreferrer">
            Lihat foto laporan
          </a>
        )}
      </div>
      <form className="officer-update-form" onSubmit={onSubmit}>
        <strong>{photoRequired ? 'Catat tindak lanjut' : 'Catatan dan status'}</strong>
        <select
          aria-label={`Status baru untuk ${report.title}`}
          value={draft.status}
          onChange={(event) => onDraftChange({ status: event.target.value as ReportStatus })}
        >
          {Object.entries(REPORT_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
        <textarea
          required
          maxLength={1000}
          rows={3}
          placeholder={photoRequired ? 'Jelaskan tindakan atau hasil pemeriksaan...' : 'Tulis tindak lanjut untuk pelapor...'}
          value={draft.message}
          onChange={(event) => onDraftChange({ message: event.target.value })}
        />
        <label className="officer-file-label">
          Foto bukti {photoRequired ? '' : '(opsional)'}
          <input
            required={photoRequired}
            type="file"
            accept="image/*"
            onChange={(event) => onDraftChange({ file: event.target.files?.[0] ?? null })}
          />
        </label>
        <button className="button button-primary" disabled={busy}>{busy ? 'Menyimpan...' : submitLabel}</button>
      </form>
    </article>
  )
}
