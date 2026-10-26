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
      <div className="mx-auto max-w-[1320px] px-4 sm:px-8">
        <section id="steps-section" className="border-t border-[#edf1ef] py-12 pb-16 max-sm:py-10" aria-label="Cara kerja">
          <div className="text-center">
            <span className="inline-flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--green)]">Mulai dalam beberapa langkah</span>
            <h2 className="mb-7 mt-3 font-['Manrope',sans-serif] text-[clamp(22px,2.5vw,30px)] tracking-tight max-sm:mb-5 max-sm:text-2xl">Suara Anda membantu kampus bergerak.</h2>
          </div>
          <div className="grid grid-cols-3 gap-4 max-md:gap-3 max-sm:grid-cols-1 max-sm:gap-2.5">
            {steps.map((step, index) => (
              <article key={step.title} className="relative min-h-[175px] rounded-xl border border-[#e9efeb] bg-white p-5 max-sm:min-h-0 max-sm:py-4 max-sm:pr-4 max-sm:pl-16">
                <span className="absolute right-5 top-5 font-['Manrope',sans-serif] text-xs font-extrabold text-[#c3d5cb] max-sm:right-4 max-sm:top-3.5">{String(index + 1).padStart(2, '0')}</span>
                <div className="mb-3.5 grid size-9 place-items-center rounded-xl bg-[#edf7f0] text-lg text-[var(--green)] max-sm:absolute max-sm:left-4 max-sm:top-4">{step.icon}</div>
                <h3 className="mb-1.5 font-['Manrope',sans-serif] text-sm max-sm:text-xs">{step.title}</h3>
                <p className="m-0 text-xs leading-relaxed text-[var(--muted)] max-sm:text-[10px]">{step.description}</p>
              </article>
            ))}
          </div>
        </section>

        <footer className="flex min-h-[71px] items-center gap-4 border-t border-[#edf1ef] text-xs text-[#8b9692] max-sm:flex-wrap max-sm:gap-x-3.5 max-sm:gap-y-2 max-sm:py-4">
          <Brand className="text-sm" onClick={() => onNavigate('/')} />
          <span className="max-sm:order-2 max-sm:w-full">Untuk kampus yang lebih nyaman, bersama.</span>
          <button className="ml-auto border-0 bg-transparent py-2 text-xs font-bold text-[var(--green)]" onClick={() => onNavigate('/auth')}>
            Mulai melapor <span aria-hidden="true">&#8594;</span>
          </button>
        </footer>
      </div>
    </main>
  )
}
