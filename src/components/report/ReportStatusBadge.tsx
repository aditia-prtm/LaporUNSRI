import type { ReportStatus } from '../../types/report'
import { REPORT_STATUS_LABELS } from '../../constants/report'

type ReportStatusBadgeProps = {
  status: ReportStatus
  className?: string
}

export function ReportStatusBadge({ status, className = '' }: ReportStatusBadgeProps) {
  const isPending = status === 'belum_diproses'
  const isProgress = status === 'diproses'

  const badgeStyle = isPending
    ? 'border-amber-400/40 bg-amber-400/10 text-amber-200'
    : isProgress
      ? 'border-[#60b6ff]/40 bg-[#60b6ff]/10 text-sky-200'
      : 'border-emerald-400/40 bg-emerald-400/10 text-emerald-200'

  const dotColor = isPending
    ? 'bg-amber-400'
    : isProgress
      ? 'bg-[#60b6ff]'
      : 'bg-emerald-400'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold tracking-wide backdrop-blur-md transition-all ${badgeStyle} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${dotColor}`} aria-hidden="true" />
      <span>{REPORT_STATUS_LABELS[status]}</span>
    </span>
  )
}
