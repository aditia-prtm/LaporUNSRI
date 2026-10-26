import { motion } from 'framer-motion'
import { FiEdit3, FiCheckSquare, FiTool, FiEye, FiArrowRight } from 'react-icons/fi'

type ReportingFlowSectionProps = {
  onStartReport: () => void
}

const steps = [
  {
    number: '01',
    icon: FiEdit3,
    title: 'Unggah Kendala',
    tag: 'Cepat & Fleksibel',
    description:
      'Tuliskan permasalahan fasilitas di lingkungan kampus UNSRI. Lampirkan foto bukti fisik dan tentukan lokasi gedung secara spesifik.',
    perk: 'Dukungan Lapor Anonim',
  },
  {
    number: '02',
    icon: FiCheckSquare,
    title: 'Verifikasi Petugas',
    tag: 'Maks. 24 Jam',
    description:
      'Tim penanggung jawab sarana & prasarana memvalidasi laporan, menentukan tingkat urgensi, lalu mendisposisikan ke unit terkait.',
    perk: 'Disposisi Akurat',
  },
  {
    number: '03',
    icon: FiTool,
    title: 'Penanganan Lapangan',
    tag: 'Aksi Nyata',
    description:
      'Teknisi lapangan diterjunkan langsung untuk inspeksi fisik, perbaikan sarana, atau penggantian komponen yang mengalami kerusakan.',
    perk: 'Pengerjaan Terpantau',
  },
  {
    number: '04',
    icon: FiEye,
    title: 'Selesai & Transparan',
    tag: 'Terbuka Untuk Semua',
    description:
      'Hasil perbaikan diunggah beserta dokumentasi foto akhir. Anda dan sivitas akademika dapat memverifikasi bahwa fasilitas siap digunakan.',
    perk: 'Notifikasi & Bukti Foto',
  },
]

export function ReportingFlowSection({ onStartReport }: ReportingFlowSectionProps) {
  return (
    <section id="steps-section" className="relative px-6 py-20 sm:px-10 lg:px-16" aria-label="Alur Pelaporan LaporUNSRI">
      <div className="mx-auto max-w-[1280px]">
        {/* Section Header */}
        <div className="mx-auto max-w-[760px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#4899e8]/30 bg-[#0a3560]/40 px-4 py-1.5 text-[11.5px] font-bold uppercase tracking-[0.16em] text-[#7fc3f8] backdrop-blur-md"
          >
            <span className="size-1.5 rounded-full bg-[#60b6ff] animate-pulse" aria-hidden="true" />
            Alur Terbuka & Akuntabel
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="mt-4 font-['Outfit','Montserrat','Poppins',sans-serif] text-[clamp(26px,3.2vw,42px)] font-bold leading-[1.2] tracking-tight text-white"
          >
            Bagaimana aspirasi Anda{' '}
            <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#ffbb00] tracking-normal">
              diproses?
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mx-auto mt-3.5 max-w-[620px] text-[clamp(13.5px,1.2vw,15.5px)] leading-[1.65] text-[#a4c1db]"
          >
            Setiap keluhan tercatat dalam sistem terpadu. Pantau linimasa penanganan fasilitas kampus dari awal hingga perbaikan tuntas.
          </motion.p>
        </div>

        {/* 4 Steps Grid */}
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.article
                key={item.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#072445]/45 p-6 backdrop-blur-md shadow-lg shadow-black/20 transition-colors duration-300 hover:border-[#4899e8]/50 hover:bg-[#0b2f59]/60 hover:shadow-2xl hover:shadow-[#0c4278]/25"
              >
                {/* Background Ambient Glow */}
                <div className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#105292]/15 blur-2xl transition duration-500 group-hover:bg-[#4899e8]/25" aria-hidden="true" />

                <div>
                  {/* Top Bar with Number and Tag */}
                  <div className="flex items-center justify-between">
                    <span className="font-['Outfit','Montserrat','Poppins',sans-serif] text-xs font-extrabold tracking-widest text-[#60b6ff]/80">
                      {item.number}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-[#8fc3ee]">
                      {item.tag}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mt-5 inline-flex size-12 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-[#0c4278] to-[#062445] text-[#7fc3f8] shadow-inner transition duration-300 group-hover:border-[#7fc3f8]/50 group-hover:scale-105">
                    <Icon className="size-5.5" aria-hidden="true" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="mt-4 font-['Outfit','Montserrat','Poppins',sans-serif] text-lg font-bold text-white transition duration-200 group-hover:text-[#c4e4ff]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-xs leading-[1.65] text-[#97b8d4]">
                    {item.description}
                  </p>
                </div>

                {/* Bottom Perk Pill */}
                <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-medium text-[#7fc3f8]">
                  <span>{item.perk}</span>
                  <span className="transition duration-200 group-hover:translate-x-1" aria-hidden="true">→</span>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-5 rounded-2xl border border-white/15 bg-gradient-to-r from-[#0a3560]/70 via-[#072545]/60 to-[#0c4278]/50 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/25"
        >
          <div className="text-center sm:text-left">
            <h4 className="font-['Outfit','Montserrat','Poppins',sans-serif] text-base sm:text-lg font-bold text-white">
              Menemukan fasilitas kampus yang perlu diperbaiki?
            </h4>
            <p className="mt-1 text-xs text-[#a4c1db]">
              Kirimkan laporan Anda sekarang. Butuh waktu kurang dari 2 menit.
            </p>
          </div>
          <button
            type="button"
            onClick={onStartReport}
            className="flex items-center gap-2 shrink-0 rounded-full bg-gradient-to-r from-[#60b6ff] to-[#3a93e8] px-6 py-3 text-xs font-bold text-[#021427] shadow-lg shadow-[#105292]/40 transition duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:brightness-110 active:translate-y-0"
          >
            <span>Mulai Melapor</span>
            <FiArrowRight className="size-4" aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </section>
  )
}
