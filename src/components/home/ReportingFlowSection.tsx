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
import { FiArrowRight, FiGitCommit } from 'react-icons/fi'

type ReportingFlowSectionProps = {
  onStartReport: () => void
}

const steps = [
  {
    number: '01',
    title: 'Unggah Kendala',
    tag: 'Cepat & Fleksibel',
    description:
      'Tuliskan permasalahan fasilitas di lingkungan kampus UNSRI secara detail. Lampirkan foto bukti fisik dan tentukan lokasi gedung, lantai, hingga ruangan secara spesifik.',
  },
  {
    number: '02',
    title: 'Verifikasi Petugas',
    tag: 'Maks. 24 Jam',
    description:
      'Tim penanggung jawab sarana & prasarana memvalidasi keluhan, mengukur urgensi bahaya, lalu mendisposisikan laporan ke unit teknisi terkait secara akurat.',
  },
  {
    number: '03',
    title: 'Penanganan Lapangan',
    tag: 'Aksi Nyata',
    description:
      'Teknisi lapangan diterjunkan langsung ke lokasi kerusakan untuk inspeksi fisik, perbaikan sarana, atau penggantian suku cadang yang mengalami kendala.',
  },
  {
    number: '04',
    title: 'Selesai & Transparan',
    tag: 'Terbuka Untuk Semua',
    description:
      'Hasil perbaikan diunggah lengkap dengan dokumentasi foto akhir. Seluruh sivitas akademika dapat memverifikasi dan melihat riwayat fasilitas kampus yang telah tuntas diperbaiki.',
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
      className="relative w-full"
      style={{ height: `${n * 100}vh` }}
      aria-label="Alur Pelaporan LaporUNSRI"
    >
      {/* panel sticky: diam di layar selama section di-scroll */}
      <div className="sticky top-0 flex h-screen h-svh items-center justify-center overflow-hidden">
        {/* Ambient Subtle Glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-[#105292]/15 blur-[120px]"
          aria-hidden="true"
        />

        <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col px-6">
          {/* Header Title Section */}
          <div className="mb-6 sm:mb-8 md:mb-12 text-center md:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-[#4899e8]/40 bg-[#0c3a6b]/50 px-3.5 py-1 text-xs font-semibold uppercase tracking-wider text-[#7fc3f8] backdrop-blur-md"
            >
              <FiGitCommit className="size-3.5" aria-hidden="true" />
              <span>Alur Pelaporan</span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="mt-3 font-['Poppins','Montserrat','Outfit',sans-serif] text-[clamp(22px,2.8vw,38px)] font-bold leading-[1.2] tracking-tight text-white"
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
              className="mt-2 max-w-xl text-xs sm:text-sm leading-relaxed text-[#a4c1db] mx-auto md:mx-0"
            >
              Empat tahapan terpadu dari pengunggahan keluhan hingga tindak lanjut dan penyelesaian di lapangan oleh tim sarana dan prasarana.
            </motion.p>
          </div>

          <div className="grid grid-cols-[70px_1fr] md:grid-cols-[280px_1fr] items-center gap-6 sm:gap-8 md:gap-16">
            {/* KIRI: diagram */}
            <div className="relative h-[42vh] min-h-[250px] max-h-[380px]">
            <div className="absolute left-3 top-0 h-full w-[2px] bg-white/10" />
            <motion.div
              style={{ scaleY: reduce ? 1 : progress, transformOrigin: 'top' }}
              className="absolute left-3 top-0 h-full w-[2px] bg-[#60b6ff] shadow-[0_0_10px_rgba(96,182,255,0.8)]"
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
                      ? 'border-[#60b6ff] bg-[#60b6ff] shadow-[0_0_12px_rgba(96,182,255,0.8)]'
                      : 'border-white/20 bg-[#020b17]'
                  }`}
                />
                <div className="hidden md:flex flex-col">
                  <span
                    className={`font-['Poppins','Montserrat','Outfit',sans-serif] text-sm font-semibold transition-colors duration-200 ${
                      i <= active ? 'text-white' : 'text-white/40'
                    }`}
                  >
                    {s.title}
                  </span>
                  <span
                    className={`text-[11px] font-medium transition-colors duration-200 ${
                      i <= active ? 'text-[#8fc3ee]' : 'text-white/20'
                    }`}
                  >
                    {s.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* KANAN: SATU deskripsi saja (TANPA KARTU, TANPA BOX/BORDER) */}
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
                <div className="text-xs font-bold tracking-widest text-[#60b6ff] uppercase mb-2">
                  Langkah {steps[active].number}
                </div>
                <h3 className="font-['Poppins','Montserrat','Outfit',sans-serif] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
                  {steps[active].title}
                </h3>
                <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg leading-relaxed text-white/70 max-w-xl">
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
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#60b6ff] to-[#3a93e8] px-6 py-3 text-xs sm:text-sm font-bold text-[#021427] shadow-xl shadow-[#105292]/40 transition duration-200 hover:brightness-110 active:translate-y-0 cursor-pointer"
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
