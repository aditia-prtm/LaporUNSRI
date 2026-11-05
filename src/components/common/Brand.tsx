type BrandProps = {
  className?: string
  onClick?: () => void
  variant?: 'default' | 'light'
  showSubtitle?: boolean
  compact?: boolean
}

export function Brand({
  className = '',
  onClick,
  variant = 'default',
  showSubtitle = true,
  compact = false,
}: BrandProps) {
  const isLight = variant === 'light' || variant === 'default'

  return (
    <a
      className={`group flex flex-col items-start no-underline transition-all duration-200 hover:-translate-y-px select-none cursor-pointer ${className}`}
      href="/"
      aria-label="LaporUNSRI Beranda"
      onClick={(event) => {
        if (!onClick) return
        event.preventDefault()
        onClick()
      }}
    >
      <span
        className={`flex items-baseline gap-0.5 font-['Poppins','Montserrat','Outfit',sans-serif] leading-none tracking-tight transition-colors ${
          compact ? 'text-lg sm:text-xl' : 'text-xl sm:text-2xl'
        } ${isLight ? 'text-white' : 'text-white'}`}
      >
        <span className="font-normal opacity-90">lapor</span>
        <strong className="font-extrabold tracking-tight">UNSRI</strong>
        <i
          className="ml-0.5 h-1.5 w-1.5 -translate-y-1 rounded-full bg-[#ffbb00] shadow-[0_0_10px_#ffbb00]"
          aria-hidden="true"
        />
      </span>
      {showSubtitle && (
        <span
          className={`mt-1 font-semibold uppercase tracking-[0.24em] transition-colors ${
            compact ? 'text-[7px]' : 'text-[8px]'
          } text-[rgba(220,238,255,0.72)] group-hover:text-white/90`}
        >
          Layanan Aspirasi Kampus
        </span>
      )}
    </a>
  )
}
