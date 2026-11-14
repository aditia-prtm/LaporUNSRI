import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import brandLogoSvg from '../../assets/common/lapor-unsri-putih.svg'

export type LoadingScreenProps = {
  /**
   * Status loading. Ketika berubah dari true ke false,
   * logo dan spinner akan hilang terlebih dahulu, lalu background biru memudar (fade-out).
   */
  isLoading?: boolean
  /** Pesan teks opsional (diabaikan agar tampilan murni minimalis) */
  message?: string
  /** Durasi fade out background dalam detik (default: 0.4 detik) */
  fadeDuration?: number
  /** Jika true, menutupi seluruh layar (fixed inset-0). Default: true */
  fullScreen?: boolean
  /** Callback saat seluruh animasi fade out selesai */
  onFadeOutComplete?: () => void
}

export function LoadingScreen({
  isLoading = true,
  fadeDuration = 0.4,
  fullScreen = true,
  onFadeOutComplete,
}: LoadingScreenProps) {
  const [contentVisible, setContentVisible] = useState(isLoading)
  const [bgVisible, setBgVisible] = useState(isLoading)

  useEffect(() => {
    if (!isLoading) {
      // 1. Sembunyikan konten logo & spinner
      const contentTimer = window.setTimeout(() => {
        setContentVisible(false)
      }, 0)

      // 2. Beri jeda halus sebelum background memudar
      const bgTimer = window.setTimeout(() => {
        setBgVisible(false)
      }, 180)

      return () => {
        window.clearTimeout(contentTimer)
        window.clearTimeout(bgTimer)
      }
    } else {
      const resetTimer = window.setTimeout(() => {
        setContentVisible(true)
        setBgVisible(true)
      }, 0)
      return () => window.clearTimeout(resetTimer)
    }
  }, [isLoading])

  return (
    <AnimatePresence onExitComplete={onFadeOutComplete}>
      {bgVisible && (
        <motion.div
          key="global-loading-bg"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            transition: {
              duration: fadeDuration,
              ease: [0.4, 0, 0.2, 1],
            },
          }}
          className={`flex flex-col items-center justify-center overflow-hidden bg-[linear-gradient(180deg,#031830_0%,#052345_30%,#08315c_65%,#0c4278_100%)] select-none ${
            fullScreen
              ? 'fixed inset-0 z-[99999] min-h-screen w-screen pointer-events-none'
              : 'relative min-h-[220px] w-full rounded-2xl py-8'
          }`}
          role="status"
          aria-live="polite"
        >
          {/* Ambient Lighting Biru senada dengan Landing Page & Auth */}
          <div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(96,182,255,0.18)_0%,rgba(3,24,48,0)_70%)]"
            aria-hidden="true"
          />

          <AnimatePresence>
            {contentVisible && (
              <motion.div
                key="loading-brand-wrapper"
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.9,
                  transition: { duration: 0.18, ease: [0.16, 1, 0.3, 1] },
                }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-10 flex flex-col items-center justify-center text-center px-6"
              >
                {/* Brand Logo laporUNSRI SVG yang lebih proporsional */}
                <img
                  src={brandLogoSvg}
                  alt="laporUNSRI"
                  className="h-6 sm:h-7.5 w-auto max-w-[160px] object-contain drop-shadow-[0_4px_16px_rgba(0,0,0,0.3)]"
                />

                {/* Spinner murni tanpa teks */}
                <div className="mt-5 sm:mt-6 relative flex items-center justify-center">
                  <div
                    className="absolute size-8 rounded-full bg-[#ffbb00]/15 blur-sm"
                    aria-hidden="true"
                  />
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.85,
                      ease: 'linear',
                    }}
                    className="size-6 sm:size-7 rounded-full border-2 border-white/15 border-t-[#ffbb00] border-r-[#ffbb00]/60"
                    aria-hidden="true"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <span className="sr-only">Memuat...</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default LoadingScreen
