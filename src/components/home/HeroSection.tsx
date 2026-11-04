import { useLenis } from 'lenis/react'
import { motion } from 'framer-motion'
import { FiChevronDown, FiArrowRight } from 'react-icons/fi'
import awan1 from '../../assets/home/awan-1.png'
import awan2 from '../../assets/home/awan-2.png'
import awan3 from '../../assets/home/awan-3.png'
import awan4 from '../../assets/home/awan-4.png'
import awan5 from '../../assets/home/awan-5.png'
import kampusUnsriDesktop from '../../assets/home/kampus-unsri-transparan.png'
import kampusUnsriTab from '../../assets/home/kampus-unsri-transparan-tab.png'
import kampusUnsriMobile from '../../assets/home/kampus-unsri-transparan-mobile.png'

type HeroSectionProps = {
  onScrollDown?: () => void
  onScrollToSteps?: () => void
  onStartReport?: () => void
}

const upperClouds = [
  { img: awan2, pos: 'left-[-100px] bottom-[110px] h-[310px] opacity-[0.82]' },
  { img: awan5, pos: 'left-[360px] bottom-[130px] h-[330px] opacity-80' },
  { img: awan1, pos: 'left-[820px] bottom-[105px] h-[320px] opacity-[0.84]' },
  { img: awan4, pos: 'left-[1280px] bottom-[125px] h-[310px] opacity-[0.78]' },
  { img: awan2, pos: 'left-[1740px] bottom-[110px] h-[330px] opacity-[0.82]' },
  { img: awan5, pos: 'left-[2200px] bottom-[135px] h-[340px] opacity-80' },
  { img: awan3, pos: 'left-[2660px] bottom-[105px] h-[310px] opacity-[0.78]' },
  { img: awan1, pos: 'left-[3120px] bottom-[120px] h-[320px] opacity-[0.84]' },
]

const lowerClouds = [
  { img: awan1, pos: 'left-[-120px] bottom-[35px] h-[330px] opacity-[0.92]' },
  { img: awan3, pos: 'left-[320px] bottom-[45px] h-[320px] opacity-[0.88]' },
  { img: awan5, pos: 'left-[760px] bottom-[30px] h-[340px] opacity-[0.94]' },
  { img: awan2, pos: 'left-[1200px] bottom-[50px] h-[330px] opacity-90' },
  { img: awan4, pos: 'left-[1640px] bottom-[35px] h-[310px] opacity-[0.88]' },
  { img: awan1, pos: 'left-[2060px] bottom-[45px] h-[340px] opacity-[0.92]' },
  { img: awan5, pos: 'left-[2500px] bottom-[30px] h-[350px] opacity-[0.94]' },
  { img: awan2, pos: 'left-[2940px] bottom-[45px] h-[330px] opacity-90' },
  { img: awan3, pos: 'left-[3360px] bottom-[35px] h-[320px] opacity-[0.92]' },
]

