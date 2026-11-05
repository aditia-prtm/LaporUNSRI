import type { ReactNode } from 'react'
import { Brand } from '../common/Brand'
import unsriDroneImg from '../../assets/auth/unsri-drone.jpg'

type AuthLayoutProps = {
  officerPage: boolean
  onNavigate: (path: string) => void
  children: ReactNode
}

export function AuthLayout({ officerPage, onNavigate, children }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen bg-[#08315c] font-['Poppins','Montserrat',sans-serif]">
      {/* Desktop & Mobile Responsive Grid */}
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
        {/* Left Side: Campus Aerial Photography Showcase (Desktop Only) */}
        <section className="relative hidden lg:flex flex-col justify-between p-10 xl:p-14 text-white overflow-hidden select-none">
          {/* Background Drone Photo */}
          <img
            src={unsriDroneImg}
            alt="Pemandangan Udara Kampus Universitas Sriwijaya"
            className="absolute inset-0 size-full object-cover object-center filter brightness-[0.88]"
          />
          {/* Dark Contrast Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020b17]/95 via-[#020b17]/45 to-[#020b17]/60" />

          {/* Top Brand on Photo */}
          <div className="relative z-10 flex items-center justify-between">
            <Brand onClick={() => onNavigate('/')} />
          </div>

          {/* Bottom Headline & Tagline with Bar Accent */}
          <div className="relative z-10 max-w-[480px]">
            <h1 className="text-3xl xl:text-4xl font-bold leading-tight tracking-tight text-white drop-shadow">
              {officerPage
                ? 'Kawal fasilitas kampus tetap prima bersama kami.'
                : 'Mulai perjalanan kampus lebih baik bersama kami.'}
            </h1>
            <div className="mt-4 flex items-center gap-2.5 text-xs xl:text-sm text-slate-200">
              <span className="h-4 w-0.5 rounded-full bg-[#ffbb00]" />
              <span>
                {officerPage
                  ? 'Portal terintegrasi teknisi & penanggung jawab sarpras UNSRI.'
                  : 'Sampaikan dan pantau keluhan fasilitas secara transparan.'}
              </span>
            </div>
          </div>
        </section>

        {/* Mobile Header Photo Zone */}
        <div className="relative lg:hidden h-[230px] sm:h-[260px] w-full text-white select-none">
          <img
            src={unsriDroneImg}
            alt="Kampus Universitas Sriwijaya"
            className="absolute inset-0 size-full object-cover object-center filter brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#020b17]/80 via-[#020b17]/50 to-[#020b17]/90" />

          {/* Centered Brand & Tagline (Brand logo navigates back to '/') */}
          <div className="relative z-10 flex h-full flex-col items-center justify-center text-center px-6">
            <Brand onClick={() => onNavigate('/')} />
            <p className="mt-2 text-xs text-sky-100 max-w-[290px] leading-relaxed drop-shadow">
              Layanan aspirasi & pemeliharaan fasilitas kampus Universitas Sriwijaya
            </p>
          </div>
        </div>

        {/* Right Form Container (Desktop Right Side / Mobile Blue Sheet sliding up) */}
        <section className="relative z-20 flex-1 flex flex-col justify-center px-6 py-10 sm:px-12 lg:px-16 xl:px-20 bg-[#0c4278] text-white -mt-7 sm:-mt-8 lg:mt-0 rounded-t-[32px] lg:rounded-none border-t border-white/20 lg:border-t-0 lg:border-l lg:border-white/10 shadow-2xl">
          <div className="w-full max-w-[420px] mx-auto">
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}
