import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'
import awan1 from '../../assets/home/awan-1.png'
import awan2 from '../../assets/home/awan-2.png'
import awan3 from '../../assets/home/awan-3.png'
import awan4 from '../../assets/home/awan-4.png'
import awan5 from '../../assets/home/awan-5.png'
import kampusUnsriDesktop from '../../assets/home/kampus-unsri-transparan.png'
import kampusUnsriTab from '../../assets/home/kampus-unsri-transparan-tab.png'
import kampusUnsriMobile from '../../assets/home/kampus-unsri-transparan-mobile.png'
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
    <section className="[position:relative] [width:100%] [height:100vh] [min-height:680px] [overflow:hidden] [display:flex] [flex-direction:column] [justify-content:flex-start] [background:linear-gradient(180deg,_#031830_0%,_#052345_20%,_#08315c_40%,_#0c4278_62%,_#105292_82%,_#135da3_100%_)] [color:#ffffff] [font-family:'Plus_Jakarta_Sans',_'DM_Sans',_system-ui,_-apple-system,_sans-serif] [user-select:none] max-[640px]:[min-height:580px]" aria-label="Hero Section LaporUNSRI"> {/* Ambient Atmospheric Lighting */} <div className="hero-sky-glow" aria-hidden="true" /> {/* Sky Zone: Dynamic flex area balancing header & text across all viewports */} <div className="[position:relative] [z-index:35] [width:100%] [height:48vh] [min-height:280px] [display:flex] [flex-direction:column] max-[1024px]:[height:60vh] max-[1024px]:[min-height:400px] max-[640px]:[height:62vh] max-[640px]:[min-height:350px]"> {/* Header Navigation */} <header className="[position:relative] [z-index:40] [width:100%] [max-width:1440px] [margin:0_auto] [padding:24px_44px_0] [display:flex] [align-items:center] [justify-content:space-between] max-[1024px]:[padding:20px_28px_0] max-[640px]:[padding:16px_18px_0]"> {/* Spacer for desktop centered logo; hidden on tablet & mobile */} <div className="hero-header-left max-[1024px]:[display:none]" /> {/* Brand Logo: Centered on desktop, aligned left on tablet & mobile */} <div className="hero-brand-logo max-[1024px]:[align-items:flex-start] max-[1024px]:[text-align:left] max-[1024px]:[margin-right:auto]"
            onClick={() => onNavigate('/')}
            role="button"
            tabIndex={0}
            aria-label="Kembali ke Beranda"
          >
            <div className="hero-brand-name max-[640px]:[font-size:21px]">
              <span className="hero-brand-light">lapor</span>
              <span className="hero-brand-bold">UNSRI</span>
              <span className="hero-brand-dot" aria-hidden="true" />
            </div>
            <span className="hero-brand-subtitle max-[1024px]:[text-align:left] max-[1024px]:[letter-spacing:0.22em] max-[640px]:[font-size:7.5px] max-[640px]:[letter-spacing:0.18em]">Layanan Aspirasi Kampus</span>
          </div>

          {/* Header Right Actions */}
          <div className="max-[1024px]:[flex:initial] max-[1024px]:[gap:12px] hero-header-right">
            <button
              type="button"
              className="max-[640px]:[padding:6px_16px] max-[640px]:[font-size:12.5px] hero-contact-button"
              onClick={() => onNavigate('/auth')}
            >
              Masuk
            </button>

            {/* Hamburger Menu (Tampilan saja dulu) */}
            <button
              type="button"
              className="max-[640px]:[width:36px] max-[640px]:[height:36px] max-[640px]:[width:20px] hero-menu-toggle"
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
          <h1 className="[margin:0] [font-size:clamp(32px,_3.8vw,_50px)] [font-weight:700] [line-height:1.15] [letter-spacing:-0.025em] [color:#ffffff] [white-space:nowrap] [text-shadow:0_2px_24px_rgba(2,_16,_32,_0.5)] max-[1024px]:[font-size:clamp(28px,_4.4vw,_42px)] max-[1024px]:[white-space:normal] max-[640px]:[white-space:normal] max-[640px]:[font-size:clamp(24px,_6.8vw,_32px)] max-[640px]:[line-height:1.22]">
            The value is in the <span className="hero-serif-accent">journey</span> </h1> <p className="[max-width:620px] [margin:16px_auto_0] [font-size:clamp(13px,_1.15vw,_15.5px)] [font-weight:400] [line-height:1.62] [color:rgba(226,_241,_255,_0.88)] [text-shadow:0_2px_14px_rgba(2,_14,_28,_0.6)] max-[1024px]:[font-size:clamp(13px,_1.8vw,_15px)] max-[1024px]:[max-width:520px] max-[1024px]:[margin-top:14px] max-[1024px]:[line-height:1.6] max-[640px]:[font-size:clamp(12px,_3.4vw,_13.5px)] max-[640px]:[margin-top:12px] max-[640px]:[line-height:1.54] max-[640px]:[max-width:330px]"> Bantu wujudkan lingkungan Universitas Sriwijaya yang lebih nyaman dan transparan. Laporkan fasilitas kampus yang perlu diperbaiki dan pantau tindak lanjutnya bersama kami. </p> </motion.div> </div> {/* ======================================================== INFINITE SEAMLESS CLOUDS (BEHIND KAMPUS UNSRI) - Densely packed (rapat) without gaps - Slower, majestic, serene drift animation to the RIGHT - Feathered gradient mask to eliminate any straight edge ======================================================== */} <div className="hero-clouds-container" aria-hidden="true"> {/* Layer 1: Upper / Atmospheric Billowing Clouds */} <div className="cloud-band-upper"> <div className="[display:flex] [height:100%] [width:max-content] [will-change:transform] [animation:driftRightSeamless_160s_linear_infinite]"> {/* Set A (Dense overlapping sequence) */} <div className="cloud-set"> <img src={awan2} alt="" className="cloud-img c-up-1" /> <img src={awan5} alt="" className="cloud-img c-up-2" /> <img src={awan1} alt="" className="cloud-img c-up-3" /> <img src={awan4} alt="" className="cloud-img c-up-4" /> <img src={awan2} alt="" className="cloud-img c-up-5" /> <img src={awan5} alt="" className="cloud-img c-up-6" /> <img src={awan3} alt="" className="cloud-img c-up-7" /> <img src={awan1} alt="" className="cloud-img c-up-8" /> </div> {/* Set B (Identical clone for seamless loop) */} <div className="cloud-set"> <img src={awan2} alt="" className="cloud-img c-up-1" /> <img src={awan5} alt="" className="cloud-img c-up-2" /> <img src={awan1} alt="" className="cloud-img c-up-3" /> <img src={awan4} alt="" className="cloud-img c-up-4" /> <img src={awan2} alt="" className="cloud-img c-up-5" /> <img src={awan5} alt="" className="cloud-img c-up-6" /> <img src={awan3} alt="" className="cloud-img c-up-7" /> <img src={awan1} alt="" className="cloud-img c-up-8" /> </div> </div> </div> {/* Layer 2: Lower / Main Horizon Clouds (Dense volume across entire width) */} <div className="cloud-band-lower"> <div className="[display:flex] [height:100%] [width:max-content] [will-change:transform] [animation:driftRightSeamless_115s_linear_infinite]"> {/* Set A (Tightly packed sequence) */} <div className="cloud-set"> <img src={awan1} alt="" className="cloud-img c-low-1" /> <img src={awan3} alt="" className="cloud-img c-low-2" /> <img src={awan5} alt="" className="cloud-img c-low-3" /> <img src={awan2} alt="" className="cloud-img c-low-4" /> <img src={awan4} alt="" className="cloud-img c-low-5" /> <img src={awan1} alt="" className="cloud-img c-low-6" /> <img src={awan5} alt="" className="cloud-img c-low-7" /> <img src={awan2} alt="" className="cloud-img c-low-8" /> <img src={awan3} alt="" className="cloud-img c-low-9" /> </div> {/* Set B (Identical clone for seamless loop) */} <div className="cloud-set"> <img src={awan1} alt="" className="cloud-img c-low-1" /> <img src={awan3} alt="" className="cloud-img c-low-2" /> <img src={awan5} alt="" className="cloud-img c-low-3" /> <img src={awan2} alt="" className="cloud-img c-low-4" /> <img src={awan4} alt="" className="cloud-img c-low-5" /> <img src={awan1} alt="" className="cloud-img c-low-6" /> <img src={awan5} alt="" className="cloud-img c-low-7" /> <img src={awan2} alt="" className="cloud-img c-low-8" /> <img src={awan3} alt="" className="cloud-img c-low-9" /> </div> </div> </div> </div> {/* ======================================================== KAMPUS UNSRI FOREGROUND STAGE (DEVICE-OPTIMIZED) - Responsive <picture> loading user-provided crops per device: * Mobile (<= 640px): kampus-unsri-transparan-mobile.png * Tablet (<= 1024px): kampus-unsri-transparan-tab.png * Desktop (> 1024px): kampus-unsri-transparan.png - Z-Index 30: Strictly in front of all clouds - No object in front of kampus unsri ======================================================== */} <motion.div className="[position:absolute] [bottom:0] [left:0] [right:0] [width:100%] [z-index:30] [display:flex] [justify-content:center] [align-items:flex-end] [pointer-events:none] [overflow:hidden] max-[1024px]:[max-height:48vh] max-[640px]:[max-height:46vh]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} > <picture className="[display:flex] [justify-content:center] [align-items:flex-end] [width:100%] [line-height:0]"> <source media="(max-width: 640px)" srcSet={kampusUnsriMobile} /> <source media="(max-width: 1024px)" srcSet={kampusUnsriTab} /> <img src={kampusUnsriDesktop} alt="Gedung Rektorat Kampus Universitas Sriwijaya" className="[display:block] [width:100%] [min-width:100%] [max-width:none] [height:auto] [object-fit:cover] [object-position:bottom_center] [filter:drop-shadow(0_-6px_35px_rgba(2,_18,_38,_0.45))] [filter:brightness(110%)] [will-change:transform] max-[1024px]:[width:100%] max-[1024px]:[min-width:100%] max-[1024px]:[height:auto] max-[1024px]:[object-position:bottom_center] max-[640px]:[width:100%] max-[640px]:[min-width:100%] max-[640px]:[height:auto] max-[640px]:[object-position:bottom_center]" /> </picture> </motion.div> {/* Bottom Scroll Down Arrow Indicator (Reference style) */} <div className="hero-bottom-bar"> <button type="button" className="hero-scroll-indicator" onClick={handleScrollClick} aria-label="Scroll ke alur pelaporan" > <FiChevronDown className="hero-scroll-arrow" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
