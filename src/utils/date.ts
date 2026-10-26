const LOCALE = 'id-ID'

export function formatDate(value: string): string {
  return new Date(value).toLocaleDateString(LOCALE, { dateStyle: 'medium' })
}

export function formatReportDate(value: string): string {
  return new Date(value).toLocaleDateString(LOCALE, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(value: string): string {
  return new Date(value).toLocaleString(LOCALE, { dateStyle: 'medium', timeStyle: 'short' })
}
