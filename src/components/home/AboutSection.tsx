import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { FiArrowRight, FiCheck } from 'react-icons/fi'
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
      className="relative px-3.5 min-[380px]:px-5 sm:px-8 md:px-12 lg:px-16 pt-7 min-[380px]:pt-9 md:pt-14 pb-14 md:pb-24 text-slate-950"
      aria-label="Tentang LaporUNSRI"
    >
      <div className="mx-auto max-w-[1180px]">
        {/* Selalu Side-by-Side di semua ukuran layar (Mobile & Desktop: Maskot di Kiri, Satu Wadah di Kanan) */}
        <div className="relative flex flex-row items-center gap-3 min-[380px]:gap-4 sm:gap-7 md:gap-10 lg:gap-14">
          {/* Sisi Kiri: Maskot tetap di kiri dan menyembul ke atas batas kontainer */}
          <div className="relative shrink-0 flex justify-center w-[110px] min-[380px]:w-[125px] min-[440px]:w-[145px] sm:w-[190px] md:w-[240px] lg:w-[320px] xl:w-[360px]">
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
              className={`relative -mt-12 min-[380px]:-mt-14 sm:-mt-20 md:-mt-28 lg:-mt-40 xl:-mt-44 z-30 flex flex-col items-center justify-center w-full ${
                isContainerInView ? 'pointer-events-auto' : 'pointer-events-none'
              }`}
            >
              {/* Mascot image */}
              <motion.img
                src={mascotImg}
                alt="Maskot LaporUNSRI Mamang Sarpras"
                className="relative z-10 w-full max-w-full h-auto select-none object-contain drop-shadow-[0_16px_30px_rgba(2,11,23,0.35)] sm:drop-shadow-[0_24px_44px_rgba(2,11,23,0.45)] transition-transform duration-300 hover:scale-[1.02]"
                animate={isContainerInView ? { y: [0, -7, 0] } : { y: 0 }}
                transition={{
                  repeat: isContainerInView ? Infinity : 0,
                  duration: 4.8,
                  delay: isContainerInView ? 0.5 : 0,
                  ease: 'easeInOut',
                }}
              />

              {/* Mascot Nameplate */}
              <div className="mt-1.5 sm:mt-2 text-center flex flex-col items-center">
                <span className="font-['Poppins','Montserrat',sans-serif] text-[11px] min-[380px]:text-xs sm:text-sm md:text-base font-extrabold text-slate-950 tracking-tight leading-tight">
                  Mamang Sarpras
                </span>
                <span className="mt-0.5 text-[8.5px] min-[380px]:text-[9.5px] sm:text-xs text-slate-700 font-semibold leading-tight text-center">
                  Kawal Sarana Prasarana
                </span>
              </div>
            </motion.div>
          </div>

          {/* Sisi Kanan: Kontainer Info "Satu Wadah" + CTAs (Tetap di kanan mendampingi maskot) */}
          <div ref={satuWadahRef} className="flex-1 min-w-0 flex flex-col justify-center text-left">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-['Poppins','Montserrat',sans-serif] text-[15px] min-[380px]:text-[17px] min-[440px]:text-[19px] sm:text-2xl md:text-[30px] lg:text-[38px] font-black leading-[1.22] tracking-tight text-slate-950">
                Satu wadah terpadu untuk fasilitas kampus yang{' '}
                <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#b45309] tracking-normal">
                  nyaman & responsif
                </span>
              </h2>

              <p className="mt-1.5 min-[380px]:mt-2 sm:mt-3 text-[10.5px] min-[380px]:text-[11.5px] sm:text-[13.5px] md:text-[14.5px] leading-relaxed text-slate-700 font-normal max-w-[620px]">
                Aduan fasilitas rusak di Kampus Indralaya dan Palembang tidak lagi terabaikan di obrolan grup. Melalui LaporUNSRI, setiap keluhan terstruktur, dipantau langsung oleh unit sarpras, dan proses pengerjaannya transparan bagi seluruh mahasiswa.
              </p>
            </motion.div>

            {/* CTAs Berdampingan */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="mt-3 min-[380px]:mt-3.5 sm:mt-5 flex flex-wrap items-center justify-start gap-2 min-[380px]:gap-2.5 sm:gap-3.5"
            >
              {onStartReport && (
                <button
                  type="button"
                  onClick={onStartReport}
                  className="inline-flex items-center gap-1.5 sm:gap-2 rounded-xl sm:rounded-2xl bg-[#0c4278] hover:bg-[#08315c] px-3.5 py-1.5 min-[380px]:px-4 min-[380px]:py-2 sm:px-6 sm:py-3 text-[11px] min-[380px]:text-xs sm:text-sm font-bold text-white shadow-md shadow-[#0c4278]/30 transition active:scale-[0.98] cursor-pointer"
                >
                  <span>Buat Laporan</span>
                  <FiArrowRight className="size-3.5 sm:size-4" aria-hidden="true" />
                </button>
              )}
              {onLearnMore && (
                <button
                  type="button"
                  onClick={onLearnMore}
                  className="inline-flex items-center gap-1 sm:gap-1.5 rounded-xl sm:rounded-2xl border-2 border-slate-300 bg-white hover:bg-slate-100 px-3 py-1.5 min-[380px]:px-3.5 min-[380px]:py-2 sm:px-5 sm:py-3 text-[11px] min-[380px]:text-xs sm:text-sm font-bold text-slate-900 shadow-xs transition active:scale-[0.98] cursor-pointer"
                >
                  <span>Pelajari Alur</span>
                </button>
              )}
            </motion.div>

            {/* Poin Ringkas di Bawah Tombol */}
            <div className="mt-3.5 sm:mt-5 pt-2.5 sm:pt-4 border-t-2 border-slate-200 flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-start gap-x-5 gap-y-1 text-[9.5px] min-[380px]:text-[10.5px] sm:text-xs text-slate-800 font-semibold">
              <span className="flex items-center gap-1.5">
                <FiCheck className="size-3.5 text-emerald-700 stroke-[2.5] shrink-0" />
                Penandaan lokasi spesifik ruang & gedung
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheck className="size-3.5 text-emerald-700 stroke-[2.5] shrink-0" />
                Prioritas berbasis suara kolektif
              </span>
              <span className="flex items-center gap-1.5">
                <FiCheck className="size-3.5 text-emerald-700 stroke-[2.5] shrink-0" />
                Wajib verifikasi foto penyelesaian
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
