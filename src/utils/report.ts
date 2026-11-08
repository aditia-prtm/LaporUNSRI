import type { Report, ReportStatus } from '../types/report'

export const REPORT_OVERDUE_AFTER_DAYS = 7

export type ReportStatusCounts = Record<ReportStatus, number>

export function countReportsByStatus(reports: Report[]): ReportStatusCounts {
  return reports.reduce<ReportStatusCounts>((counts, report) => {
    if (report.status in counts) {
      counts[report.status] += 1
    }
    return counts
  }, { belum_diproses: 0, diproses: 0, menunggu_konfirmasi: 0, selesai: 0 })
}

export function isReportOverdue(report: Report, now = Date.now()): boolean {
  return report.status === 'belum_diproses'
    && now - Date.parse(report.created_at) >= REPORT_OVERDUE_AFTER_DAYS * 24 * 60 * 60 * 1000
}

export function getReportAgeInDays(report: Report, now = Date.now()): number {
  return Math.floor((now - Date.parse(report.created_at)) / (24 * 60 * 60 * 1000))
}

type ReportFilterOptions = {
  search?: string
  status?: ReportStatus | ''
  categoryId?: string
  sort?: 'newest' | 'votes'
  mineOnly?: boolean
  userId?: string
  overdueOnly?: boolean
}

export function filterReports(reports: Report[], options: ReportFilterOptions = {}): Report[] {
  const term = options.search?.trim().toLocaleLowerCase('id') ?? ''
  const filtered = reports.filter((report) => {
    const matchesSearch = !term || [
      report.title,
      report.description,
      report.faculty,
      report.building,
      report.room ?? '',
      report.profiles?.full_name ?? '',
    ].some((value) => value.toLocaleLowerCase('id').includes(term))

    return matchesSearch
      && (!options.status || report.status === options.status)
      && (!options.categoryId || report.category_id === options.categoryId)
      && (!options.mineOnly || report.user_id === options.userId)
      && (!options.overdueOnly || isReportOverdue(report))
  })

  return filtered.sort((left, right) => options.sort === 'votes'
    ? right.vote_count - left.vote_count || Date.parse(right.created_at) - Date.parse(left.created_at)
    : Date.parse(right.created_at) - Date.parse(left.created_at))
}
