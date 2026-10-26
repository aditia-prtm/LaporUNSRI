import { motion, useScroll, useTransform } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { HeroSection } from '../../components/home/HeroSection'
import { ReportingFlowSection } from '../../components/home/ReportingFlowSection'
import { FaqSection } from '../../components/home/FaqSection'
import { LandingFooter } from '../../components/home/LandingFooter'
import { LandingNavbar } from '../../components/layout/LandingNavbar'

type LandingPageProps = { onNavigate: (path: string) => void }

export function LandingPage({ onNavigate }: LandingPageProps) {
  const lenis = useLenis()

  // Track scroll position to add parallax 3D depth to the pinned Hero
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 650], [1, 0.45])
  const heroScale = useTransform(scrollY, [0, 650], [1, 0.94])
  const heroY = useTransform(scrollY, [0, 650], [0, 90])

  const scrollToSteps = () => {
    const target = document.getElementById('steps-section') ?? window.innerHeight
    const activeLenis = lenis || (typeof window !== 'undefined' ? (window as unknown as { lenis?: typeof lenis }).lenis : undefined)

    if (activeLenis) {
      activeLenis.scrollTo(target, { offset: 0, duration: 1.2 })
    } else {
      const el = document.getElementById('steps-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      } else {
        window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })
      }
    }
  }

  const scrollToFaq = () => {
    const target = document.getElementById('faq-section')
    const activeLenis = lenis || (typeof window !== 'undefined' ? (window as unknown as { lenis?: typeof lenis }).lenis : undefined)

    if (activeLenis && target) {
      activeLenis.scrollTo(target, { offset: -70, duration: 1.2 })
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToTop = () => {
    const activeLenis = lenis || (typeof window !== 'undefined' ? (window as unknown as { lenis?: typeof lenis }).lenis : undefined)
    if (activeLenis) {
      activeLenis.scrollTo(0, { duration: 1.2 })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#020b17] font-['Outfit','Montserrat','Poppins',system-ui,sans-serif] text-white">
      {/* Top Floating Glassmorphic Navbar */}
      <LandingNavbar
        onNavigate={onNavigate}
        onScrollDown={scrollToSteps}
        onScrollToFaq={scrollToFaq}
      />

      {/* Pinned Sticky Hero Section (Stays anchored while content scrolls over it) */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
        className="sticky top-0 h-screen h-[100dvh] min-h-[680px] w-full z-10 overflow-hidden origin-center will-change-transform"
      >
        <HeroSection onScrollDown={scrollToSteps} />
      </motion.div>

      {/* Rising Parallax Content Container (Overlaps the Hero with dramatic top shadow) */}
      <div
        id="steps-section"
        className="relative z-20 w-full rounded-t-[36px] sm:rounded-t-[48px] md:rounded-t-[56px] bg-gradient-to-b from-[#051d38] via-[#04162a] to-[#020b17] shadow-[0_-30px_90px_rgba(0,0,0,0.95),0_-10px_35px_rgba(2,16,32,0.85)] border-t border-white/15"
      >
        {/* Ambient Top Glow Accent Line */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-[#4899e8]/15 via-transparent to-transparent rounded-t-[36px] sm:rounded-t-[48px] md:rounded-t-[56px]"
          aria-hidden="true"
        />

        {/* Section 1: Alur Pelaporan */}
        <ReportingFlowSection onStartReport={() => onNavigate('/auth')} />

        {/* Section 2: FAQ (Pertanyaan yang Sering Diajukan) */}
        <FaqSection />

        {/* Simple & Matching Footer */}
        <LandingFooter
          onNavigate={onNavigate}
          onScrollToTop={scrollToTop}
          onScrollToSteps={scrollToSteps}
          onScrollToFaq={scrollToFaq}
        />
      </div>
    </div>
  )
}
