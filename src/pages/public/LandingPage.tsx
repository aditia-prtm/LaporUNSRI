import { HeroSection } from '../../components/home/HeroSection'
import { Brand } from '../../components/common/Brand'

type LandingPageProps = { onNavigate: (path: string) => void }

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <main className="landing-page-root">
      {/* Full-bleed Cinematic Hero Section */}
      <HeroSection onNavigate={onNavigate} />

      {/* Structured Content Below Hero */}
      <div className="landing-content-wrap">
        <section id="steps-section" className="steps-section" aria-label="Cara kerja">
          <div className="section-heading">
            <span className="eyebrow">Mulai dalam beberapa langkah</span>
            <h2>Suara Anda membantu kampus bergerak.</h2>
          </div>
          <div className="steps-grid">
            <article className="step-card">
              <span className="step-number">01</span>
              <div className="step-icon">&#9998;</div>
              <h3>Ceritakan masalahnya</h3>
              <p>Jelaskan kendala fasilitas di lingkungan kampus dengan singkat dan jelas.</p>
            </article>
            <article className="step-card">
              <span className="step-number">02</span>
              <div className="step-icon">&#8982;</div>
              <h3>Tentukan lokasinya</h3>
              <p>Sertakan gedung dan lokasi agar laporan mudah ditemukan petugas.</p>
            </article>
            <article className="step-card">
              <span className="step-number">03</span>
              <div className="step-icon">&#8599;</div>
              <h3>Pantau tindak lanjut</h3>
              <p>Lihat perkembangan laporan dan informasi penanganannya.</p>
            </article>
          </div>
        </section>

        <footer className="site-footer">
          <Brand className="footer-brand" onClick={() => onNavigate('/')} />
          <span>Untuk kampus yang lebih nyaman, bersama.</span>
          <button className="footer-link" onClick={() => onNavigate('/auth')}>
            Mulai melapor <span aria-hidden="true">&#8594;</span>
          </button>
        </footer>
      </div>
    </main>
  )
}
