import { useRef, useLayoutEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { motion } from 'framer-motion'
import type { UserProfile } from '../../types/auth'
import { Brand } from '../common/Brand'
import { MobileBottomNav } from './MobileBottomNav'

type StudentLayoutProps = {
  profile: UserProfile
  active: 'dashboard' | 'reports' | 'mine' | 'settings' | 'new'
  onNavigate: (path: string) => void
  children: ReactNode
}

const navItems = [
  { id: 'dashboard', label: 'Ringkasan', path: '/mahasiswa' },
  { id: 'reports', label: 'Semua Laporan', path: '/mahasiswa/laporan' },
  { id: 'mine', label: 'Laporan Saya', path: '/mahasiswa/laporan-saya' },
] as const

export function StudentLayout({ profile, active, onNavigate, children }: StudentLayoutProps) {
  const navRef = useRef<HTMLElement>(null)
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null)
  const avatarLetter = (profile.full_name || 'M').slice(0, 1).toUpperCase()

  const handleNavClick = (path: string) => {
    onNavigate(path)
  }

  // Hitung posisi horizontal (left & width) murni relatif terhadap nav container
  // sehingga kebal terhadap scroll halaman dan tidak ada glitch terbang vertikal menyilang
  useLayoutEffect(() => {
    const updatePill = () => {
      if (!navRef.current) return
      const activeBtn = navRef.current.querySelector<HTMLButtonElement>(`[data-tab="${active}"]`)
      if (activeBtn) {
        setPillStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
        })
      } else {
        setPillStyle(null)
      }
    }
    updatePill()
    window.addEventListener('resize', updatePill)
    return () => window.removeEventListener('resize', updatePill)
  }, [active])

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] font-['Poppins','Montserrat','Outfit',system-ui,sans-serif] text-slate-800 antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-[#08315c] border-b border-white/10 shadow-md">
        <div className="mx-auto flex h-18 w-full max-w-[1280px] items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <Brand
              showSubtitle={false}
              onClick={() => handleNavClick('/mahasiswa')}
              className="text-white"
            />
          </div>

          {/* Center: Navigation Pills (Desktop) */}
          <nav
            ref={navRef}
            className="relative hidden lg:flex items-center gap-1.5 bg-[#062445]/60 p-1.5 rounded-full border border-white/10 backdrop-blur-sm"
            aria-label="Navigasi Utama Mahasiswa"
          >
            {/* Latar belakang pill putih bergeser mulus secara horizontal */}
            {pillStyle && (
              <motion.div
                className="absolute rounded-full bg-white shadow-md z-0 pointer-events-none"
                style={{ top: 6, bottom: 6 }}
                initial={false}
                animate={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 32,
                }}
              />
            )}

            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  data-tab={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.path)}
                  className={`relative z-10 min-h-[38px] rounded-full px-5 py-1.5 text-xs font-bold transition-colors duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'text-[#08315c]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Right: User Profile (Navigates to Settings) */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              type="button"
              onClick={() => handleNavClick('/mahasiswa/pengaturan')}
              title="Buka Pengaturan Profil & Akun"
              className={`flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4 transition cursor-pointer border select-none ${
                active === 'settings'
                  ? 'bg-white/20 border-[#ffbb00]'
                  : 'bg-white/5 hover:bg-white/15 border-white/10'
              }`}
            >
              <div
                className="grid size-8 place-items-center rounded-full bg-[#ffbb00] text-xs font-bold text-[#08315c] shadow-sm select-none"
                aria-hidden="true"
              >
                {avatarLetter}
              </div>
              <span className="text-xs font-semibold text-white max-w-[170px] truncate hover:text-[#ffbb00] transition-colors">
                {profile.full_name}
              </span>
            </button>
          </div>

          {/* Mobile Right: User Profile Avatar */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={() => handleNavClick('/mahasiswa/pengaturan')}
              aria-label="Buka Pengaturan Profil & Akun"
              className="flex items-center gap-2 rounded-full py-1 pl-1.5 pr-3 bg-white/10 hover:bg-white/20 transition cursor-pointer border border-white/15"
            >
              <div
                className="grid size-7 place-items-center rounded-full bg-[#ffbb00] text-xs font-bold text-[#08315c] shadow-sm select-none"
                aria-hidden="true"
              >
                {avatarLetter}
              </div>
              <span className="text-xs font-semibold text-white max-w-[110px] truncate">
                {profile.full_name}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main View Container (pb-24 ensures mobile content is never hidden behind bottom nav) */}
      <main className="flex-1 w-full pb-24 lg:pb-0">
        {children}
      </main>

      {/* Mobile Fixed Bottom Navigation */}
      <MobileBottomNav active={active} onNavigate={onNavigate} />
    </div>
  )
}

export default StudentLayout