export function HeroSection({ onScrollDown, onScrollToSteps, onStartReport }: HeroSectionProps) {
  const lenis = useLenis()

  const handleScrollToSteps = () => {
    if (onScrollToSteps) {
      onScrollToSteps()
      return
    }
    if (lenis) {
      lenis.scrollTo('#steps-section', { offset: -24, duration: 1.2 })
    } else {
      const nextSection = document.getElementById('steps-section')
      if (nextSection) {
        nextSection.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleScrollClick = () => {
    if (onScrollDown) {
      onScrollDown()
      return
    }
    const nextSection = document.getElementById('about-section')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleReportClick = () => {
    if (onStartReport) {
      onStartReport()
      return
    }
    const nextSection = document.getElementById('about-section')
    if (nextSection) {
      nextSection.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative flex hero-viewport-height h-full w-full flex-col justify-start overflow-hidden bg-[linear-gradient(180deg,#031830_0%,#052345_20%,#08315c_40%,#0c4278_62%,#105292_82%,#135da3_100%)] font-['Poppins','Montserrat','Outfit',system-ui,-apple-system,sans-serif] text-white select-none" aria-label="Hero Section LaporUNSRI">
      {/* Ambient Atmospheric Lighting */}
      <div className="absolute inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_95%_55%_at_50%_55%,rgba(55,155,245,0.32)_0%,rgba(5,32,62,0)_75%)]" aria-hidden="true" />

      {/* Sky Zone: Dynamic flex area balancing hero copy below the fixed navbar */}
      <div className="relative z-50 pointer-events-none flex h-[50svh] min-h-[320px] w-full flex-col pt-[86px] lg:pt-[150px] box-border max-lg:h-[54svh] max-lg:min-h-0 max-lg:pt-[90px] max-sm:h-[60svh] max-sm:min-h-0 max-sm:pt-[112px]">
        {/* Hero Center Content (Balanced and centered dynamically in the sky) */}
        <motion.div
          className="pointer-events-auto flex flex-1 flex-col items-center justify-center w-full max-w-[880px] mx-auto px-6 py-2 text-center max-md:px-4.5 max-sm:px-4 max-sm:translate-y-3"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="m-0 text-[clamp(36px,3.5vw,48px)] font-bold leading-[1.15] tracking-[-0.025em] text-white whitespace-nowrap [text-shadow:0_2px_24px_rgba(2,16,32,0.5)] max-lg:text-[clamp(27px,4.2vw,40px)] max-lg:whitespace-normal max-sm:text-[clamp(24px,6.8vw,31px)] max-sm:leading-[1.2]">
            Building a better campus,{' '}
            <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-semibold text-[#ffbb00] tracking-[0.015em] pl-1.5 [text-shadow:0_0_28px_rgba(127,195,248,0.45)]">
              together
            </span>
          </h1>
          <p className="mx-auto mt-3 max-w-[600px] text-[15px] lg:text-[17px] font-normal leading-[1.58] text-white [text-shadow:0_2px_14px_rgba(2,14,28,0.6)] max-lg:max-w-[500px] max-lg:mt-3 max-lg:leading-[1.56] max-sm:mt-2.5 max-sm:max-w-[325px] max-sm:text-[12.5px] max-sm:leading-[1.52]">
            Bantu wujudkan lingkungan Universitas Sriwijaya yang lebih nyaman dan transparan. Laporkan fasilitas kampus yang perlu diperbaiki dan pantau tindak lanjutnya bersama kami.
          </p>

          {/* Hero CTAs matching Auth Page style */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3 sm:gap-4 max-sm:mt-4 max-sm:gap-2.5">
            <button
              type="button"
              onClick={handleReportClick}
              className="inline-flex items-center gap-2 rounded-2xl bg-[#0c4278] hover:bg-[#08315c] border border-white/20 px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white shadow-lg shadow-black/30 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            >
              <span>Buat Laporan</span>
              <FiArrowRight className="size-3.5 sm:size-4" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={handleScrollToSteps}
              className="inline-flex items-center gap-1.5 rounded-2xl border border-white/30 bg-white/10 hover:bg-white/20 px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-md shadow-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
            >
              <span>Pelajari Alur</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Infinite Seamless Clouds (Behind Kampus UNSRI) */}
      <div className="absolute inset-0 size-full pointer-events-none overflow-hidden z-10 [mask-image:linear-gradient(180deg,transparent_0%,transparent_20%,rgba(0,0,0,0.25)_34%,rgba(0,0,0,0.7)_46%,black_58%,black_100%)] [-webkit-mask-image:linear-gradient(180deg,transparent_0%,transparent_20%,rgba(0,0,0,0.25)_34%,rgba(0,0,0,0.7)_46%,black_58%,black_100%)]" aria-hidden="true">
        {/* Layer 1: Upper Atmospheric Clouds */}
        <div className="absolute bottom-20 left-0 size-full z-[11] opacity-85">
          <div className="flex h-full w-max will-change-transform [animation:driftRightSeamless_160s_linear_infinite]">
            <div className="relative flex items-end w-[3600px] h-full shrink-0">
              {upperClouds.map((cloud, index) => (
                <img key={`up-a-${index}`} src={cloud.img} alt="" className={`absolute select-none pointer-events-none object-contain w-auto ${cloud.pos}`} />
              ))}
            </div>
            <div className="relative flex items-end w-[3600px] h-full shrink-0">
              {upperClouds.map((cloud, index) => (
                <img key={`up-b-${index}`} src={cloud.img} alt="" className={`absolute select-none pointer-events-none object-contain w-auto ${cloud.pos}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Layer 2: Lower Horizon Clouds */}
        <div className="absolute bottom-0 left-0 size-full z-[15] opacity-95">
          <div className="flex h-full w-max will-change-transform [animation:driftRightSeamless_115s_linear_infinite]">
            <div className="relative flex items-end w-[3600px] h-full shrink-0">
              {lowerClouds.map((cloud, index) => (
                <img key={`low-a-${index}`} src={cloud.img} alt="" className={`absolute select-none pointer-events-none object-contain w-auto ${cloud.pos}`} />
              ))}
            </div>
            <div className="relative flex items-end w-[3600px] h-full shrink-0">
              {lowerClouds.map((cloud, index) => (
                <img key={`low-b-${index}`} src={cloud.img} alt="" className={`absolute select-none pointer-events-none object-contain w-auto ${cloud.pos}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Kampus Unsri Foreground Stage */}
      <motion.div className="absolute inset-x-0 bottom-0 z-30 flex w-full items-end justify-center pointer-events-none pb-[env(safe-area-inset-bottom,0px)]" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}>
        <picture className="flex w-full items-end justify-center leading-none">
          <source media="(max-width: 640px)" srcSet={kampusUnsriMobile} />
          <source media="(max-width: 1024px)" srcSet={kampusUnsriTab} />
          <img src={kampusUnsriDesktop} alt="Gedung Rektorat Kampus Universitas Sriwijaya" className="block h-auto w-full min-w-full max-w-none object-cover object-bottom" />
        </picture>
      </motion.div>

      {/* Bottom Scroll Down Arrow Indicator */}
      <div className="absolute bottom-8 max-sm:bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] inset-x-0 z-[35] flex w-full items-center justify-center pointer-events-none">
        <button
          type="button"
          className="pointer-events-auto flex size-8 items-center justify-center rounded-full border border-white/35 bg-white/15 text-white backdrop-blur-md shadow-md shadow-black/25 transition-all duration-200 hover:bg-white/30 hover:translate-y-0.5 hover:shadow-lg"
          onClick={handleScrollClick}
          aria-label="Scroll ke alur pelaporan"
        >
          <FiChevronDown className="size-3.5 stroke-[2.2] animate-bounce" aria-hidden="true" />
        </button>
      </div>
    </section>
  )
}
