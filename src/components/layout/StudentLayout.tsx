import type { ReactNode } from 'react'
import type { UserProfile } from '../../types/auth'
import { Brand } from '../common/Brand'
import '../../pages/student/student.css'
import { FiClock, FiFileText, FiHome } from 'react-icons/fi'
type StudentLayoutProps = {
  profile: UserProfile
  active: 'dashboard' | 'reports' | 'mine'
  onNavigate: (path: string) => void
  onSignOut: () => void
  children: ReactNode
}

const navItems = [
  { id: 'dashboard', label: 'Ringkasan', path: '/mahasiswa' },
  { id: 'reports', label: 'Semua laporan', path: '/mahasiswa/laporan' },
  { id: 'mine', label: 'Laporan saya', path: '/mahasiswa/laporan-saya' },
] as const

export function StudentLayout({ profile, active, onNavigate, onSignOut, children }: StudentLayoutProps) {
  return (
    <div className="student-shell">
      <aside className="student-sidebar">
        <Brand className="student-brand" onClick={() => onNavigate('/mahasiswa')} />
        <div className="student-nav-label">MENU</div>
        <nav className="student-nav" aria-label="Navigasi mahasiswa">
          {navItems.map((item) => (
            <button key={item.id} className={active === item.id ? 'student-nav-link is-active' : 'student-nav-link'} onClick={() => onNavigate(item.path)}>
              <span className="nav-marker" aria-hidden="true">{item.id === 'dashboard' ? <FiHome /> : item.id === 'reports' ? <FiFileText /> : <FiClock />}</span>
              {item.label}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="student-profile"><span className="student-avatar">{profile.full_name.slice(0, 1).toUpperCase()}</span><span><strong>{profile.full_name}</strong><small>Mahasiswa</small></span></div>
          <button className="student-logout" onClick={onSignOut}>Keluar</button>
        </div>
      </aside>
      <div className="student-content-wrap">
        <header className="student-topbar"><span>Layanan aspirasi fasilitas kampus</span><button className="button button-primary student-create-top" onClick={() => onNavigate('/mahasiswa/laporan/baru')}>+ Buat laporan</button></header>
        <main className="student-content">{children}</main>
      </div>
    </div>
  )
}
