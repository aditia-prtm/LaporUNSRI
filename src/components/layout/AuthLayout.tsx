import type { ReactNode } from 'react'
import { Brand } from '../common/Brand'

type AuthLayoutProps = {
  officerPage: boolean
  onNavigate: (path: string) => void
  children: ReactNode
}

export function AuthLayout({ officerPage, onNavigate, children }: AuthLayoutProps) {
  return (
    <main className="grid min-h-screen grid-cols-[minmax(320px,43%)_1fr] bg-white max-[850px]:grid-cols-[minmax(280px,39%)_1fr] max-[620px]:block">
      <section className="relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#116e50] px-[9%] py-[35px] text-white max-[850px]:px-[8%] max-[620px]:min-h-[228px] max-[620px]:px-[25px] max-[620px]:py-[23px]">
        <Brand variant="light" onClick={() => onNavigate('/')} />
        <div className="relative z-[2] mx-auto max-w-[420px] py-10 max-[620px]:my-auto max-[620px]:ml-0 max-[620px]:mr-0 max-[620px]:pb-1 max-[620px]:pt-[26px]">
          <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.07em] text-[#c2ead2] max-[620px]:text-[9px]"><span className="h-[7px] w-[7px] rounded-full bg-[#c5f0d6] shadow-[0_0_0_4px_#ffffff20]" /> Layanan aspirasi kampus UNSRI</span>
          <h1 className="my-[19px] mb-[14px] font-[Manrope,sans-serif] text-[clamp(33px,3.4vw,47px)] leading-[1.16] tracking-[-2px] max-[620px]:my-0 max-[620px]:mb-1.5 max-[620px]:mt-3 max-[620px]:max-w-[410px] max-[620px]:text-2xl max-[620px]:tracking-[-0.8px]">{officerPage ? 'Bersama, kita jaga kampus tetap nyaman.' : 'Satu laporan bisa membawa perubahan.'}</h1>
          <p className="m-0 max-w-[350px] text-sm leading-[1.8] text-[#d3e8dc] max-[620px]:text-[11px]">{officerPage ? 'Masuk untuk melihat laporan dan membantu proses penanganan fasilitas kampus.' : 'Sampaikan kendala fasilitas kampus dan ikuti perkembangannya dengan mudah.'}</p>
        </div>
        <div className="relative z-[2] flex items-center gap-2.5 text-[11px] text-[#d1e8dc] max-[620px]:hidden"><span className="grid h-[22px] w-[22px] place-items-center rounded-full bg-white/15 text-[#d6f2df]">&#10003;</span> Layanan pelaporan fasilitas kampus</div>
        <div className="absolute -right-[188px] -top-[95px] h-[420px] w-[420px] rounded-full border border-white/[0.07] shadow-[0_0_0_43px_#ffffff06,0_0_0_86px_#ffffff04]" />
        <div className="absolute -bottom-[110px] -left-[194px] h-[300px] w-[300px] rounded-full border border-white/[0.07] shadow-[0_0_0_38px_#ffffff06,0_0_0_76px_#ffffff04]" />
      </section>
      <section className="relative flex min-h-screen items-center justify-center px-[8%] py-20 max-[850px]:px-[6%] max-[620px]:min-h-[calc(100vh-228px)] max-[620px]:items-start max-[620px]:px-[25px] max-[620px]:pb-9 max-[620px]:pt-[69px]">
        <button className="absolute left-[8%] top-[35px] bg-transparent py-[7px] text-xs text-[#788580] hover:text-[var(--green)] max-[850px]:left-[6%] max-[620px]:left-[25px] max-[620px]:top-[22px]" onClick={() => onNavigate('/')}><span className="mr-[7px]" aria-hidden="true">&#8592;</span> Kembali ke beranda</button>
        {children}
      </section>
    </main>
  )
}
