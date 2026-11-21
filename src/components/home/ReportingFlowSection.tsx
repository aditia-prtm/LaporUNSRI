import { useRef, useState } from 'react'
import {
  motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from 'framer-motion'
import { FiArrowRight } from 'react-icons/fi'

type ReportingFlowSectionProps = {
  onStartReport: () => void
}

const steps = [
  {
    number: '01',
    title: 'Unggah Kendala',
    tag: 'Terpetakan Jelas',
    description:
      'Tuliskan permasalahan fasilitas di lingkungan kampus UNSRI secara detail. Lampirkan foto bukti fisik dan sematkan titik lokasi presisi menggunakan peta interaktif kampus.',
  },
  {
    number: '02',
    title: 'Verifikasi Petugas',
    tag: 'Tinjauan Awal',
    description:
      'Tim sarana dan prasarana memvalidasi keabsahan keluhan, mengevaluasi urgensi kendala, dan mengubah status laporan menjadi sedang diproses oleh teknisi.',
  },
  {
    number: '03',
    title: 'Penanganan Lapangan',
    tag: 'Aksi Nyata',
    description:
      'Teknisi lapangan terjun langsung untuk memperbaiki kerusakan dan mengunggah dokumentasi foto bukti hasil pengerjaan nyata di lokasi.',
  },
  {
    number: '04',
    title: 'Konfirmasi & Tuntas',
    tag: 'Verifikasi Pelapor',
    description:
      'Laporan masuk ke tahap Menunggu Konfirmasi. Anda sebagai mahasiswa pelapor memverifikasi hasil perbaikan di lokasi dan memberikan konfirmasi akhir agar laporan berstatus tuntas selesai.',
  },
]

export function ReportingFlowSection({ onStartReport }: ReportingFlowSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const reduce = useReducedMotion() ?? false
  const n = steps.length

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // 0 -> 0.85 scroll = 0 -> 1 progress. Sisa 15% jadi jeda supaya step terakhir sempat terbaca.
  const raw = useTransform(scrollYProgress, [0, 0.85], [0, 1], { clamp: true })
  const progress = useSpring(raw, { stiffness: 120, damping: 30, mass: 0.2 })

  // step aktif = node terakhir yang sudah disentuh garis
  useMotionValueEvent(raw, 'change', (v) => {
    setActive(Math.min(n - 1, Math.floor(v * (n - 1) + 0.001)))
  })

  return (
    // tinggi total section = n x 100vh -> ini yang memberi "ruang scroll"
    <section
      ref={sectionRef}
      id="steps-section"
      className="relative w-full bg-[#0a3a6b] text-white border-t border-white/15"
      style={{ height: `${n * 100}vh` }}
      aria-label="Alur Pelaporan LaporUNSRI"
    >
      {/* panel sticky: diam di layar selama section di-scroll */}
      <div className="sticky top-0 flex h-screen h-svh items-center justify-center overflow-hidden">
        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-6">
          {/* Header Title Section */}
          <div className="mb-6 sm:mb-8 md:mb-12 text-center md:text-left">
            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-3 font-['Poppins','Montserrat',sans-serif] text-[clamp(26px,3vw,42px)] font-black leading-[1.2] tracking-tight text-white"
            >
              Bagaimana laporan Anda{' '}
              <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#ffbb00] tracking-normal">
                diproses?
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.16 }}
              className="mt-2.5 max-w-xl text-sm sm:text-base leading-relaxed text-sky-100/90 font-normal mx-auto md:mx-0"
            >
              Empat tahapan terpadu dari pengunggahan keluhan hingga tindak lanjut dan penyelesaian di lapangan oleh tim sarana dan prasarana.
            </motion.p>
          </div>

          <div className="grid grid-cols-[70px_1fr] md:grid-cols-[280px_1fr] items-center gap-6 sm:gap-8 md:gap-16">
            {/* KIRI: diagram */}
            <div className="relative h-[42vh] min-h-[250px] max-h-[380px]">
              <div className="absolute left-3 top-0 h-full w-[3px] bg-white/20" />
              <motion.div
                style={{ scaleY: reduce ? 1 : progress, transformOrigin: 'top' }}
                className="absolute left-3 top-0 h-full w-[3px] bg-[#ffbb00]"
              />
              {steps.map((s, i) => (
                <div
                  key={s.number}
                  className="absolute flex items-center gap-3.5"
                  style={{ top: `${(i / (n - 1)) * 100}%`, transform: 'translateY(-50%)' }}
                >
                  <motion.div
                    animate={{ scale: active === i ? 1.3 : 1 }}
                    transition={{ duration: 0.2 }}
                    className={`size-6 rounded-full border-2 transition-colors duration-200 ${
                      i <= active
                        ? 'border-[#ffbb00] bg-[#ffbb00] shadow-md shadow-[#ffbb00]/40'
                        : 'border-white/40 bg-[#08315c]'
                    }`}
                  />
                  <div className="hidden md:flex flex-col">
                    <span
                      className={`font-['Poppins','Montserrat',sans-serif] text-sm font-extrabold transition-colors duration-200 ${
                        i <= active ? 'text-white' : 'text-white/45'
                      }`}
                    >
                      {s.title}
                    </span>
                    <span
                      className={`text-[11px] font-bold transition-colors duration-200 ${
                        i <= active ? 'text-[#ffbb00]' : 'text-white/35'
                      }`}
                    >
                      {s.tag}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* KANAN: SATU deskripsi saja (Clean typography, kontras tinggi) */}
            <div className="relative min-h-[220px] md:min-h-[260px] flex items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={reduce ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={reduce ? { opacity: 0 } : { opacity: 0, y: -16 }}
                  transition={{ duration: 0.25 }}
                  className="w-full"
                >
                  <div className="text-xs font-black tracking-widest text-[#ffbb00] uppercase mb-2">
                    Langkah {steps[active].number}
                  </div>
                  <h3 className="font-['Poppins','Montserrat',sans-serif] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
                    {steps[active].title}
                  </h3>
                  <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl leading-relaxed text-sky-100/90 max-w-xl font-normal">
                    {steps[active].description}
                  </p>

                  {/* CTA hanya muncul di langkah terakhir */}
                  {active === n - 1 && onStartReport && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 }}
                      className="mt-8"
                    >
                      <button
                        type="button"
                        onClick={onStartReport}
                        className="inline-flex items-center gap-2 rounded-2xl bg-white hover:bg-sky-50 px-7 py-3.5 text-xs sm:text-sm font-bold text-[#0c4278] shadow-lg shadow-black/25 transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98] cursor-pointer"
                      >
                        <span>Mulai Melapor Sekarang</span>
                        <FiArrowRight className="size-4" aria-hidden="true" />
                      </button>
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
