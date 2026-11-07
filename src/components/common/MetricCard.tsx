import type { ReactNode } from 'react'

type MetricCardProps = {
  label: string
  value: ReactNode
  description: string
  icon?: ReactNode
  iconClassName?: string
  className?: string
  trend?: string
}

export function MetricCard({
  label,
  value,
  description,
  icon,
  iconClassName = '',
  className = '',
  trend,
}: MetricCardProps) {
  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-b from-[#072445]/70 to-[#041930]/80 p-5 sm:p-6 backdrop-blur-md shadow-xl shadow-black/20 transition-all duration-300 hover:border-[#4899e8]/50 hover:from-[#092c55]/85 hover:to-[#051f3c]/90 hover:-translate-y-0.5 ${className}`.trim()}
    >
      {/* Subtle Ambient Glow */}
      <div
        className="pointer-events-none absolute -right-6 -top-6 size-24 rounded-full bg-[#105292]/20 blur-xl transition duration-500 group-hover:bg-[#4899e8]/30"
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <div>
          <span className="text-[11px] font-semibold uppercase tracking-wider text-[#8cb6dc] group-hover:text-[#cce5fb] transition-colors">
            {label}
          </span>
          {trend && (
            <span className="ml-2 inline-flex items-center rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-sky-200">
              {trend}
            </span>
          )}
        </div>
        {icon && (
          <div
            className={`inline-flex size-10 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-[#0c4278] to-[#051e39] text-[#7fc3f8] shadow-inner transition duration-300 group-hover:scale-105 group-hover:border-[#7fc3f8]/50 ${iconClassName}`.trim()}
          >
            <span className="text-lg">{icon}</span>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-4">
        <strong className="block font-['Poppins','Montserrat','Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-tight text-white transition-colors group-hover:text-[#e1f0ff]">
          {value}
        </strong>
        <p className="mt-1 text-[11px] sm:text-xs leading-relaxed text-[#8cb6dc]">
          {description}
        </p>
      </div>
    </article>
  )
}
