import type { ReactNode } from 'react'
import { Brand } from '../common/Brand'
import { FiArrowLeft } from 'react-icons/fi'
import unsriDroneImg from '../../assets/auth/unsri-drone.jpg'

type AuthLayoutProps = {
  officerPage: boolean
  onNavigate: (path: string) => void
  children: ReactNode
}

export function AuthLayout({ officerPage, onNavigate, children }: AuthLayoutProps) {
  return (
    <main className="relative min-h-screen bg-white font-['Poppins','Montserrat',sans-serif]">
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

          {/* Bottom Headline & Tagline with Bar Accent (Directly replicating the desktop screenshot) */}
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

        {/* Mobile Header Photo Zone (Replicating the mobile screenshot) */}
        <div className="relative lg:hidden h-[260px] sm:h-[300px] w-full text-white select-none">
          <img
            src={unsriDroneImg}
            alt="Kampus Universitas Sriwijaya"
            className="absolute inset-0 size-full object-cover object-center filter brightness-[0.85]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />

          {/* Top Back Button */}
          <div className="relative z-10 p-4 flex items-center justify-between">
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="inline-flex size-9 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
              aria-label="Kembali ke Beranda"
            >
              <FiArrowLeft className="size-4" />
            </button>
          </div>

          {/* Centered Brand & Tagline */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-6 -mt-3">
            <Brand onClick={() => onNavigate('/')} />
            <p className="mt-2 text-xs text-slate-200 max-w-[290px] leading-relaxed drop-shadow">
              Layanan aspirasi & pemeliharaan fasilitas kampus Universitas Sriwijaya
            </p>
          </div>
        </div>

        {/* Right Form Container (Desktop Right Side / Mobile White Sheet sliding up) */}
        <section className="relative z-20 flex-1 flex flex-col justify-center px-6 py-8 sm:px-12 lg:px-16 xl:px-20 bg-white -mt-7 sm:-mt-8 lg:mt-0 rounded-t-[32px] lg:rounded-none">
          <div className="w-full max-w-[420px] mx-auto">
            {/* Desktop Back Button */}
            <button
              type="button"
              onClick={() => onNavigate('/')}
              className="hidden lg:inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800 transition mb-6 cursor-pointer"
            >
              <FiArrowLeft className="size-3.5" />
              <span>Kembali</span>
            </button>

            {children}
          </div>
        </section>
      </div>
    </main>
  )
}
