import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export type LoadingScreenProps = {
  /**
   * Status loading. Ketika berubah dari true ke false,
   * spinner kuning akan hilang terlebih dahulu, lalu background biru memudar (fade-out).
   */
  isLoading?: boolean
  /** Pesan teks opsional di bawah spinner */
  message?: string
  /** Durasi fade out background dalam detik (default: 0.5 detik) */
  fadeDuration?: number
  /** Jika true, menutupi seluruh layar (fixed inset-0). Default: true */
  fullScreen?: boolean
  /** Callback saat seluruh animasi fade out selesai */
  onFadeOutComplete?: () => void
}

export function LoadingScreen({
  isLoading = true,
  fadeDuration = 0.5,
  message,
  fullScreen = true,
  onFadeOutComplete,
}: LoadingScreenProps) {
  const [spinnerVisible, setSpinnerVisible] = useState(isLoading)
  const [bgVisible, setBgVisible] = useState(isLoading)

  useEffect(() => {
    if (!isLoading) {
      // 1. Hilangkan animasi spinner terlebih dahulu
      setSpinnerVisible(false)

      // 2. Beri jeda agar animasi spinner selesai menghilang, lalu fade-out background biru
      const timer = window.setTimeout(() => {
        setBgVisible(false)
      }, 260)

      return () => window.clearTimeout(timer)
    } else {
      setSpinnerVisible(true)
      setBgVisible(true)
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
          className={`flex flex-col items-center justify-center bg-[#020b17] ${
            fullScreen
              ? 'fixed inset-0 z-[99999] min-h-screen w-screen pointer-events-none'
              : 'h-full min-h-[240px] w-full'
          }`}
          role="status"
          aria-live="polite"
        >
          {/* Ambient Lighting Biru senada dengan Landing Page */}
          <div
            className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_50%_50%,rgba(16,82,146,0.28)_0%,rgba(2,11,23,0)_72%)]"
            aria-hidden="true"
          />

          <AnimatePresence>
            {spinnerVisible && (
              <motion.div
                key="loading-spinner-wrapper"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{
                  opacity: 0,
                  scale: 0.35,
                  transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
                }}
                className="relative z-10 flex flex-col items-center justify-center"
              >
                {/* Spinner Warna Kuning (#ffbb00) Senada dengan Aksen Landing Page */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 0.85,
                    ease: 'linear',
                  }}
                  className="size-9 rounded-full border-[2.5px] border-white/10 border-t-[#ffbb00] shadow-[0_0_16px_rgba(255,187,0,0.35)]"
                />

                {message && (
                  <motion.p
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4, transition: { duration: 0.18 } }}
                    className="mt-4 text-xs font-medium tracking-wide text-[#a4c1db]"
                  >
                    {message}
                  </motion.p>
                )}
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
