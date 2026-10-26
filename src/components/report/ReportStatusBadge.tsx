import type { ReportStatus } from '../../types/report'
import { REPORT_STATUS_LABELS } from '../../constants/report'

type ReportStatusBadgeProps = {
  status: ReportStatus
}

export function ReportStatusBadge({ status }: ReportStatusBadgeProps) {
  return <span className={`status-pill status-${status}`}>{REPORT_STATUS_LABELS[status]}</span>
}
