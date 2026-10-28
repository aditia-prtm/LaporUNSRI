import type { ReactNode } from 'react'
import { Brand } from '../common/Brand'
import { FiArrowLeft, FiCheckCircle, FiShield, FiUsers } from 'react-icons/fi'

type AuthLayoutProps = {
  officerPage: boolean
  onNavigate: (path: string) => void
  children: ReactNode
}

export function AuthLayout({ officerPage, onNavigate, children }: AuthLayoutProps) {
  return (
    <main className="relative grid min-h-screen grid-cols-1 lg:grid-cols-[minmax(380px,45%)_1fr] bg-[#020b17] font-['Poppins','Montserrat','Outfit',system-ui,sans-serif] text-white overflow-hidden">
      {/* Ambient background glow */}
      <div
        className="pointer-events-none absolute -left-40 top-0 size-[500px] rounded-full bg-[#105292]/25 blur-[120px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute right-0 bottom-0 size-[450px] rounded-full bg-[#4899e8]/15 blur-[140px]"
        aria-hidden="true"
      />

      {/* Left Brand & Story Section */}
      <section className="relative flex min-h-full flex-col justify-between border-b lg:border-b-0 lg:border-r border-white/10 bg-gradient-to-b from-[#051d38]/80 via-[#04162a]/90 to-[#020b17] p-6 sm:p-10 lg:p-12 z-10">
        {/* Ambient Top Glow Accent Line */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#4899e8]/20 via-transparent to-transparent"
          aria-hidden="true"
        />

        <div className="relative z-10 flex items-center justify-between">
          <Brand onClick={() => onNavigate('/')} />
          <button
            type="button"
            onClick={() => onNavigate('/')}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-[#cce5fb] backdrop-blur transition hover:bg-white/15 hover:text-white lg:hidden"
          >
            <FiArrowLeft className="size-3.5" aria-hidden="true" />
            <span>Beranda</span>
          </button>
        </div>

        <div className="relative z-10 my-auto py-8 lg:py-12 max-w-[480px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#60b6ff]/30 bg-[#60b6ff]/10 px-3.5 py-1 text-[11px] font-semibold text-[#8fc3ee] backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-[#60b6ff] shadow-[0_0_8px_#60b6ff]" />
            <span>{officerPage ? 'Portal Petugas Sarpras UNSRI' : 'Layanan Aspirasi Kampus UNSRI'}</span>
          </div>

          <h1 className="mt-4 font-['Poppins','Montserrat','Outfit',sans-serif] text-2xl sm:text-3xl lg:text-[clamp(30px,3vw,42px)] font-bold leading-[1.2] tracking-tight text-white">
            {officerPage ? (
              <>
                Bersama menjaga kampus tetap{' '}
                <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-semibold text-[#ffbb00]">
                  nyaman & prima
                </span>
              </>
            ) : (
              <>
                Satu wadah untuk kampus yang lebih{' '}
                <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-semibold text-[#ffbb00]">
                  nyaman & responsif
                </span>
              </>
            )}
          </h1>

          <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[#a4c1db]">
            {officerPage
              ? 'Tinjau setiap laporan fasilitas kampus yang ditugaskan, perbarui tahapan pengerjaan, dan lampirkan bukti foto penyelesaian secara transparan.'
              : 'Sampaikan kendala fasilitas kampus, dukung laporan dari rekan mahasiswa, dan pantau proses tindak lanjut hingga tuntas.'}
          </p>

          {/* Value Badges */}
          <div className="mt-6 sm:mt-8 space-y-2.5 max-sm:hidden">
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm">
              <FiCheckCircle className="size-4 shrink-0 text-[#60b6ff]" />
              <span className="text-xs text-[#cce5fb]">
                {officerPage ? 'Wajib verifikasi foto hasil pekerjaan' : 'Pelaporan terstruktur dengan bukti foto presisi'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm">
              <FiUsers className="size-4 shrink-0 text-[#60b6ff]" />
              <span className="text-xs text-[#cce5fb]">
                {officerPage ? 'Terhubung langsung dengan tim Sarpras' : 'Dukungan suara mahasiswa secara kolektif'}
              </span>
            </div>
            <div className="flex items-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 backdrop-blur-sm">
              <FiShield className="size-4 shrink-0 text-[#60b6ff]" />
              <span className="text-xs text-[#cce5fb]">
                {officerPage ? 'Akuntabilitas dan rekam jejak terintegrasi' : 'Linimasa transparan & terpantau berkala'}
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-4 text-xs text-[#8cb6dc]">
          <span>© {new Date().getFullYear()} LaporUNSRI</span>
          <span className="text-[11px] text-[#60b6ff]">Universitas Sriwijaya</span>
        </div>
      </section>

      {/* Right Form Section */}
      <section className="relative flex min-h-full items-center justify-center p-6 sm:p-10 lg:p-12 z-10">
        <div className="w-full max-w-[440px]">{children}</div>
      </section>
    </main>
  )
}
