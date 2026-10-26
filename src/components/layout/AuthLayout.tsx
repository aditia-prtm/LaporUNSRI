import type { ReactNode } from 'react'
import { Brand } from '../common/Brand'

type AuthLayoutProps = {
  officerPage: boolean
  onNavigate: (path: string) => void
  children: ReactNode
}

export function AuthLayout({ officerPage, onNavigate, children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen grid-cols-[minmax(320px,43%)_1fr] bg-white max-lg:grid-cols-[minmax(280px,39%)_1fr] max-sm:block">
      <section className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#116e50] px-8 py-9 text-white max-lg:px-6 max-sm:min-h-56 max-sm:px-6 max-sm:py-6">
        <Brand variant="light" onClick={() => onNavigate('/')} />
        <div className="relative z-10 mx-auto max-w-[420px] py-10 max-sm:my-auto max-sm:mx-0 max-sm:pb-1 max-sm:pt-6">
          <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#c2ead2] max-sm:text-[10px]"><span className="size-2 rounded-full bg-[#c5f0d6] shadow-[0_0_0_4px_#ffffff20]" /> Layanan aspirasi kampus UNSRI</span>
          <h1 className="my-4 mb-3.5 font-['Outfit','Montserrat','Poppins',sans-serif] text-[clamp(30px,3.4vw,44px)] leading-tight tracking-tight max-sm:my-0 max-sm:mb-1.5 max-sm:mt-3 max-sm:max-w-[410px] max-sm:text-2xl">{officerPage ? 'Bersama, kita jaga kampus tetap nyaman.' : 'Satu laporan bisa membawa perubahan.'}</h1>
          <p className="m-0 max-w-[350px] text-sm leading-relaxed text-[#d3e8dc] max-sm:text-xs">{officerPage ? 'Masuk untuk melihat laporan dan membantu proses penanganan fasilitas kampus.' : 'Sampaikan kendala fasilitas kampus dan ikuti perkembangannya dengan mudah.'}</p>
        </div>
        <div className="relative z-10 flex items-center gap-2.5 text-xs text-[#d1e8dc] max-sm:hidden"><span className="grid size-5.5 place-items-center rounded-full bg-white/15 text-[#d6f2df]">&#10003;</span> Layanan pelaporan fasilitas kampus</div>
        <div className="absolute -right-44 -top-24 size-[420px] rounded-full border border-white/[0.07] shadow-[0_0_0_43px_#ffffff06,0_0_0_86px_#ffffff04]" />
        <div className="absolute -bottom-28 -left-48 size-[300px] rounded-full border border-white/[0.07] shadow-[0_0_0_38px_#ffffff06,0_0_0_76px_#ffffff04]" />
      </section>
      <section className="relative flex min-h-screen items-center justify-center px-8 py-20 max-lg:px-6 max-sm:min-h-[calc(100vh-228px)] max-sm:items-start max-sm:px-6 max-sm:pb-9 max-sm:pt-16">
        <button className="absolute left-8 top-8 bg-transparent py-1.5 text-xs text-[#788580] hover:text-[var(--green)] max-lg:left-6 max-sm:left-6 max-sm:top-5" onClick={() => onNavigate('/')}><span className="mr-1.5" aria-hidden="true">&#8592;</span> Kembali ke beranda</button>
        {children}
      </section>
    </main>
  )
}
