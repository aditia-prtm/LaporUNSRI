import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { FiCheck, FiFilter, FiRotateCcw, FiSearch, FiSliders, FiX } from 'react-icons/fi'
import type { Category, ReportStatus } from '../../types/report'
import { REPORT_STATUS_LABELS } from '../../constants/report'

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
  const [isOpen, setIsOpen] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Hitung berapa banyak filter yang sedang aktif
  let activeFilterCount = 0
  if (status !== '') activeFilterCount++
  if (category && category !== '') activeFilterCount++
  if (sort && sort !== 'newest') activeFilterCount++

  // Close popup saat klik di luar popover
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  const handleResetFilters = () => {
    onStatusChange('')
    if (onCategoryChange) onCategoryChange('')
    if (onSortChange) onSortChange('newest')
  }

  const selectedCategoryName = categories?.find((c) => c.id === category)?.name

  return (
    <div className={`relative w-full space-y-2.5 ${className}`}>
      {/* Baris Utama: Search Bar + Tombol Icon Filter */}
      <div className="flex items-center gap-2.5">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <input
            aria-label="Cari laporan"
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            className="h-11 sm:h-12 w-full rounded-2xl border border-slate-200/90 bg-white pl-10 pr-9 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 shadow-sm transition focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/15 hover:border-slate-300"
          />
          <FiSearch
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-sm text-slate-400"
            aria-hidden="true"
          />

          {search.length > 0 && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              aria-label="Hapus kata kunci"
            >
              <FiX className="size-3.5" aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Tombol Icon Filter */}
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          className={`relative inline-flex h-11 sm:h-12 min-w-[44px] items-center justify-center gap-2 rounded-2xl border px-4 text-xs sm:text-sm font-bold transition shadow-sm cursor-pointer select-none ${
            isOpen || activeFilterCount > 0
              ? 'border-[#08315c] bg-[#08315c] text-white shadow-md'
              : 'border-slate-200/90 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          <FiSliders className="size-4 stroke-[2.2]" aria-hidden="true" />
          <span className="hidden sm:inline">Filter</span>

          {/* Badge counter filter aktif */}
          {activeFilterCount > 0 && (
            <span
              className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-black ${
                isOpen || activeFilterCount > 0
                  ? 'bg-[#ffbb00] text-[#08315c]'
                  : 'bg-[#08315c] text-white'
              }`}
            >
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Popover Menu Filter */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={popoverRef}
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-0 top-full mt-2 w-full sm:w-[380px] z-50 rounded-3xl border border-slate-200/90 bg-white p-5 shadow-2xl shadow-slate-900/15"
            role="dialog"
            aria-label="Panel Filter Laporan"
          >
            {/* Header Popover */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex size-7 items-center justify-center rounded-xl bg-slate-100 text-[#08315c]">
                  <FiFilter className="size-3.5" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-bold text-slate-800">Filter & Urutan</h3>
              </div>

              <div className="flex items-center gap-2">
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-600 hover:text-rose-700 hover:underline cursor-pointer"
                  >
                    <FiRotateCcw className="size-3" aria-hidden="true" />
                    <span>Reset</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="rounded-full p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                  aria-label="Tutup menu filter"
                >
                  <FiX className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            {/* Filter Options Form */}
            <div className="space-y-4 pt-4">
              {/* Filter 1: Status Laporan */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Status Laporan</label>
                <div className="grid grid-cols-2 gap-1.5">
                  <button
                    type="button"
                    onClick={() => onStatusChange('')}
                    className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition cursor-pointer text-left ${
                      status === ''
                        ? 'bg-[#08315c] text-white font-bold shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                    }`}
                  >
                    <span>Semua Status</span>
                    {status === '' && <FiCheck className="size-3.5" aria-hidden="true" />}
                  </button>

                  {Object.entries(REPORT_STATUS_LABELS).map(([value, label]) => {
                    const active = status === value
                    return (
                      <button
                        key={value}
                        type="button"
                        onClick={() => onStatusChange(value as ReportStatus)}
                        className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-medium transition cursor-pointer text-left ${
                          active
                            ? 'bg-[#08315c] text-white font-bold shadow-sm'
                            : 'bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-100'
                        }`}
                      >
                        <span className="truncate">{label}</span>
                        {active && <FiCheck className="size-3.5 shrink-0 ml-1" aria-hidden="true" />}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Filter 2: Kategori (Jika Ada) */}
              {categories && onCategoryChange && (
                <div className="space-y-1.5">
                  <label htmlFor="filter-category" className="block text-xs font-bold text-slate-700">
                    Kategori Fasilitas
                  </label>
                  <select
                    id="filter-category"
                    aria-label="Filter kategori"
                    value={category ?? ''}
                    onChange={(event) => onCategoryChange(event.target.value)}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-800 transition focus:bg-white focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/15 cursor-pointer"
                  >
                    <option value="">Semua Kategori</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Filter 3: Urutan (Jika Ada) */}
              {sort && onSortChange && (
                <div className="space-y-1.5">
                  <label htmlFor="filter-sort" className="block text-xs font-bold text-slate-700">
                    Urutan Tampilan
                  </label>
                  <select
                    id="filter-sort"
                    aria-label="Urutkan laporan"
                    value={sort}
                    onChange={(event) => onSortChange(event.target.value as 'newest' | 'votes')}
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-xs text-slate-800 transition focus:bg-white focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/15 cursor-pointer"
                  >
                    <option value="newest">Laporan Paling Baru</option>
                    <option value="votes">Dukungan Terbanyak (Voting)</option>
                  </select>
                </div>
              )}
            </div>

            {/* Footer Tombol Terapkan */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full sm:w-auto rounded-xl bg-[#08315c] hover:bg-[#0c4278] text-white px-5 py-2 text-xs font-bold transition shadow-sm cursor-pointer"
              >
                Terapkan Filter
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Active Filter Chips (Untuk kemudahan melihat & membatalkan filter yang sedang aktif) */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
          <span className="text-[11px] font-medium text-slate-400 mr-1">Filter aktif:</span>

          {status !== '' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              <span>Status: {REPORT_STATUS_LABELS[status]}</span>
              <button
                type="button"
                onClick={() => onStatusChange('')}
                className="hover:text-rose-600 transition cursor-pointer ml-0.5"
                aria-label="Hapus filter status"
              >
                <FiX className="size-3" aria-hidden="true" />
              </button>
            </span>
          )}

          {category && selectedCategoryName && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              <span>Kategori: {selectedCategoryName}</span>
              <button
                type="button"
                onClick={() => onCategoryChange?.('')}
                className="hover:text-rose-600 transition cursor-pointer ml-0.5"
                aria-label="Hapus filter kategori"
              >
                <FiX className="size-3" aria-hidden="true" />
              </button>
            </span>
          )}

          {sort && sort !== 'newest' && (
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 border border-slate-200/80 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
              <span>Urutan: Dukungan Terbanyak</span>
              <button
                type="button"
                onClick={() => onSortChange?.('newest')}
                className="hover:text-rose-600 transition cursor-pointer ml-0.5"
                aria-label="Kembalikan urutan terbaru"
              >
                <FiX className="size-3" aria-hidden="true" />
              </button>
            </span>
          )}

          <button
            type="button"
            onClick={handleResetFilters}
            className="text-[11px] font-bold text-rose-600 hover:text-rose-700 hover:underline px-1 py-0.5 cursor-pointer ml-1"
          >
            Reset Semua
          </button>
        </div>
      )}
    </div>
  )
}

export default ReportFilters
