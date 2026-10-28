import type { ReactNode } from 'react'

type MetricCardProps = {
  label: string
  value: ReactNode
  description: string
  icon?: ReactNode
  iconClassName?: string
  className?: string
}

export function MetricCard({
  label,
  value,
  description,
  icon,
  iconClassName = '',
  className = '',
}: MetricCardProps) {
  return (
    <article
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#072445]/45 p-5 sm:p-6 backdrop-blur-md shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#4899e8]/50 hover:bg-[#0b2f59]/60 hover:shadow-2xl hover:shadow-[#0c4278]/25 ${className}`.trim()}
    >
      {/* Glow Background Accent */}
      <div
        className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-[#105292]/15 blur-2xl transition duration-500 group-hover:bg-[#4899e8]/25"
        aria-hidden="true"
      />

      <div className="relative z-10 flex items-start justify-between gap-3">
        <span className="text-xs font-semibold text-[#8cb6dc] group-hover:text-[#cce5fb] transition-colors">
          {label}
        </span>
        {icon && (
          <div
            className={`inline-flex size-10 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-[#0c4278] to-[#062445] text-[#7fc3f8] shadow-inner transition duration-300 group-hover:scale-105 group-hover:border-[#7fc3f8]/50 ${iconClassName}`.trim()}
          >
            <span className="text-lg">{icon}</span>
          </div>
        )}
      </div>

      <div className="relative z-10 mt-3">
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
