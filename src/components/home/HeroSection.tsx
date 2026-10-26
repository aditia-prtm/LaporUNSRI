import { useState } from 'react'
import { motion } from 'framer-motion'
import awan1 from '../../assets/home/awan-1.png'
import awan2 from '../../assets/home/awan-2.png'
import awan3 from '../../assets/home/awan-3.png'
import awan4 from '../../assets/home/awan-4.png'
import awan5 from '../../assets/home/awan-5.png'
import kampusUnsri from '../../assets/home/kampus-unsri-transparan.png'
import './HeroSection.css'

type HeroSectionProps = {
  onNavigate: (path: string) => void
  onScrollDown?: () => void
}

export function HeroSection({ onNavigate, onScrollDown }: HeroSectionProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const handleScrollClick = () => {
    if (onScrollDown) {
      onScrollDown()
      return
    }
    const nextSection = document.getElementById('steps-section')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="hero-container" aria-label="Hero Section LaporUNSRI">
      {/* Ambient Atmospheric Lighting */}
      <div className="hero-sky-glow" aria-hidden="true" />

      {/* Sky Zone: Dynamic flex area balancing header & text across all viewports */}
      <div className="hero-sky-zone">
        {/* Header Navigation */}
        <header className="hero-header">
          <div className="hero-header-left" />

          {/* Centered Brand Logo */}
          <div 
            className="hero-brand-logo" 
            onClick={() => onNavigate('/')}
            role="button"
            tabIndex={0}
            aria-label="Kembali ke Beranda"
          >
            <div className="hero-brand-name">
              <span className="hero-brand-light">lapor</span>
              <span className="hero-brand-bold">UNSRI</span>
              <span className="hero-brand-dot" aria-hidden="true" />
            </div>
            <span className="hero-brand-subtitle">Layanan Aspirasi Kampus</span>
          </div>

          {/* Header Right Actions */}
          <div className="hero-header-right">
            <button 
              type="button" 
              className="hero-contact-button"
              onClick={() => onNavigate('/auth')}
            >
              Masuk
            </button>

            {/* Hamburger Menu (Tampilan saja dulu) */}
            <button 
              type="button" 
              className="hero-menu-toggle" 
              aria-label="Toggle menu navigasi"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>

          {/* Minimal Dropdown Menu Preview */}
          {menuOpen && (
            <div className="hero-nav-dropdown" role="menu">
              <button type="button" onClick={() => { setMenuOpen(false); onNavigate('/'); }}>Beranda</button>
              <button type="button" onClick={() => { setMenuOpen(false); handleScrollClick(); }}>Alur Pelaporan</button>
              <button type="button" onClick={() => { setMenuOpen(false); onNavigate('/auth'); }}>Layanan Aspirasi</button>
              <button type="button" onClick={() => { setMenuOpen(false); onNavigate('/petugas'); }}>Portal Petugas</button>
            </div>
          )}
        </header>

        {/* Hero Center Content (Balanced and centered dynamically in the sky) */}
        <motion.div 
          className="hero-center-content"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="hero-title">
            The value is in the <span className="hero-serif-accent">journey</span>
          </h1>
          <p className="hero-subtitle">
            Bantu wujudkan lingkungan Universitas Sriwijaya yang lebih nyaman dan transparan. Laporkan fasilitas kampus yang perlu diperbaiki dan pantau tindak lanjutnya bersama kami.
          </p>
        </motion.div>
      </div>

      {/* ========================================================
          INFINITE SEAMLESS CLOUDS (BEHIND KAMPUS UNSRI)
          - Densely packed (rapat) without gaps
          - Moving to the RIGHT continuously with smooth linear drift
          - Feathered gradient mask to eliminate any straight edge
          ======================================================== */}
      <div className="hero-clouds-container" aria-hidden="true">
        {/* Layer 1: Upper / Atmospheric Billowing Clouds */}
        <div className="cloud-band-upper">
          <div className="cloud-track-slow">
            {/* Set A (Dense overlapping sequence) */}
            <div className="cloud-set">
              <img src={awan2} alt="" className="cloud-img c-up-1" />
              <img src={awan5} alt="" className="cloud-img c-up-2" />
              <img src={awan1} alt="" className="cloud-img c-up-3" />
              <img src={awan4} alt="" className="cloud-img c-up-4" />
              <img src={awan2} alt="" className="cloud-img c-up-5" />
              <img src={awan5} alt="" className="cloud-img c-up-6" />
              <img src={awan3} alt="" className="cloud-img c-up-7" />
              <img src={awan1} alt="" className="cloud-img c-up-8" />
            </div>
            {/* Set B (Identical clone for seamless loop) */}
            <div className="cloud-set">
              <img src={awan2} alt="" className="cloud-img c-up-1" />
              <img src={awan5} alt="" className="cloud-img c-up-2" />
              <img src={awan1} alt="" className="cloud-img c-up-3" />
              <img src={awan4} alt="" className="cloud-img c-up-4" />
              <img src={awan2} alt="" className="cloud-img c-up-5" />
              <img src={awan5} alt="" className="cloud-img c-up-6" />
              <img src={awan3} alt="" className="cloud-img c-up-7" />
              <img src={awan1} alt="" className="cloud-img c-up-8" />
            </div>
          </div>
        </div>

        {/* Layer 2: Lower / Main Horizon Clouds (Dense volume across entire width) */}
        <div className="cloud-band-lower">
          <div className="cloud-track-fast">
            {/* Set A (Tightly packed sequence) */}
            <div className="cloud-set">
              <img src={awan1} alt="" className="cloud-img c-low-1" />
              <img src={awan3} alt="" className="cloud-img c-low-2" />
              <img src={awan5} alt="" className="cloud-img c-low-3" />
              <img src={awan2} alt="" className="cloud-img c-low-4" />
              <img src={awan4} alt="" className="cloud-img c-low-5" />
              <img src={awan1} alt="" className="cloud-img c-low-6" />
              <img src={awan5} alt="" className="cloud-img c-low-7" />
              <img src={awan2} alt="" className="cloud-img c-low-8" />
              <img src={awan3} alt="" className="cloud-img c-low-9" />
            </div>
            {/* Set B (Identical clone for seamless loop) */}
            <div className="cloud-set">
              <img src={awan1} alt="" className="cloud-img c-low-1" />
              <img src={awan3} alt="" className="cloud-img c-low-2" />
              <img src={awan5} alt="" className="cloud-img c-low-3" />
              <img src={awan2} alt="" className="cloud-img c-low-4" />
              <img src={awan4} alt="" className="cloud-img c-low-5" />
              <img src={awan1} alt="" className="cloud-img c-low-6" />
              <img src={awan5} alt="" className="cloud-img c-low-7" />
              <img src={awan2} alt="" className="cloud-img c-low-8" />
              <img src={awan3} alt="" className="cloud-img c-low-9" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          KAMPUS UNSRI FOREGROUND STAGE
          - Full width edge-to-edge as requested: "lebar kampus di full kan aja"
          - Height auto menyesuaikan
          - Z-Index 30: Strictly in front of all clouds
          - No object in front of kampus unsri
          ======================================================== */}
      <motion.div 
        className="hero-campus-stage"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
      >
        <img 
          src={kampusUnsri} 
          alt="Gedung Rektorat Kampus Universitas Sriwijaya" 
          className="hero-campus-img" 
        />
      </motion.div>

      {/* Bottom Scroll Down Arrow Indicator (Reference style) */}
      <div className="hero-bottom-bar">
        <button 
          type="button" 
          className="hero-scroll-indicator"
          onClick={handleScrollClick}
          aria-label="Scroll ke alur pelaporan"
        >
          <svg 
            className="hero-scroll-arrow" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </section>
  )
}
