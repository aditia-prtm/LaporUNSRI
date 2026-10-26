import type { ReportStatus } from '../../types/report'
import type { Category } from '../../types/report'
import { REPORT_STATUS_LABELS } from '../../constants/report'

type ReportFiltersProps = {
  search: string
  status: ReportStatus | ''
  onSearchChange: (value: string) => void
  onStatusChange: (value: ReportStatus | '') => void
  className: string
  searchPlaceholder?: string
  categories?: Category[]
  category?: string
  onCategoryChange?: (value: string) => void
  sort?: 'newest' | 'votes'
  onSortChange?: (value: 'newest' | 'votes') => void
}

export function ReportFilters({
  search,
  status,
  onSearchChange,
  onStatusChange,
  className,
  searchPlaceholder = 'Cari laporan atau lokasi...',
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: ReportFiltersProps) {
  return (
    <div className={className}>
      <input
        aria-label="Cari laporan"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder={searchPlaceholder}
      />
      {categories && onCategoryChange && (
        <select aria-label="Filter kategori" value={category ?? ''} onChange={(event) => onCategoryChange(event.target.value)}>
          <option value="">Semua kategori</option>
          {categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}
        </select>
      )}
      <select aria-label="Filter status" value={status} onChange={(event) => onStatusChange(event.target.value as ReportStatus | '')}>
        <option value="">Semua status</option>
        {Object.entries(REPORT_STATUS_LABELS).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
      </select>
      {sort && onSortChange && (
        <select aria-label="Urutkan laporan" value={sort} onChange={(event) => onSortChange(event.target.value as 'newest' | 'votes')}>
          <option value="newest">Paling baru</option>
          <option value="votes">Dukungan terbanyak</option>
        </select>
      )}
    </div>
  )
}
