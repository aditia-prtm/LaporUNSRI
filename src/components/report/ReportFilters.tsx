import type { ReportStatus } from '../../types/report'
import type { Category } from '../../types/report'
import { REPORT_STATUS_LABELS } from '../../constants/report'
import { FiSearch } from 'react-icons/fi'

type ReportFiltersProps = {
  search: string
  status: ReportStatus | ''
  onSearchChange: (value: string) => void
  onStatusChange: (value: ReportStatus | '') => void
  className?: string
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
  className = '',
  searchPlaceholder = 'Cari judul, lokasi, atau deskripsi...',
  categories,
  category,
  onCategoryChange,
  sort,
  onSortChange,
}: ReportFiltersProps) {
  const inputClass =
    'h-10 w-full rounded-xl border border-white/15 bg-[#031427]/80 px-3.5 text-xs text-white placeholder:text-[#8cb6dc]/50 backdrop-blur-md transition focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 hover:border-white/25'

  const selectClass =
    'h-10 w-full rounded-xl border border-white/15 bg-[#031427] px-3 text-xs text-white backdrop-blur-md transition focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 hover:border-white/25 cursor-pointer [&_option]:bg-[#031427] [&_option]:text-white'

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3.5 rounded-2xl border border-white/10 bg-[#072445]/45 backdrop-blur-md ${className}`}>
      <div className="relative w-full">
        <input
          aria-label="Cari laporan"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder={searchPlaceholder}
          className={`${inputClass} pl-9`}
        />
        <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-[#8cb6dc]" />
      </div>

      {categories && onCategoryChange && (
        <select
          aria-label="Filter kategori"
          value={category ?? ''}
          onChange={(event) => onCategoryChange(event.target.value)}
          className={selectClass}
        >
          <option value="">Semua Kategori</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      )}

      <select
        aria-label="Filter status"
        value={status}
        onChange={(event) => onStatusChange(event.target.value as ReportStatus | '')}
        className={selectClass}
      >
        <option value="">Semua Status</option>
        {Object.entries(REPORT_STATUS_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>

      {sort && onSortChange && (
        <select
          aria-label="Urutkan laporan"
          value={sort}
          onChange={(event) => onSortChange(event.target.value as 'newest' | 'votes')}
          className={selectClass}
        >
          <option value="newest">Paling Baru</option>
          <option value="votes">Dukungan Terbanyak</option>
        </select>
      )}
    </div>
  )
}
