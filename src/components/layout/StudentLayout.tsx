import { useState } from 'react'
import type { ReactNode } from 'react'
import type { UserProfile } from '../../types/auth'
import { Brand } from '../common/Brand'
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi'

type StudentLayoutProps = {
  profile: UserProfile
  active: 'dashboard' | 'reports' | 'mine'
  onNavigate: (path: string) => void
  onSignOut: () => void
  children: ReactNode
}

const navItems = [
  { id: 'dashboard', label: 'Ringkasan', path: '/mahasiswa' },
  { id: 'reports', label: 'Semua Laporan', path: '/mahasiswa/laporan' },
  { id: 'mine', label: 'Laporan Saya', path: '/mahasiswa/laporan-saya' },
] as const

export function StudentLayout({ profile, active, onNavigate, onSignOut, children }: StudentLayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const avatarLetter = (profile.full_name || 'M').slice(0, 1).toUpperCase()

  const handleNavClick = (path: string) => {
    setMobileMenuOpen(false)
    onNavigate(path)
  }

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
            className="hidden lg:flex items-center gap-2 bg-[#062445]/60 p-1.5 rounded-full border border-white/10 backdrop-blur-sm"
            aria-label="Navigasi Utama Mahasiswa"
          >
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.path)}
                  className={`min-h-[38px] rounded-full px-5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#08315c] shadow-md'
                      : 'text-white/80 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </nav>

          {/* Right: User Profile & Logout (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="grid size-8 place-items-center rounded-full bg-[#ffbb00] text-xs font-bold text-[#08315c] shadow-sm select-none"
                aria-hidden="true"
              >
                {avatarLetter}
              </div>
              <span className="text-xs font-semibold text-white max-w-[180px] truncate">
                {profile.full_name}
              </span>
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-sky-200 hover:text-white transition cursor-pointer"
            >
              <FiLogOut className="size-3.5" aria-hidden="true" />
              <span>Keluar</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <div
              className="grid size-8 place-items-center rounded-full bg-[#ffbb00] text-xs font-bold text-[#08315c] shadow-sm"
              aria-hidden="true"
            >
              {avatarLetter}
            </div>
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label="Buka menu navigasi"
              className="grid size-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
            >
              {mobileMenuOpen ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#062445] px-4 py-4 lg:hidden space-y-2 shadow-xl">
            <div className="px-3 py-2 text-xs font-semibold text-sky-200 border-b border-white/10">
              {profile.full_name}
            </div>
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.path)}
                  className={`flex min-h-[44px] w-full items-center rounded-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-white text-[#08315c]'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
            <button
              type="button"
              onClick={onSignOut}
              className="flex min-h-[44px] w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
            >
              <FiLogOut className="size-4" aria-hidden="true" />
              <span>Keluar Akun</span>
            </button>
          </div>
        )}
      </header>

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  )
}
export default StudentLayout
