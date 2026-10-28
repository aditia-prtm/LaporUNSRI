import type { ReactNode } from 'react'
import type { UserProfile } from '../../types/auth'
import { Brand } from '../common/Brand'
import { FiClock, FiFileText, FiHome, FiLogOut, FiPlus } from 'react-icons/fi'

type StudentLayoutProps = {
  profile: UserProfile
  active: 'dashboard' | 'reports' | 'mine'
  onNavigate: (path: string) => void
  onSignOut: () => void
  children: ReactNode
}

const navItems = [
  { id: 'dashboard', label: 'Ringkasan', path: '/mahasiswa', icon: FiHome },
  { id: 'reports', label: 'Semua Laporan', path: '/mahasiswa/laporan', icon: FiFileText },
  { id: 'mine', label: 'Laporan Saya', path: '/mahasiswa/laporan-saya', icon: FiClock },
] as const

export function StudentLayout({ profile, active, onNavigate, onSignOut, children }: StudentLayoutProps) {
  const avatarLetter = (profile.full_name || 'M').slice(0, 1).toUpperCase()

  return (
    <div className="relative flex min-h-screen w-full bg-[#020b17] font-['Poppins','Montserrat','Outfit',system-ui,sans-serif] text-white">
      {/* Ambient background lighting */}
      <div
        className="pointer-events-none fixed -left-40 top-0 size-[500px] rounded-full bg-[#105292]/15 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed right-0 bottom-0 size-[500px] rounded-full bg-[#4899e8]/10 blur-[150px]"
        aria-hidden="true"
      />

      {/* Desktop Sidebar */}
      <aside className="sticky top-0 hidden md:flex h-screen w-64 shrink-0 flex-col justify-between border-r border-white/10 bg-[#031326]/90 p-5 backdrop-blur-xl z-30">
        <div>
          <div className="px-2 pt-2 pb-6">
            <Brand onClick={() => onNavigate('/mahasiswa')} />
          </div>

          <div className="px-2 pb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#60b6ff]">
            Menu Navigasi
          </div>

          <nav className="mt-1 space-y-1" aria-label="Navigasi mahasiswa">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = active === item.id
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.path)}
                  className={`group flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4899e8]/20 to-[#60b6ff]/10 text-[#60b6ff] border-l-2 border-[#60b6ff] shadow-[0_0_15px_rgba(96,182,255,0.15)]'
                      : 'text-[#8cb6dc] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon
                    className={`size-4 transition-colors ${
                      isActive ? 'text-[#60b6ff]' : 'text-[#8cb6dc] group-hover:text-white'
                    }`}
                  />
                  <span>{item.label}</span>
                </button>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer with Profile & Logout */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#0c4278] to-[#60b6ff] text-sm font-bold text-white shadow-md shadow-[#105292]/30">
              {avatarLetter}
            </div>
            <div className="min-w-0 flex-1">
              <strong className="block truncate text-xs font-bold text-white">
                {profile.full_name}
              </strong>
              <span className="flex items-center gap-1 text-[10px] text-[#8cb6dc]">
                <span className="size-1.5 rounded-full bg-emerald-400" />
                <span>Mahasiswa</span>
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-[#8cb6dc] transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer"
          >
            <FiLogOut className="size-3.5" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="relative flex min-w-0 flex-1 flex-col pb-20 md:pb-10">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-white/10 bg-[#031830]/80 px-4 sm:px-8 backdrop-blur-md">
          <div className="flex items-center gap-3 md:hidden">
            <Brand compact onClick={() => onNavigate('/mahasiswa')} />
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-[#8cb6dc]">
            <span className="size-1.5 rounded-full bg-[#60b6ff] shadow-[0_0_8px_#60b6ff]" />
            <span className="font-medium text-[#cce5fb]">LaporUNSRI</span>
            <span>·</span>
            <span>Portal Aspirasi & Pelaporan Mahasiswa</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onNavigate('/mahasiswa/laporan/baru')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-[#60b6ff] via-[#48a6ff] to-[#2b8ced] px-3.5 sm:px-4 py-2 text-xs font-bold text-[#021427] shadow-[0_4px_16px_rgba(58,147,232,0.35)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_22px_rgba(58,147,232,0.55)] active:translate-y-0 cursor-pointer"
            >
              <FiPlus className="size-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Buat Laporan Baru</span>
              <span className="sm:hidden">Buat Laporan</span>
            </button>
          </div>
        </header>

        {/* Page View Body */}
        <main className="relative z-10 mx-auto w-full max-w-[1200px] px-4 sm:px-8 pt-6 sm:pt-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 flex h-16 items-center justify-around border-t border-white/10 bg-[#031427]/95 px-2 backdrop-blur-xl md:hidden"
        aria-label="Navigasi bawah mobile"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = active === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.path)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 text-[10px] font-semibold transition-all ${
                isActive ? 'text-[#60b6ff]' : 'text-[#8cb6dc]'
              }`}
            >
              <Icon className="size-4" />
              <span>{item.label}</span>
            </button>
          )
        })}
        <button
          type="button"
          onClick={onSignOut}
          className="flex flex-col items-center justify-center gap-1 py-1 px-3 text-[10px] font-semibold text-[#8cb6dc] hover:text-rose-400"
          title="Keluar"
        >
          <FiLogOut className="size-4" />
          <span>Keluar</span>
        </button>
      </nav>
    </div>
  )
}
export default StudentLayout
