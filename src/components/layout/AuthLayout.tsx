import type { ReactNode } from 'react'
import { Brand } from '../common/Brand'

type AuthLayoutProps = {
  officerPage: boolean
  onNavigate: (path: string) => void
  children: ReactNode
}

export function AuthLayout({ officerPage, onNavigate, children }: AuthLayoutProps) {
  return (
    <main className="auth-page">
      <section className="auth-aside">
        <Brand className="auth-brand" onClick={() => onNavigate('/')} />
        <div className="aside-message">
          <span className="eyebrow"><span className="status-dot" /> Layanan aspirasi kampus UNSRI</span>
          <h1>{officerPage ? 'Bersama, kita jaga kampus tetap nyaman.' : 'Satu laporan bisa membawa perubahan.'}</h1>
          <p>{officerPage ? 'Masuk untuk melihat laporan dan membantu proses penanganan fasilitas kampus.' : 'Sampaikan kendala fasilitas kampus dan ikuti perkembangannya dengan mudah.'}</p>
        </div>
        <div className="aside-bottom"><span className="aside-check">&#10003;</span> Layanan pelaporan fasilitas kampus</div>
        <div className="aside-decoration decoration-one" />
        <div className="aside-decoration decoration-two" />
      </section>
      <section className="auth-main">
        <button className="back-link" onClick={() => onNavigate('/')}><span aria-hidden="true">&#8592;</span> Kembali ke beranda</button>
        {children}
      </section>
    </main>
  )
}
