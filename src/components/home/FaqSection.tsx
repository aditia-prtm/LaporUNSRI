import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown } from 'react-icons/fi'

type FaqItem = {
  id: string
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Apakah saya bisa membuat laporan tanpa akun atau secara anonim?',
    answer:
      'Tidak bisa. Untuk menjaga keabsahan aduan, mencegah laporan fiktif, serta menjamin akuntabilitas penanganan, setiap pelapor wajib masuk menggunakan akun mahasiswa Universitas Sriwijaya yang terdaftar. Data akun juga diperlukan agar Anda dapat memantau perkembangan perbaikan serta melakukan verifikasi konfirmasi penyelesaian setelah fasilitas selesai ditangani di lapangan.',
  },
  {
    id: 'faq-2',
    question: 'Fasilitas kampus apa saja yang dapat dilaporkan melalui sistem ini?',
    answer:
      'Seluruh fasilitas fisik dan infrastruktur penunjang di lingkungan Universitas Sriwijaya, antara lain pendingin ruangan (AC) & ventilasi, proyektor & audio, kelistrikan & stopkontak, toilet & sanitasi, trotoar & jalan kampus, penerangan jalan, hotspot WiFi, serta fasilitas ruang kuliah dan gedung serbaguna.',
  },
  {
    id: 'faq-3',
    question: 'Bagaimana jika laporan belum ditindaklanjuti dalam waktu lama?',
    answer:
      'Sistem LaporUNSRI menerapkan mekanisme pengawasan otomatis. Apabila laporan berstatus "Belum Diproses" melebihi 7 hari tanpa penanganan, sistem secara otomatis menandainya sebagai "Perlu Eskalasi" di dashboard administrator kampus untuk segera dievaluasi dan ditangani secara prioritas.',
  },
  {
    id: 'faq-4',
    question: 'Bagaimana alur dan pemantauan progres penanganan laporan saya?',
    answer:
      'Perkembangan dapat dipantau langsung di menu "Laporan Saya" dengan alur resmi satu arah: Belum Diproses ➔ Diproses ➔ Menunggu Konfirmasi ➔ Selesai. Ketika petugas menyelesaikan perbaikan disertai foto bukti, status berpindah ke "Menunggu Konfirmasi". Laporan baru resmi berstatus "Selesai" setelah Anda selaku pelapor memverifikasi dan mengonfirmasi hasil pekerjaan.',
  },
  {
    id: 'faq-5',
    question: 'Apakah mahasiswa lain dapat melihat dan mendukung laporan saya?',
    answer:
      'Ya. Seluruh laporan fasilitas yang masuk akan tampil pada Katalog Aspirasi Kampus. Mahasiswa lain dapat memberikan dukungan (upvote) untuk menandakan bahwa kendala fasilitas tersebut dirasakan bersama dan membutuhkan percepatan penanganan.',
  },
]

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null)

  const toggleFaq = (id: string) => {
    setOpenId((prev) => (prev === id ? null : id))
  }

  return (
    <section
      id="faq-section"
      className="relative px-6 py-20 sm:px-10 lg:px-16 bg-[#08315c] text-white border-t border-white/15"
      aria-label="Pertanyaan yang Sering Diajukan"
    >
      <div className="mx-auto max-w-[920px]">
        {/* Section Header */}
        <div className="text-center">
          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-4 font-['Poppins','Montserrat',sans-serif] text-[clamp(26px,3vw,40px)] font-black leading-[1.2] tracking-tight text-white"
          >
            Pertanyaan yang sering{' '}
            <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#ffbb00] tracking-normal">
              diajukan
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mt-2.5 max-w-[560px] text-sm sm:text-base leading-relaxed text-sky-100/90 font-normal"
          >
            Punya pertanyaan mengenai alur pelaporan atau penanganan fasilitas? Temukan jawaban praktisnya di bawah ini.
          </motion.p>
        </div>

        {/* Accordion List (Tebal, tajam, kontras tinggi) */}
        <div className="mt-10 space-y-3.5">
          {faqs.map((faq, index) => {
            const isOpen = openId === faq.id
            return (
              <motion.div
                key={faq.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: index * 0.06 }}
                className={`overflow-hidden rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? 'border-[#38bdf8]/60 bg-white/[0.12] shadow-xl shadow-black/30'
                    : 'border-white/15 bg-white/[0.06] hover:bg-white/[0.1] hover:border-white/25 shadow-xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`${faq.id}-content`}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition duration-150 cursor-pointer"
                >
                  <span className="font-['Poppins','Montserrat',sans-serif] text-sm sm:text-base font-bold text-white">
                    {faq.question}
                  </span>
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                      isOpen
                        ? 'rotate-180 bg-[#ffbb00] text-slate-950 shadow-md shadow-[#ffbb00]/30'
                        : 'bg-white/10 text-white'
                    }`}
                  >
                    <FiChevronDown className="size-4 stroke-[2.5]" aria-hidden="true" />
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`${faq.id}-content`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 text-sm sm:text-base leading-relaxed text-sky-100/95 border-t border-white/15">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
