import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useLenis } from 'lenis/react'
import { FiAlertTriangle, FiLogOut, FiX } from 'react-icons/fi'

type LogoutModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  loading?: boolean
  userName?: string
}

export function LogoutModal({
  isOpen,
  onClose,
  onConfirm,
  loading = false,
  userName,
}: LogoutModalProps) {
  const lenis = useLenis()

  // Kunci scroll halaman (baik Lenis smooth scroll maupun native body overflow)
  useEffect(() => {
    if (!isOpen) return

    if (lenis) {
      lenis.stop()
    }

    const originalOverflow = document.body.style.overflow
    const originalPaddingRight = document.body.style.paddingRight

    // Kompensasi lebar scrollbar agar halaman tidak bergeser (layout shift)
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`
    }
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = originalOverflow
      document.body.style.paddingRight = originalPaddingRight
      if (lenis) {
        lenis.start()
      }
    }
  }, [isOpen, lenis])

  // Tutup modal jika tombol Escape ditekan
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !loading) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, loading, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 overflow-y-auto"
          role="dialog"
          aria-modal="true"
          aria-labelledby="logout-modal-title"
        >
          {/* Backdrop gelap dengan efek blur halus */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              if (!loading) onClose()
            }}
            className="fixed inset-0 bg-[#020b17]/65 backdrop-blur-xs"
            aria-hidden="true"
          />

          {/* Kartu Dialog Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-[420px] rounded-3xl bg-white p-6 sm:p-7 shadow-2xl border border-slate-100 text-slate-800"
          >
            {/* Tombol Tutup X di pojok kanan atas */}
            <button
              type="button"
              disabled={loading}
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer disabled:opacity-40"
              aria-label="Tutup dialog"
            >
              <FiX className="size-4" aria-hidden="true" />
            </button>

            {/* Judul & Penjelasan */}
            <div>
              <h3
                id="logout-modal-title"
                className="text-lg sm:text-xl font-extrabold text-[#08315c] tracking-tight leading-snug"
              >
                Konfirmasi Keluar Akun
              </h3>

              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                {userName ? (
                  <>
                    Halo <strong className="text-slate-800">{userName}</strong>, apakah Anda yakin ingin keluar dari akun LaporUNSRI pada perangkat ini?
                  </>
                ) : (
                  'Apakah Anda yakin ingin keluar dari sesi akun LaporUNSRI pada perangkat ini?'
                )}
              </p>

              <div className="mt-3 flex items-start gap-2 rounded-xl bg-amber-50/70 border border-amber-200/60 p-2.5 text-[11px] text-amber-800">
                <FiAlertTriangle className="size-3.5 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
                <span>
                  Anda harus memasukkan email dan kata sandi kembali untuk mengakses layanan pelaporan fasilitas.
                </span>
              </div>
            </div>

            {/* Aksi Tombol */}
            <div className="mt-6 flex flex-col-reverse sm:flex-row items-center gap-2.5 sm:gap-3">
              <button
                type="button"
                disabled={loading}
                onClick={onClose}
                className="w-full sm:flex-1 rounded-xl sm:rounded-2xl border border-slate-200 bg-white px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 transition cursor-pointer disabled:opacity-50"
              >
                Batalkan
              </button>

              <button
                type="button"
                disabled={loading}
                onClick={onConfirm}
                className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 rounded-xl sm:rounded-2xl bg-rose-600 hover:bg-rose-700 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-md shadow-rose-600/20 transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer"
              >
                <FiLogOut className="size-3.5" aria-hidden="true" />
                <span>{loading ? 'Keluar...' : 'Ya, Keluar'}</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default LogoutModal
