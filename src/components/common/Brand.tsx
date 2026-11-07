import brandLogoSvg from '../../assets/common/lapor-unsri-putih.svg'

type BrandProps = {
  className?: string
  onClick?: () => void
  variant?: 'default' | 'light'
  showSubtitle?: boolean
  subtitle?: string
  compact?: boolean
}

export function Brand({
  className = '',
  onClick,
  showSubtitle = true,
  subtitle = 'Layanan Aspirasi Kampus',
  compact = false,
}: BrandProps) {
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
      <img
        src={brandLogoSvg}
        alt="laporUNSRI"
        className={`w-auto object-contain transition-opacity group-hover:opacity-90 ${
          compact ? 'h-[18px] sm:h-5 max-w-[125px]' : 'h-5 sm:h-6 max-w-[145px]'
        }`}
      />
      {showSubtitle && (
        <span
          className={`mt-1 font-semibold uppercase tracking-[0.24em] transition-colors ${
            compact ? 'text-[7px]' : 'text-[7.5px] sm:text-[8px]'
          } text-[rgba(220,238,255,0.72)] group-hover:text-white/90`}
        >
          {subtitle}
        </span>
      )}
    </a>
  )
}

export default Brand
