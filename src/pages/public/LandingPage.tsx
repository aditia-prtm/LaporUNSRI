import { Brand } from '../../components/common/Brand'

type LandingPageProps = { onNavigate: (path: string) => void }

export function LandingPage({ onNavigate }: LandingPageProps) {
  return (
    <main className="landing-page">
      <header className="site-header">
        <Brand onClick={() => onNavigate('/')} />
        <button className="button button-outline header-action" onClick={() => onNavigate('/auth')}>Masuk</button>
      </header>

      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow"><span className="status-dot" /> Layanan aspirasi kampus UNSRI</span>
          <h1>Temukan masalah.<br /><span>Sampaikan laporannya.</span></h1>
          <p className="hero-description">Bantu wujudkan lingkungan kampus yang lebih nyaman. Laporkan fasilitas yang perlu diperbaiki dan pantau tindak lanjutnya.</p>
          <div className="hero-actions">
            <button className="button button-primary" onClick={() => onNavigate('/auth')}>Buat laporan <span aria-hidden="true">&#8594;</span></button>
            <button className="button button-text" onClick={() => onNavigate('/auth')}>Saya sudah punya akun</button>
          </div>
          <div className="hero-points"><span><i>&#10003;</i> Mudah disampaikan</span><span><i>&#10003;</i> Status bisa dipantau</span></div>
        </div>
        <div className="hero-art" aria-label="Ilustrasi kampus dan laporan fasilitas">
          <div className="art-sun" />
          <div className="art-cloud cloud-one" /><div className="art-cloud cloud-two" />
          <div className="art-building">
            <div className="building-roof" />
            <div className="building-body">
              <div className="building-sign">UNSRI</div>
              <div className="building-windows">{Array.from({ length: 12 }, (_, index) => <i key={index} />)}</div>
              <div className="building-door" />
            </div>
          </div>
          <div className="art-tree tree-left"><i /><b /></div>
          <div className="art-tree tree-right"><i /><b /></div>
          <div className="report-card"><span className="report-icon">&#10003;</span><span><b>Laporan tersampaikan</b><small>Siap ditindaklanjuti</small></span></div>
          <div className="art-ground" />
        </div>
      </section>

      <section className="steps-section" aria-label="Cara kerja">
        <div className="section-heading"><span className="eyebrow">Mulai dalam beberapa langkah</span><h2>Suara Anda membantu kampus bergerak.</h2></div>
        <div className="steps-grid">
          <article className="step-card"><span className="step-number">01</span><div className="step-icon">&#9998;</div><h3>Ceritakan masalahnya</h3><p>Jelaskan kendala fasilitas di lingkungan kampus dengan singkat dan jelas.</p></article>
          <article className="step-card"><span className="step-number">02</span><div className="step-icon">&#8982;</div><h3>Tentukan lokasinya</h3><p>Sertakan gedung dan lokasi agar laporan mudah ditemukan petugas.</p></article>
          <article className="step-card"><span className="step-number">03</span><div className="step-icon">&#8599;</div><h3>Pantau tindak lanjut</h3><p>Lihat perkembangan laporan dan informasi penanganannya.</p></article>
        </div>
      </section>

      <footer className="site-footer">
        <Brand className="footer-brand" onClick={() => onNavigate('/')} />
        <span>Untuk kampus yang lebih nyaman, bersama.</span>
        <button className="footer-link" onClick={() => onNavigate('/auth')}>Mulai melapor <span aria-hidden="true">&#8594;</span></button>
      </footer>
    </main>
  )
}
