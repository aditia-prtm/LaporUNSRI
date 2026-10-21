type BrandProps = {
  className?: string
  onClick?: () => void
}

export function Brand({ className = '', onClick }: BrandProps) {
  return (
    <a
      className={`brand ${className}`.trim()}
      href="/"
      aria-label="LaporUnsri beranda"
      onClick={(event) => {
        if (!onClick) return
        event.preventDefault()
        onClick()
      }}
    >
      <span className="brand-mark" aria-hidden="true">L</span>
      <span>Lapor<span className="brand-accent">Unsri</span></span>
    </a>
  )
}
