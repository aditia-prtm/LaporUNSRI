import { useLenis } from 'lenis/react'
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

type HeroSectionProps = {
  onScrollDown?: () => void
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

export function HeroSection({ onScrollDown }: HeroSectionProps) {
  const lenis = useLenis()

  const handleScrollClick = () => {
    if (onScrollDown) {
      onScrollDown()
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

  return (
    <section className="relative flex hero-viewport-height h-full w-full flex-col justify-start overflow-hidden bg-[linear-gradient(180deg,#031830_0%,#052345_20%,#08315c_40%,#0c4278_62%,#105292_82%,#135da3_100%)] font-['Outfit','Montserrat','Poppins',system-ui,-apple-system,sans-serif] text-white select-none" aria-label="Hero Section LaporUNSRI">
      {/* Ambient Atmospheric Lighting */}
      <div className="absolute inset-0 pointer-events-none z-[1] bg-[radial-gradient(ellipse_95%_55%_at_50%_55%,rgba(55,155,245,0.32)_0%,rgba(5,32,62,0)_75%)]" aria-hidden="true" />

      {/* Sky Zone: Dynamic flex area balancing hero copy below the fixed navbar */}
      <div className="relative z-50 pointer-events-none flex h-[48dvh] min-h-[280px] w-full flex-col pt-[76px] box-border max-lg:h-[54dvh] max-lg:min-h-0 max-lg:pt-[68px] max-sm:h-[48dvh] max-sm:min-h-0 max-sm:pt-[58px]">
        {/* Hero Center Content (Balanced and centered dynamically in the sky) */}
        <motion.div
          className="pointer-events-auto flex flex-1 flex-col items-center justify-center w-full max-w-[880px] mx-auto px-6 py-2.5 text-center max-md:px-4.5"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
        >
          <h1 className="m-0 text-[clamp(40px,3.8vw,50px)] font-bold leading-[1.15] tracking-[-0.025em] text-white whitespace-nowrap [text-shadow:0_2px_24px_rgba(2,16,32,0.5)] max-lg:text-[clamp(28px,4.4vw,42px)] max-lg:whitespace-normal max-sm:text-[clamp(24px,6.8vw,32px)] max-sm:leading-[1.22]">
            The value is in the{' '}
            <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-semibold text-[#ffbb00] tracking-[0.015em] pl-1.5 [text-shadow:0_0_28px_rgba(127,195,248,0.45)]">journey</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[620px] text-base lg:text-lg font-normal leading-[1.62] text-white [text-shadow:0_2px_14px_rgba(2,14,28,0.6)] max-lg:max-w-[520px] max-lg:mt-3.5 max-lg:leading-[1.6] max-sm:mt-3 max-sm:max-w-[330px] max-sm:leading-[1.54]">
            Bantu wujudkan lingkungan Universitas Sriwijaya yang lebih nyaman dan transparan. Laporkan fasilitas kampus yang perlu diperbaiki dan pantau tindak lanjutnya bersama kami.
          </p>
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
          <img src={kampusUnsriDesktop} alt="Gedung Rektorat Kampus Universitas Sriwijaya" className="block h-auto w-full min-w-full max-w-none object-cover object-bottom will-change-transform" />
        </picture>
      </motion.div>

      {/* Bottom Scroll Down Arrow Indicator */}
      <div className="absolute bottom-4 max-sm:bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] inset-x-0 z-[35] flex w-full items-center justify-center pointer-events-none">
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
