import type { ReportStatus } from '../types/report'

export const REPORT_STATUS_LABELS: Record<ReportStatus, string> = {
  belum_diproses: 'Belum diproses',
  diproses: 'Diproses',
  menunggu_konfirmasi: 'Menunggu konfirmasi',
  selesai: 'Selesai',
}
