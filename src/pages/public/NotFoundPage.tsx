import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiArrowLeft, FiHome } from 'react-icons/fi'
import { Brand } from '../../components/common/Brand'
import kampusUnsriDesktop from '../../assets/home/kampus-unsri-transparan.png'
import awan1 from '../../assets/home/awan-1.png'
import awan2 from '../../assets/home/awan-2.png'

export function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#08315c] font-['Poppins','Montserrat',sans-serif] text-white select-none">
      {/* Background Campus Atmosphere: Clouds & University Silhouette */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
        {/* Soft Radial Ambient Lighting */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_30%,rgba(16,82,146,0.5)_0%,rgba(8,49,92,0)_80%)]" />

        {/* Ambient Floating Clouds */}
        <img
          src={awan1}
          alt=""
          className="absolute -left-20 top-12 h-44 sm:h-64 opacity-25 object-contain"
        />
        <img
          src={awan2}
          alt=""
          className="absolute -right-20 top-24 h-48 sm:h-72 opacity-20 object-contain"
        />

        {/* UNSRI Campus Silhouette along bottom horizon */}
        <div className="absolute inset-x-0 bottom-0 h-44 sm:h-64 lg:h-80 opacity-20 pointer-events-none">
          <img
            src={kampusUnsriDesktop}
            alt="Siluet Kampus UNSRI"
            className="h-full w-full object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#08315c] via-transparent to-transparent" />
        </div>
      </div>

      {/* Top Navbar */}
      <header className="relative z-10 w-full border-b border-white/10 bg-[#08315c]/85 backdrop-blur-md">
        <div className="mx-auto flex h-18 max-w-[1280px] items-center justify-between px-6 sm:px-10">
          <Brand onClick={() => navigate('/')} />
          <button
            type="button"
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-semibold text-white backdrop-blur transition cursor-pointer"
          >
            <FiArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Ke Beranda</span>
          </button>
        </div>
      </header>

      {/* Main 404 Stage */}
      <main className="relative z-10 mx-auto flex flex-1 flex-col items-center justify-center px-4 py-10 sm:py-16 text-center max-w-[800px]">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center"
        >
          {/* Giant Number 404 */}
          <div className="relative my-2 sm:my-3">
            <h1 className="select-none font-black text-[clamp(72px,13vw,120px)] leading-none tracking-tight text-white drop-shadow-[0_8px_30px_rgba(0,0,0,0.35)]">
              4<span className="text-[#ffbb00]">0</span>4
            </h1>
          </div>

          {/* Heading */}
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white max-w-lg leading-snug">
            Ups! Halaman yang kamu tuju{' '}
            <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#ffbb00]">
              tidak ditemukan
            </span>
          </h2>

          {/* Description */}
          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-sky-100/90 max-w-md">
            Tautan yang kamu tuju mungkin sudah dipindahkan, dihapus, atau alamat URL yang dimasukkan kurang tepat. Silakan kembali ke beranda atau akses dashboard pelaporan fasilitas.
          </p>

          {/* Action CTAs Matching Project Brand Style */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl bg-[#ffbb00] hover:bg-[#ffc824] px-6 py-3 text-xs sm:text-sm font-bold text-[#08315c] shadow-lg shadow-black/25 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <FiHome className="size-4" aria-hidden="true" />
              <span>Kembali ke Beranda</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/mahasiswa')}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-2xl border border-white/25 bg-white/10 hover:bg-white/20 px-6 py-3 text-xs sm:text-sm font-semibold text-white backdrop-blur-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <FiArrowLeft className="size-4" aria-hidden="true" />
              <span>Portal Dashboard</span>
            </button>
          </div>
        </motion.div>
      </main>

      {/* Footer Matching Project Theme */}
      <footer className="relative z-10 w-full border-t border-white/10 bg-[#062444]/70 py-4 text-center text-xs text-sky-100/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1280px] flex-col sm:flex-row items-center justify-between px-6 sm:px-10 gap-2">
          <span>© {new Date().getFullYear()} LaporUNSRI · Universitas Sriwijaya</span>
          <span className="text-[11px] text-[#ffbb00] font-medium">Sistem Aspirasi & Pelaporan Fasilitas Kampus</span>
        </div>
      </footer>
    </div>
  )
}

export default NotFoundPage
