import { motion } from 'framer-motion'
import { FiShield, FiUsers, FiMapPin, FiCheckCircle, FiActivity, FiArrowRight } from 'react-icons/fi'

type AboutSectionProps = {
  onLearnMore?: () => void
  onStartReport?: () => void
}

const pillars = [
  {
    icon: FiMapPin,
    title: 'Pelaporan Presisi & Terbuka',
    badge: 'Transparansi',
    description:
      'Setiap laporan dilengkapi foto bukti kerusakan, penandaan lokasi akurat (fakultas, gedung, hingga ruang kelas), serta linimasa penanganan yang transparan untuk seluruh sivitas kampus.',
    highlight: 'Data Terstruktur & Terlacak',
  },
  {
    icon: FiUsers,
    title: 'Prioritas Kolektif Mahasiswa',
    badge: 'Kolaborasi',
    description:
      'Melalui fitur "Saya juga mengalami", laporan serupa secara otomatis terkonsolidasi dan naik ke tingkat prioritas utama tanpa perlu mengulang aduan yang sama.',
    highlight: 'Kekuatan Suara Bersama',
  },
  {
    icon: FiShield,
    title: 'Akuntabilitas Tindak Lanjut',
    badge: 'Solutif',
    description:
      'Terhubung langsung dengan dashboard teknisi dan admin kampus. Setiap perbaikan fasilitas wajib menyertakan dokumentasi foto hasil penanganan sebelum status dinyatakan selesai.',
    highlight: 'Wajib Bukti Penyelesaian',
  },
]

const stats = [
  { number: '10', label: 'Fakultas Terjangkau', sub: 'Indralaya & Palembang' },
  { number: '100%', label: 'Terbuka & Akuntabel', sub: 'Dapat Dipantau Publik' },
  { number: '< 2 mnt', label: 'Proses Lapor Cepat', sub: 'Mudah via Smartphone / PC' },
  { number: '3 Tahap', label: 'Alur Terstandar', sub: 'Tercatat, Diproses, Tuntas' },
]

export function AboutSection({ onLearnMore, onStartReport }: AboutSectionProps) {
  return (
    <section
      id="about-section"
      className="relative px-6 pt-16 pb-12 sm:px-10 md:pt-24 md:pb-16 lg:px-16"
      aria-label="Tentang LaporUNSRI"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Top Header Badge & Headline */}
        <div className="mx-auto max-w-[820px] text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full border border-[#4899e8]/30 bg-[#0c4278]/40 px-3.5 py-1 text-xs font-semibold text-[#7fc3f8] backdrop-blur-md"
          >
            <span className="size-1.5 rounded-full bg-[#60b6ff] animate-pulse" aria-hidden="true" />
            Tentang LaporUNSRI
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.08 }}
            className="mt-4 font-['Outfit','Montserrat','Poppins',sans-serif] text-[clamp(26px,3.2vw,42px)] font-bold leading-[1.2] tracking-tight text-white"
          >
            Satu wadah terpadu untuk kampus yang lebih{' '}
            <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#ffbb00] tracking-normal">
              nyaman & responsif
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.65, delay: 0.16 }}
            className="mx-auto mt-4 max-w-[680px] text-[clamp(13.5px,1.2vw,15.5px)] leading-[1.65] text-[#a4c1db]"
          >
            LaporUNSRI dirancang khusus untuk seluruh mahasiswa dan sivitas akademika Universitas Sriwijaya.
            Keluhan fasilitas yang biasanya tercecer di obrolan grup kini dirangkum ke dalam satu sistem terintegrasi, transparan, dan dapat dipantau hingga selesai diperbaiki.
          </motion.p>
        </div>

        {/* Feature Pillars: 3 Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3">
          {pillars.map((item, index) => {
            const Icon = item.icon
            return (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.55, delay: index * 0.1 }}
                whileHover={{ y: -6, transition: { duration: 0.25 } }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#072445]/45 p-6 sm:p-7 backdrop-blur-md shadow-lg shadow-black/20 transition-all duration-300 hover:border-[#4899e8]/50 hover:bg-[#0b2f59]/60 hover:shadow-2xl hover:shadow-[#0c4278]/25"
              >
                {/* Glow Background Accent */}
                <div
                  className="pointer-events-none absolute -right-10 -top-10 size-32 rounded-full bg-[#105292]/15 blur-2xl transition duration-500 group-hover:bg-[#4899e8]/25"
                  aria-hidden="true"
                />

                <div>
                  <div className="flex items-center justify-between">
                    <div className="inline-flex size-11 items-center justify-center rounded-xl border border-white/15 bg-gradient-to-br from-[#0c4278] to-[#062445] text-[#7fc3f8] shadow-inner transition duration-300 group-hover:scale-105 group-hover:border-[#7fc3f8]/50">
                      <Icon className="size-5" aria-hidden="true" />
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-[10px] font-semibold text-[#8fc3ee]">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="mt-5 font-['Outfit','Montserrat','Poppins',sans-serif] text-lg font-bold text-white transition duration-200 group-hover:text-[#c4e4ff]">
                    {item.title}
                  </h3>
                  <p className="mt-2.5 text-xs leading-[1.68] text-[#97b8d4]">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-1.5 border-t border-white/10 pt-4 text-[11px] font-semibold text-[#60b6ff]">
                  <FiCheckCircle className="size-3.5" aria-hidden="true" />
                  <span>{item.highlight}</span>
                </div>
              </motion.article>
            )
          })}
        </div>

        {/* Stats & Mission Highlight Banner */}
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 overflow-hidden rounded-2xl border border-white/15 bg-gradient-to-br from-[#082e56]/70 via-[#051c36]/60 to-[#0c4278]/40 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/25"
        >
          <div className="grid grid-cols-2 gap-6 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
            {stats.map((stat, i) => (
              <div
                key={stat.label}
                className={`flex flex-col items-center text-center ${
                  i % 2 === 0 ? '' : 'max-lg:border-none'
                } ${i > 1 ? 'pt-6 lg:pt-0' : ''} ${i > 0 ? 'lg:pl-6' : ''}`}
              >
                <div className="flex items-center gap-1.5">
                  <FiActivity className="size-3.5 text-[#ffbb00]" aria-hidden="true" />
                  <span className="font-['Outfit','Montserrat','Poppins',sans-serif] text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {stat.number}
                  </span>
                </div>
                <span className="mt-1 text-xs font-semibold text-[#e1effa]">
                  {stat.label}
                </span>
                <span className="mt-0.5 text-[10px] text-[#86a8c7]">
                  {stat.sub}
                </span>
              </div>
            ))}
          </div>

          {/* Quick Action row inside about */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/10 pt-6">
            <p className="text-xs text-[#a0c0db] text-center sm:text-left">
              Menemukan AC rusak, proyektor mati, atau fasilitas lain yang perlu penanganan segera?
            </p>
            <div className="flex items-center gap-3 shrink-0">
              {onLearnMore && (
                <button
                  type="button"
                  onClick={onLearnMore}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7fc3f8] transition duration-200 hover:text-white"
                >
                  Lihat alur proses
                  <FiArrowRight className="size-3" aria-hidden="true" />
                </button>
              )}
              {onStartReport && (
                <button
                  type="button"
                  onClick={onStartReport}
                  className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#60b6ff] to-[#3a93e8] px-4.5 py-2 text-xs font-bold text-[#021427] shadow-md shadow-[#105292]/30 transition duration-200 hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
                >
                  Buat Laporan
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
