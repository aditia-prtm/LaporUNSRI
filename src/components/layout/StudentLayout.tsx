import { useState } from 'react'
import type { ReactNode } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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

          {/* Center: Navigation Pills (Desktop) dengan Framer Motion layoutId */}
          <nav
            className="hidden lg:flex items-center gap-1.5 bg-[#062445]/60 p-1.5 rounded-full border border-white/10 backdrop-blur-sm"
            aria-label="Navigasi Utama Mahasiswa"
          >
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.path)}
                  className={`relative min-h-[38px] rounded-full px-5 py-1.5 text-xs font-bold transition-colors duration-200 cursor-pointer select-none ${
                    isActive
                      ? 'text-[#08315c]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  {/* Animasi latar putih bergeser mulus antar menu */}
                  {isActive && (
                    <motion.div
                      layoutId="student-nav-active-pill"
                      className="absolute inset-0 rounded-full bg-white shadow-md z-0"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 32,
                      }}
                    />
                  )}
                  <span className="relative z-10">{item.label}</span>
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

          {/* Mobile Menu Button with Animated Icon */}
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
              aria-label={mobileMenuOpen ? 'Tutup menu navigasi' : 'Buka menu navigasi'}
              className="grid size-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition cursor-pointer"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={mobileMenuOpen ? 'close' : 'menu'}
                  initial={{ rotate: -90, opacity: 0, scale: 0.8 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.16 }}
                >
                  {mobileMenuOpen ? <FiX className="size-5" /> : <FiMenu className="size-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu dengan Animasi Halus & Stagger */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              key="mobile-nav-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.26, ease: [0.16, 1, 0.3, 1] }}
              className="overflow-hidden border-t border-white/10 bg-[#062445] px-4 py-3 lg:hidden space-y-1.5 shadow-2xl"
            >
              <div className="px-3 py-2 text-xs font-semibold text-sky-200 border-b border-white/10">
                {profile.full_name}
              </div>
              {navItems.map((item, index) => {
                const isActive = active === item.id
                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: 0.03 + index * 0.03 }}
                    type="button"
                    onClick={() => handleNavClick(item.path)}
                    className={`flex min-h-[44px] w-full items-center rounded-xl px-3.5 py-2.5 text-xs font-bold transition cursor-pointer ${
                      isActive
                        ? 'bg-white text-[#08315c]'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </motion.button>
                )
              })}
              <motion.button
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: 0.03 + navItems.length * 0.03 }}
                type="button"
                onClick={onSignOut}
                className="flex min-h-[44px] w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
              >
                <FiLogOut className="size-4" aria-hidden="true" />
                <span>Keluar Akun</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main View Container */}
      <main className="flex-1 w-full">
        {children}
      </main>
    </div>
  )
}

export default StudentLayout
