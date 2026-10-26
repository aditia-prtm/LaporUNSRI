type BrandProps = {
  className?: string
  onClick?: () => void
  variant?: 'default' | 'light'
}

export function Brand({ className = '', onClick, variant = 'default' }: BrandProps) {
  const light = variant === 'light'
  const brandClassName = [
    'inline-flex items-center gap-2.5 text-[19px] font-extrabold tracking-[-0.7px] no-underline',
    light ? 'text-white' : 'text-[var(--ink)]',
    className,
  ].filter(Boolean).join(' ')

  return (
    <a
      className={brandClassName}
      href="/"
      aria-label="LaporUnsri beranda"
      onClick={(event) => {
        if (!onClick) return
        event.preventDefault()
        onClick()
      }}
    >
      <span className={`inline-grid h-[34px] w-[34px] place-items-center rounded-[11px] text-[19px] font-extrabold ${light ? 'bg-white/15 shadow-none' : 'bg-[var(--green)] shadow-[0_5px_12px_#14835d2c]'} text-white`} aria-hidden="true">L</span>
      <span>Lapor<span className={light ? 'text-[#a8e2c0]' : 'text-[var(--green)]'}>Unsri</span></span>
    </a>
  )
}
