import { useEffect, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { HeroSection } from '../../components/home/HeroSection'
import { AboutSection } from '../../components/home/AboutSection'
import { ReportingFlowSection } from '../../components/home/ReportingFlowSection'
import { FaqSection } from '../../components/home/FaqSection'
import { LandingFooter } from '../../components/home/LandingFooter'
import { LandingNavbar } from '../../components/layout/LandingNavbar'

type LandingPageProps = { onNavigate: (path: string) => void }

export function LandingPage({ onNavigate }: LandingPageProps) {
  const lenis = useLenis()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(typeof window !== 'undefined' && window.innerWidth >= 768)
    }
    checkDesktop()
    window.addEventListener('resize', checkDesktop, { passive: true })
    return () => window.removeEventListener('resize', checkDesktop)
  }, [])

  // Track scroll position to add parallax 3D depth to the pinned Hero on desktop
  const { scrollY } = useScroll()
  const heroOpacity = useTransform(scrollY, [0, 650], [1, 0.45])
  const heroScale = useTransform(scrollY, [0, 650], [1, 0.94])
  const heroY = useTransform(scrollY, [0, 650], [0, 90])

  const heroStyle = isDesktop
    ? { opacity: heroOpacity, scale: heroScale, y: heroY }
    : undefined

  const scrollToAbout = () => {
    const target = document.getElementById('about-section')
    const activeLenis = lenis || (typeof window !== 'undefined' ? (window as unknown as { lenis?: typeof lenis }).lenis : undefined)

    if (activeLenis && target) {
      activeLenis.scrollTo(target, { offset: -40, duration: 1.2 })
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const scrollToSteps = () => {
    const target = document.getElementById('steps-section')
    const activeLenis = lenis || (typeof window !== 'undefined' ? (window as unknown as { lenis?: typeof lenis }).lenis : undefined)

    if (activeLenis && target) {
      activeLenis.scrollTo(target, { offset: -60, duration: 1.2 })
    } else if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
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
    <div className="relative min-h-screen w-full overflow-x-clip bg-[#020b17] font-['Poppins','Montserrat','Outfit',system-ui,sans-serif] text-white">
      {/* Top Floating Glassmorphic Navbar */}
      <LandingNavbar
        onNavigate={onNavigate}
        onScrollDown={scrollToAbout}
        onScrollToAbout={scrollToAbout}
        onScrollToSteps={scrollToSteps}
        onScrollToFaq={scrollToFaq}
        onScrollToTop={scrollToTop}
      />

      {/* Pinned Sticky Hero Section (Stays anchored while content scrolls over it) */}
      <motion.div
        style={heroStyle}
        className={`sticky top-0 hero-viewport-height w-full z-10 overflow-hidden origin-center ${
          isDesktop ? 'will-change-transform' : ''
        }`}
      >
        <HeroSection
          onScrollDown={scrollToAbout}
          onScrollToSteps={scrollToSteps}
          onStartReport={() => onNavigate('/auth')}
        />
      </motion.div>

      {/* Rising Parallax Content Container (Deep UNSRI blue sheet rising over Hero matching CTA button) */}
      <div
        id="content-container"
        className="relative z-20 w-full rounded-t-[32px] sm:rounded-t-[44px] md:rounded-t-[54px] bg-[#0c4278] text-white shadow-[0_-24px_50px_rgba(2,11,23,0.55)] border-t border-white/20 isolate"
      >
        {/* Subtle Sheet Handle Accent */}
        <div className="mx-auto flex justify-center pt-3.5 sm:pt-4" aria-hidden="true">
          <div className="h-1.5 w-12 sm:w-16 rounded-full bg-white/25" />
        </div>

        {/* Section 1: Tentang LaporUNSRI */}
        <AboutSection
          onLearnMore={scrollToSteps}
          onStartReport={() => onNavigate('/auth')}
        />

        {/* Section 2: Alur Pelaporan */}
        <ReportingFlowSection onStartReport={() => onNavigate('/auth')} />

        {/* Section 3: FAQ (Pertanyaan yang Sering Diajukan) */}
        <FaqSection />

        {/* Simple & Matching Footer */}
        <LandingFooter
          onNavigate={onNavigate}
          onScrollToTop={scrollToTop}
          onScrollToAbout={scrollToAbout}
          onScrollToSteps={scrollToSteps}
          onScrollToFaq={scrollToFaq}
        />
      </div>
    </div>
  )
}
