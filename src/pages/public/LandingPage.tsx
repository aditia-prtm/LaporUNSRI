import { HeroSection } from '../../components/home/HeroSection'
import { Brand } from '../../components/common/Brand'
import { LandingNavbar } from '../../components/layout/LandingNavbar'

type LandingPageProps = { onNavigate: (path: string) => void }

const steps = [
  { icon: '✎', title: 'Ceritakan masalahnya', description: 'Jelaskan kendala fasilitas di lingkungan kampus dengan singkat dan jelas.' },
  { icon: '⌂', title: 'Tentukan lokasinya', description: 'Sertakan gedung dan lokasi agar laporan mudah ditemukan petugas.' },
  { icon: '↗', title: 'Pantau tindak lanjut', description: 'Lihat perkembangan laporan dan informasi penanganannya.' },
]

export function LandingPage({ onNavigate }: LandingPageProps) {
  const scrollToSteps = () => {
    document.getElementById('steps-section')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <main className="min-h-screen w-full overflow-x-hidden bg-[#fbfcfa]">
      <LandingNavbar onNavigate={onNavigate} onScrollDown={scrollToSteps} />
      {/* Full-bleed Cinematic Hero Section */}
      <HeroSection onScrollDown={scrollToSteps} />

      {/* Structured Content Below Hero */}
      <div className="mx-auto max-w-[1320px] px-[5%]">
        <section id="steps-section" className="border-t border-[#edf1ef] py-[52px] pb-[63px] max-[620px]:py-[39px]" aria-label="Cara kerja">
          <div className="text-center">
            <span className="inline-flex items-center justify-center gap-2 text-[11px] font-bold uppercase tracking-[0.07em] text-[var(--green)]">Mulai dalam beberapa langkah</span>
            <h2 className="mb-[29px] mt-3 font-[Manrope,sans-serif] text-[clamp(22px,2.5vw,30px)] tracking-[-1px] max-[620px]:mb-[21px] max-[620px]:text-[23px]">Suara Anda membantu kampus bergerak.</h2>
          </div>
          <div className="grid grid-cols-3 gap-[17px] max-[850px]:gap-[11px] max-[620px]:grid-cols-1 max-[620px]:gap-2.5">
            {steps.map((step, index) => (
              <article key={step.title} className="relative min-h-[175px] rounded-xl border border-[#e9efeb] bg-white p-[21px_23px] max-[850px]:p-[18px_16px] max-[620px]:min-h-0 max-[620px]:py-[17px] max-[620px]:pr-[18px] max-[620px]:pl-[66px]">
                <span className="absolute right-[21px] top-5 font-[Manrope,sans-serif] text-xs font-extrabold text-[#c3d5cb] max-[620px]:right-[17px] max-[620px]:top-[15px]">{String(index + 1).padStart(2, '0')}</span>
                <div className="mb-[14px] grid h-[35px] w-[35px] place-items-center rounded-[10px] bg-[#edf7f0] text-[19px] text-[var(--green)] max-[620px]:absolute max-[620px]:left-[17px] max-[620px]:top-5">{step.icon}</div>
                <h3 className="mb-[7px] font-[Manrope,sans-serif] text-[13px] max-[620px]:text-xs">{step.title}</h3>
                <p className="m-0 text-[11px] leading-[1.6] text-[var(--muted)] max-[620px]:text-[10px]">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="flex min-h-[71px] items-center gap-[18px] border-t border-[#edf1ef] text-[10px] text-[#8b9692] max-[620px]:flex-wrap max-[620px]:gap-x-[14px] max-[620px]:gap-y-[9px] max-[620px]:py-4">
          <Brand className="text-sm" onClick={() => onNavigate('/')} />
          <span className="max-[620px]:order-2 max-[620px]:w-full">Untuk kampus yang lebih nyaman, bersama.</span>
          <button className="ml-auto border-0 bg-transparent py-2 text-[11px] font-bold text-[var(--green)]" onClick={() => onNavigate('/auth')}>
            Mulai melapor <span aria-hidden="true">&#8594;</span>
          </button>
        </footer>
      </div>
    </main>
  )
}
