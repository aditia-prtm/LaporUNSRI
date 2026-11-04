import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import {
  FiShield,
  FiUsers,
  FiMapPin,
  FiCheckCircle,
  FiArrowRight,
  FiThumbsUp,
  FiTool,
  FiCamera,
  FiCheck,
} from 'react-icons/fi'
import mascotImg from '../../assets/home/mascot.png'

type AboutSectionProps = {
  onLearnMore?: () => void
  onStartReport?: () => void
}

export function AboutSection({ onLearnMore, onStartReport }: AboutSectionProps) {
  const satuWadahRef = useRef<HTMLDivElement>(null)
  const isContainerInView = useInView(satuWadahRef, {
    amount: 0.15,
    margin: '0px 0px -20px 0px',
  })

  return (
    <section
      id="about-section"
      className="relative px-4 min-[380px]:px-5 sm:px-8 md:px-10 lg:px-16 pt-8 min-[380px]:pt-10 md:pt-14 pb-14 md:pb-20"
      aria-label="Tentang LaporUNSRI"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Top Section Layout: Mascot on Left, "Satu Wadah" Info Container on Right */}
        <div className="relative flex items-center gap-3.5 min-[380px]:gap-4 sm:gap-6 md:gap-8 lg:gap-12">
          {/* Left Column: Mascot protruding above the rectangle border */}
          <div className="relative shrink-0 flex justify-center w-[120px] min-[380px]:w-[135px] min-[440px]:w-[155px] sm:w-[190px] md:w-[220px] lg:w-[340px] xl:w-[380px]">
            <motion.div
              initial={{ opacity: 0, y: 70, scale: 0.92 }}
              animate={
                isContainerInView
                  ? { opacity: 1, y: 0, scale: 1 }
                  : { opacity: 0, y: 70, scale: 0.92 }
              }
              transition={{
                duration: isContainerInView ? 0.65 : 0.35,
                ease: isContainerInView ? [0.16, 1, 0.3, 1] : 'easeOut',
              }}
              className={`relative -mt-14 min-[380px]:-mt-16 sm:-mt-20 md:-mt-28 lg:-mt-44 xl:-mt-48 z-30 flex flex-col items-center justify-center w-full ${
                isContainerInView ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            >
              {/* Mascot image */}
              <motion.img
                src={mascotImg}
                alt="Maskot LaporUNSRI Mamang Sarpras"
                className="relative z-10 w-full max-w-full h-auto select-none object-contain drop-shadow-[0_16px_30px_rgba(2,11,23,0.85)] sm:drop-shadow-[0_24px_44px_rgba(2,11,23,0.9)] transition-transform duration-300 hover:scale-[1.02]"
                animate={isContainerInView ? { y: [0, -7, 0] } : { y: 0 }}
                transition={{
                  repeat: isContainerInView ? Infinity : 0,
                  duration: 4.8,
                  delay: isContainerInView ? 0.5 : 0,
                  ease: 'easeInOut',
                }}
              />

              {/* Mascot Nameplate */}
              <div className="mt-2 text-center flex flex-col items-center">
                <span className="font-['Poppins','Montserrat',sans-serif] text-xs min-[380px]:text-[13px] sm:text-sm md:text-base font-bold text-white tracking-tight leading-tight">
                  Mamang Sarpras
                </span>
                <span className="mt-0.5 text-[9px] min-[380px]:text-[10px] sm:text-xs text-[#8cb6dc] leading-tight text-center">
                  Kawal Sarana Prasarana Kampus
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column: "Satu Wadah" Info Container */}
          <div ref={satuWadahRef} className="flex-1 min-w-0 flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-['Poppins','Montserrat','Outfit',sans-serif] text-[16px] min-[380px]:text-[18px] min-[440px]:text-[20px] sm:text-2xl md:text-[26px] lg:text-[clamp(28px,2.8vw,38px)] font-bold leading-[1.22] tracking-tight text-white">
                Satu wadah terpadu untuk fasilitas kampus yang{' '}
                <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#ffbb00] tracking-normal">
                  nyaman & responsif
                </span>
              </h2>

              <p className="mt-2 min-[380px]:mt-2.5 md:mt-3 text-[11.5px] min-[380px]:text-xs md:text-[13px] lg:text-[14.5px] leading-[1.65] text-[#9fc1df] max-w-[620px]">
                Aduan fasilitas rusak di Kampus Indralaya dan Palembang tidak lagi terabaikan di obrolan grup. Melalui LaporUNSRI, setiap keluhan terstruktur, dipantau langsung oleh unit sarpras, dan proses pengerjaannya transparan bagi seluruh mahasiswa.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-4 sm:mt-5 md:mt-6 flex flex-wrap items-center gap-2.5 sm:gap-3.5"
            >
              {onStartReport && (
                <button
                  type="button"
                  onClick={onStartReport}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#50a8fc] to-[#257fda] px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-bold text-[#021326] shadow-md shadow-[#0c3966]/40 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
                >
                  Buat Laporan
                  <FiArrowRight className="size-3.5" aria-hidden="true" />
                </button>
              )}
              {onLearnMore && (
                <button
                  type="button"
                  onClick={onLearnMore}
                  className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-semibold text-[#d0e5f9] transition duration-200 hover:bg-white/10 hover:text-white"
                >
                  Pelajari Alur
                </button>
              )}
            </motion.div>
          </div>
        </div>

        {/* Campus Metrics Bar */}
        <div className="mt-10 sm:mt-12 rounded-2xl border border-white/10 bg-[#061b33]/60 p-4 sm:p-5 backdrop-blur-sm grid grid-cols-1 sm:grid-cols-3 gap-4 divide-y sm:divide-y-0 sm:divide-x divide-white/10 text-center sm:text-left">
          <div className="sm:px-4 flex flex-col justify-center">
            <span className="text-xl sm:text-2xl font-black text-white font-['Poppins',sans-serif]">
              10 Fakultas
            </span>
            <span className="text-xs text-[#8ab1d4] mt-0.5">
              Cakupan Kampus Indralaya & Bukit Besar Palembang
            </span>
          </div>
          <div className="pt-3 sm:pt-0 sm:px-4 flex flex-col justify-center">
            <span className="text-xl sm:text-2xl font-black text-[#50a8fc] font-['Poppins',sans-serif]">
              100% Terbuka
            </span>
            <span className="text-xs text-[#8ab1d4] mt-0.5">
              Progres perbaikan dan dokumentasi dapat diawasi publik
            </span>
          </div>
          <div className="pt-3 sm:pt-0 sm:px-4 flex flex-col justify-center">
            <span className="text-xl sm:text-2xl font-black text-[#ffbb00] font-['Poppins',sans-serif]">
              Satu Suara
            </span>
            <span className="text-xs text-[#8ab1d4] mt-0.5">
              Dukungan kolektif otomatis menaikkan prioritas penanganan
            </span>
          </div>
        </div>

        {/* Distinctive Asymmetric Feature Cards */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Card 1: Presisi Lokasi & Kategori */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#061b33]/40 p-6 backdrop-blur-md transition-all duration-200 hover:border-[#3a93e8]/40 hover:bg-[#082240]/60"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-[#0a2e54] text-[#60b6ff]">
                  <FiMapPin className="size-5" aria-hidden="true" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-[#8ab1d4]">
                  Presisi
                </span>
              </div>

              <h3 className="mt-4 font-['Poppins',sans-serif] text-base sm:text-lg font-bold text-white">
                Penandaan Lokasi Rinci
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94b8d7]">
                Aduan dilengkapi fakultas, gedung, hingga nomor ruang kelas. Tim teknisi dapat langsung menuju titik kerusakan tanpa tersesat di area kampus.
              </p>

              {/* Concrete UI Snippet Preview */}
              <div className="mt-4 rounded-xl border border-white/10 bg-[#020e1c] p-3 text-[11px]">
                <div className="flex items-center justify-between text-[#8ab1d4] text-[10px]">
                  <span>Tag Lokasi Fasilitas</span>
                  <span className="font-mono text-[#ffbb00]">FAS-204</span>
                </div>
                <div className="mt-1 font-semibold text-white">
                  Fasilkom • Gedung B • Ruang 204
                </div>
                <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-[#50a8fc]">
                  <FiTool className="size-3" />
                  <span>Kerusakan: AC Mati & Proyektor Bergaris</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-1.5 border-t border-white/10 pt-3 text-[11px] font-semibold text-[#60b6ff]">
              <FiCheckCircle className="size-3.5" aria-hidden="true" />
              <span>Mempercepat Investigasi Lapangan</span>
            </div>
          </motion.article>

          {/* Card 2: Suara Bersama / Upvote */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#061b33]/40 p-6 backdrop-blur-md transition-all duration-200 hover:border-[#3a93e8]/40 hover:bg-[#082240]/60"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-[#0a2e54] text-[#ffbb00]">
                  <FiUsers className="size-5" aria-hidden="true" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-[#ffbb00]">
                  Kolektif
                </span>
              </div>

              <h3 className="mt-4 font-['Poppins',sans-serif] text-base sm:text-lg font-bold text-white">
                Prioritas Suara Mahasiswa
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94b8d7]">
                Fitur dukungan satu klik memungkinkan mahasiswa yang terdampak masalah serupa menyatukan suara, mendorong aduan ke urutan prioritas utama petugas.
              </p>

              {/* Concrete UI Snippet Preview */}
              <div className="mt-4 rounded-xl border border-white/10 bg-[#020e1c] p-3 text-[11px]">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] text-[#8ab1d4]">Indikator Kepentingan</span>
                  <span className="rounded-md bg-[#ffbb00]/15 px-2 py-0.5 text-[9px] font-bold text-[#ffbb00]">
                    Prioritas Tinggi
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between rounded-lg border border-[#3a93e8]/30 bg-[#0a2542] px-3 py-1.5">
                  <span className="flex items-center gap-1.5 text-white font-medium text-[11px]">
                    <FiThumbsUp className="size-3 text-[#50a8fc]" />
                    Saya Mengalami Ini
                  </span>
                  <span className="font-bold text-[#50a8fc] text-[11px]">+42 Dukungan</span>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-1.5 border-t border-white/10 pt-3 text-[11px] font-semibold text-[#ffbb00]">
              <FiCheckCircle className="size-3.5" aria-hidden="true" />
              <span>Cegah Duplikasi Aduan Berulang</span>
            </div>
          </motion.article>

          {/* Card 3: Akuntabilitas & Bukti Foto */}
          <motion.article
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#061b33]/40 p-6 backdrop-blur-md transition-all duration-200 hover:border-[#3a93e8]/40 hover:bg-[#082240]/60"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="inline-flex size-10 items-center justify-center rounded-xl border border-white/10 bg-[#0a2e54] text-[#50e3a4]">
                  <FiShield className="size-5" aria-hidden="true" />
                </div>
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-[#50e3a4]">
                  Akuntabel
                </span>
              </div>

              <h3 className="mt-4 font-['Poppins',sans-serif] text-base sm:text-lg font-bold text-white">
                Validasi Dokumentasi Nyata
              </h3>
              <p className="mt-2 text-xs leading-relaxed text-[#94b8d7]">
                Petugas sarpras diwajibkan mengunggah dokumentasi foto bukti hasil perbaikan sebelum status laporan dapat ditutup sebagai selesai.
              </p>

              {/* Concrete UI Snippet Preview */}
              <div className="mt-4 rounded-xl border border-white/10 bg-[#020e1c] p-3 text-[11px]">
                <div className="flex items-center justify-between text-[10px] text-[#8ab1d4]">
                  <span>Verifikasi Petugas</span>
                  <span className="text-[#50e3a4] flex items-center gap-1 font-medium">
                    <FiCheck className="size-3" /> Tervalidasi
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-2">
                  <div className="size-7 rounded bg-[#0a2e54] flex items-center justify-center text-[#50a8fc] shrink-0">
                    <FiCamera className="size-3.5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] font-medium text-white truncate m-0">
                      Foto_Perbaikan_Selesai.jpg
                    </p>
                    <p className="text-[9px] text-[#8ab1d4] m-0">
                      Diunggah oleh Teknisi Sarpras
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-1.5 border-t border-white/10 pt-3 text-[11px] font-semibold text-[#50e3a4]">
              <FiCheckCircle className="size-3.5" aria-hidden="true" />
              <span>Transparansi Hasil yang Terpercaya</span>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  )
}
