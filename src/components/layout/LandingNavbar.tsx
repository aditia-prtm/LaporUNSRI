import { useState } from 'react'
import { BiMenu } from 'react-icons/bi'

type LandingNavbarProps = {
  onNavigate: (path: string) => void
  onScrollDown: () => void
}

const menuItems = [
  { label: 'Beranda', action: 'home' },
  { label: 'Alur Pelaporan', action: 'steps' },
  { label: 'Layanan Aspirasi', action: 'auth' },
  { label: 'Portal Petugas', action: 'officer' },
] as const

export function LandingNavbar({ onNavigate, onScrollDown }: LandingNavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleMenuAction = (action: (typeof menuItems)[number]['action']) => {
    setMenuOpen(false)
    if (action === 'steps') {
      onScrollDown()
      return
    }
    onNavigate(action === 'home' ? '/' : action === 'auth' ? '/auth' : '/petugas')
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 w-full bg-transparent">
      <div className="relative mx-auto flex min-h-[76px] w-full max-w-[1440px] items-center justify-between px-11 py-3 max-lg:min-h-[68px] max-lg:px-7 max-lg:py-2.5 max-sm:min-h-[60px] max-sm:px-4.5">
        <span className="flex-1 max-lg:hidden" aria-hidden="true" />
        <a className="flex flex-col items-center text-white no-underline transition duration-200 hover:-translate-y-px hover:opacity-95 max-lg:mr-auto max-lg:items-start" href="/" onClick={(event) => { event.preventDefault(); onNavigate('/') }} aria-label="LaporUnsri beranda">
          <span className="flex items-baseline gap-0.5 text-2xl font-normal leading-none tracking-tight max-sm:text-xl"><span>lapor</span><strong className="font-extrabold">UNSRI</strong><i className="ml-0.5 h-1.5 w-1.5 -translate-y-1 rounded-full bg-[#60b6ff] shadow-[0_0_10px_#60b6ff]" aria-hidden="true" /></span>
          <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.28em] text-[rgba(220,238,255,0.72)] max-lg:tracking-[0.22em] max-sm:text-[7.5px] max-sm:tracking-[0.18em]">Layanan Aspirasi Kampus</span>
        </a>
        <div className="flex flex-1 items-center justify-end gap-4 max-lg:flex-initial max-lg:gap-3">
          <button type="button" className="rounded-full border border-white/30 bg-white/10 px-6 py-2 text-[13.5px] font-semibold text-white backdrop-blur transition hover:-translate-y-px hover:bg-white/25 max-sm:px-4 max-sm:py-1.5 max-sm:text-xs" onClick={() => onNavigate('/auth')}>Masuk</button>
          <button
            type="button"
            className="flex h-10 w-10 flex-col items-center justify-center gap-1 rounded-full bg-transparent p-0 transition hover:bg-white/15 max-sm:h-9 max-sm:w-9"
            aria-label={menuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
            aria-expanded={menuOpen}
            aria-controls="landing-navigation-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <BiMenu size={24} color='white' />
          </button>
        </div>
        {menuOpen && (
          <nav id="landing-navigation-menu" className="absolute right-11 top-full mt-2 z-10 min-w-[200px] rounded-2xl border border-white/20 bg-[#061e3a]/95 p-2 shadow-[0_16px_36px_rgba(2,16,32,0.45)] backdrop-blur-xl max-lg:right-7 max-sm:right-4.5" aria-label="Navigasi landing page">
            {menuItems.map((item) => (
              <button key={item.action} className="block w-full rounded-lg border-0 bg-transparent px-4 py-2.5 text-left text-xs font-medium text-[#e2effa] transition hover:bg-white/10 hover:text-white" type="button" onClick={() => handleMenuAction(item.action)}>
                {item.label}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  )
}
