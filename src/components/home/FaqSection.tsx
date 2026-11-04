import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiHelpCircle } from 'react-icons/fi'

type FaqItem = {
  id: string
  question: string
  answer: string
}

const faqs: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Apakah saya bisa melapor secara anonim tanpa menampilkan identitas?',
    answer:
      'Tentu saja bisa. Anda dapat mengaktifkan opsi "Lapor Anonim" saat mengisi formulir. Nama dan informasi profil Anda tidak akan dipublikasikan kepada mahasiswa lain maupun publik demi kenyamanan dan perlindungan privasi Anda.',
  },
  {
    id: 'faq-2',
    question: 'Fasilitas kampus apa saja yang dapat dilaporkan melalui sistem ini?',
    answer:
      'Seluruh fasilitas fisik dan infrastruktur penunjang di lingkungan Universitas Sriwijaya, antara lain ruang kuliah, proyektor/audio, pendingin ruangan (AC), toilet & sanitasi, trotoar & jalan kampus, penerangan jalan umum, hotspot WiFi, serta fasilitas gedung serbaguna.',
  },
  {
    id: 'faq-3',
    question: 'Berapa lama waktu yang dibutuhkan hingga laporan diverifikasi dan ditangani?',
    answer:
      'Verifikasi awal oleh tim sarana dan prasarana dilakukan maksimal dalam 1x24 jam kerja. Durasi penanganan fisik di lapangan bervariasi bergantung pada tingkat keparahan kerusakan dan ketersediaan suku cadang teknis, namun perkembangan statusnya selalu diinformasikan.',
  },
  {
    id: 'faq-4',
    question: 'Bagaimana cara memantau progres perbaikan laporan yang telah saya kirim?',
    answer:
      'Setelah masuk ke akun mahasiswa, buka menu "Laporan Saya". Setiap laporan dilengkapi linimasa tahapan status (Terkirim → Diproses → Dikerjakan → Selesai) lengkap dengan tanggal pembaruan dan catatan langsung dari petugas penanggung jawab.',
  },
  {
    id: 'faq-5',
    question: 'Siapa pihak yang bertanggung jawab menindaklanjuti laporan perbaikan fasilitas?',
    answer:
      'Laporan ditindaklanjuti secara berjenjang oleh tim Sarana dan Prasarana (Sarpras) fakultas atau universitas serta unit teknisi lapangan Universitas Sriwijaya yang berwenang.',
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
      className="relative px-6 py-20 sm:px-10 lg:px-16 bg-slate-50 border-t-2 border-slate-200"
      aria-label="Pertanyaan yang Sering Diajukan"
    >
      <div className="mx-auto max-w-[920px]">
        {/* Section Header */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border-2 border-slate-300 bg-white px-4 py-1 text-xs font-bold uppercase tracking-wider text-[#0c4278] shadow-xs"
          >
            <FiHelpCircle className="size-3.5" aria-hidden="true" />
            <span>Pusat Informasi & Bantuan</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="mt-4 font-['Poppins','Montserrat',sans-serif] text-[clamp(26px,3vw,40px)] font-black leading-[1.2] tracking-tight text-slate-950"
          >
            Pertanyaan yang sering{' '}
            <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#b45309] tracking-normal">
              diajukan
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: 0.16 }}
            className="mx-auto mt-2.5 max-w-[560px] text-sm sm:text-base leading-relaxed text-slate-700 font-normal"
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
                className={`overflow-hidden rounded-2xl border-2 transition-all duration-200 ${
                  isOpen
                    ? 'border-[#0c4278] bg-white shadow-md'
                    : 'border-slate-300 bg-white hover:border-slate-400 shadow-2xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  aria-expanded={isOpen}
                  aria-controls={`${faq.id}-content`}
                  className="flex w-full items-center justify-between gap-4 p-5 sm:p-6 text-left transition duration-150 cursor-pointer"
                >
                  <span className="font-['Poppins','Montserrat',sans-serif] text-base sm:text-lg font-bold text-slate-950">
                    {faq.question}
                  </span>
                  <div
                    className={`flex size-9 shrink-0 items-center justify-center rounded-full transition-transform duration-200 ${
                      isOpen ? 'rotate-180 bg-[#0c4278] text-white' : 'bg-slate-100 text-slate-700'
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
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 pt-2 text-sm sm:text-base leading-relaxed text-slate-700 border-t-2 border-slate-100">
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
