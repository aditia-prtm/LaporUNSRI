type BrandProps = {
  className?: string
  onClick?: () => void
  variant?: 'default' | 'light'
}

export function Brand({ className = '', onClick, variant = 'default' }: BrandProps) {
  const light = variant === 'light'
  const brandClassName = [
    'inline-flex items-center gap-2.5 text-lg font-extrabold tracking-tight no-underline',
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
      <span className={`inline-grid size-8.5 place-items-center rounded-xl text-lg font-extrabold ${light ? 'bg-white/15 shadow-none' : 'bg-[var(--green)] shadow-md shadow-emerald-900/15'} text-white`} aria-hidden="true">L</span>
      <span>Lapor<span className={light ? 'text-[#a8e2c0]' : 'text-[var(--green)]'}>Unsri</span></span>
    </a>
  )
}
