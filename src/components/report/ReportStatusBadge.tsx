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
    ? 'border-amber-400/30 bg-amber-400/10 text-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.15)]'
    : isProgress
      ? 'border-sky-400/30 bg-sky-400/10 text-sky-300 shadow-[0_0_12px_rgba(56,189,248,0.15)]'
      : 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300 shadow-[0_0_12px_rgba(52,211,153,0.15)]'

  const dotColor = isPending
    ? 'bg-amber-400'
    : isProgress
      ? 'bg-sky-400 animate-pulse'
      : 'bg-emerald-400'

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide backdrop-blur-md transition-all ${badgeStyle} ${className}`}
    >
      <span className={`size-1.5 rounded-full ${dotColor}`} />
      <span>{REPORT_STATUS_LABELS[status]}</span>
    </span>
  )
}
