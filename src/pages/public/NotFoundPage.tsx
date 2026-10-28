import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Brand } from '../../components/common/Brand'
import { FiArrowLeft, FiCompass, FiHome } from 'react-icons/fi'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#020b17] font-['Poppins','Montserrat','Outfit',system-ui,sans-serif] text-white">
      {/* Ambient Atmospheric Lighting */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_35%,rgba(55,155,245,0.22)_0%,rgba(2,11,23,0)_75%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -left-20 top-1/4 size-[400px] rounded-full bg-[#105292]/20 blur-[130px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 bottom-1/4 size-[400px] rounded-full bg-[#4899e8]/15 blur-[130px]"
        aria-hidden="true"
      />

      {/* Top Navbar */}
      <header className="relative z-10 w-full border-b border-white/10 bg-[#031830]/80 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-[1280px] items-center justify-between px-6 sm:px-10">
          <Brand onClick={() => navigate('/')} />
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-[#cce5fb] backdrop-blur transition hover:bg-white/15 hover:text-white"
          >
            <FiArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Beranda</span>
          </button>
        </div>
      </header>

      {/* Main 404 Stage */}
      <main className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center px-6 py-12 text-center max-w-[620px]">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Glowing 404 Badge */}
          <div className="relative inline-flex items-center gap-2 rounded-full border border-[#60b6ff]/30 bg-[#60b6ff]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#8fc3ee] backdrop-blur-md shadow-[0_0_20px_rgba(96,182,255,0.2)]">
            <FiCompass className="size-4 animate-spin text-[#60b6ff] [animation-duration:12s]" />
            <span>Error 404 · Halaman Hilang</span>
          </div>

          <div className="relative my-4">
            <h1 className="select-none font-['Poppins','Montserrat','Outfit',sans-serif] text-[clamp(80px,14vw,140px)] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white via-[#8cb6dc] to-[#105292] drop-shadow-[0_10px_35px_rgba(16,82,146,0.5)]">
              404
            </h1>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white">
            Ups! Halaman yang Anda cari{' '}
            <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-semibold text-[#ffbb00]">
              tidak ditemukan
            </span>
          </h2>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#a4c1db] max-w-[480px]">
            Tautan yang Anda tuju mungkin sudah kedaluwarsa, dipindahkan, atau alamat URL yang Anda masukkan kurang tepat. Silakan kembali ke beranda atau masuk ke akun Anda.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#60b6ff] via-[#48a6ff] to-[#2b8ced] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#021427] shadow-[0_4px_20px_rgba(58,147,232,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(58,147,232,0.6)] hover:brightness-105 active:translate-y-0 cursor-pointer"
            >
              <FiHome className="size-4" aria-hidden="true" />
              <span>Kembali ke Beranda</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/auth')}
              className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-xs sm:text-sm font-semibold text-[#cce5fb] backdrop-blur-md transition-all duration-200 hover:bg-white/15 hover:border-white/35 hover:text-white hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Portal Masuk Akun</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-[#031326]/60 py-4 text-center text-xs text-[#8cb6dc]">
        <div className="mx-auto flex max-w-[1280px] flex-col sm:flex-row items-center justify-between px-6 sm:px-10 gap-2">
          <span>© {new Date().getFullYear()} LaporUNSRI · Universitas Sriwijaya</span>
          <span className="text-[11px] text-[#60b6ff]">Sistem Aspirasi & Pelaporan Fasilitas Kampus</span>
        </div>
      </footer>
    </div>
  )
}
export default NotFoundPage
