type SkeletonProps = {
  className?: string
  variant?: 'light' | 'dark'
}

export function Skeleton({ className = '', variant = 'light' }: SkeletonProps) {
  const baseBg = variant === 'dark' ? 'bg-white/10' : 'bg-slate-200/80'
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-lg ${baseBg} ${className}`}
    />
  )
}

export function TableSkeleton({ rows = 4 }: { rows?: number }) {
  return (
    <div
      role="status"
      aria-label="Memuat daftar laporan..."
      className="w-full overflow-hidden"
    >
      <span className="sr-only">Memuat daftar laporan...</span>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            <th className="py-4 px-5 sm:px-6">Laporan</th>
            <th className="py-4 px-5 sm:px-6">Lokasi</th>
            <th className="py-4 px-5 sm:px-6">Tanggal</th>
            <th className="py-4 px-5 sm:px-6">Status</th>
            <th className="py-4 px-5 sm:px-6 text-right">Dukungan</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {Array.from({ length: rows }).map((_, index) => (
            <tr key={index} className="py-4 px-5 sm:px-6">
              <td className="py-4 px-5 sm:px-6 max-w-[280px]">
                <Skeleton className="h-4 w-44" />
                <Skeleton className="h-3 w-24 mt-2" />
              </td>
              <td className="py-4 px-5 sm:px-6">
                <Skeleton className="h-3.5 w-36" />
              </td>
              <td className="py-4 px-5 sm:px-6">
                <Skeleton className="h-3.5 w-20" />
              </td>
              <td className="py-4 px-5 sm:px-6">
                <Skeleton className="h-6 w-28 rounded-full" />
              </td>
              <td className="py-4 px-5 sm:px-6 text-right">
                <Skeleton className="h-4 w-8 ml-auto" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function ReportCardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-label="Memuat daftar laporan..."
      className="space-y-4 w-full"
    >
      <span className="sr-only">Memuat daftar laporan...</span>
      {Array.from({ length: count }).map((_, index) => (
        <article
          key={index}
          className="rounded-2xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-sm flex flex-col md:flex-row items-start justify-between gap-5"
        >
          <div className="min-w-0 flex-1 w-full space-y-3">
            {/* Top badges */}
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-3 w-16 ml-1" />
            </div>

            {/* Title */}
            <Skeleton className="h-5 w-3/4 max-w-md" />

            {/* Description lines */}
            <div className="space-y-1.5 pt-1">
              <Skeleton className="h-3.5 w-full" />
              <Skeleton className="h-3.5 w-4/5" />
            </div>

            {/* Location */}
            <Skeleton className="h-3.5 w-52 pt-1" />

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <Skeleton className="h-3 w-32" />
              <Skeleton className="h-7 w-24 rounded-full" />
            </div>
          </div>

          {/* Photo placeholder */}
          <Skeleton className="size-24 sm:size-28 shrink-0 rounded-xl" />
        </article>
      ))}
    </div>
  )
}

export function ReportDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat detail laporan..."
      className="space-y-6 w-full max-w-[1040px]"
    >
      <span className="sr-only">Memuat detail laporan...</span>

      {/* Main Card */}
      <article className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
        {/* Top meta */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-32" />
          </div>
          <Skeleton className="h-6 w-28 rounded-full" />
        </div>

        {/* Big photo placeholder */}
        <Skeleton className="h-72 w-full rounded-2xl" />

        {/* Text lines */}
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-11/12" />
          <Skeleton className="h-4 w-4/5" />
        </div>

        {/* Action button */}
        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
          <Skeleton className="h-10 w-48 rounded-xl" />
        </div>
      </article>

      {/* Comment section skeleton */}
      <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm space-y-4">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </div>
  )
}

export function FormSkeleton() {
  return (
    <div
      role="status"
      aria-label="Memuat formulir laporan..."
      className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm"
    >
      <span className="sr-only">Memuat formulir laporan...</span>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="sm:col-span-2 space-y-2">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Skeleton className="h-3 w-36" />
          <Skeleton className="h-28 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-12 w-full rounded-xl" />
        </div>
        <div className="sm:col-span-2 space-y-2">
          <Skeleton className="h-3 w-40" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

