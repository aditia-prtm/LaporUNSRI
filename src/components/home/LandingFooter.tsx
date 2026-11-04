import { FiArrowUp, FiMapPin, FiMail, FiClock, FiShield } from 'react-icons/fi'

type LandingFooterProps = {
  onNavigate: (path: string) => void
  onScrollToTop: () => void
  onScrollToAbout?: () => void
  onScrollToSteps: () => void
  onScrollToFaq: () => void
}

export function LandingFooter({
  onNavigate,
  onScrollToTop,
  onScrollToAbout,
  onScrollToSteps,
  onScrollToFaq,
}: LandingFooterProps) {
  return (
    <footer
      className="relative border-t border-slate-200 bg-white px-4 min-[380px]:px-6 sm:px-10 lg:px-16 pt-14 pb-10 text-slate-800 select-none"
      aria-label="Footer LaporUNSRI"
    >
      <div className="mx-auto max-w-[1280px]">
        {/* Top Grid: Brand & Institutional Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-12 border-b border-slate-200">
          {/* Column 1: Brand & Purpose (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault()
                  onScrollToTop()
                }}
                className="inline-flex flex-col items-start no-underline transition duration-150 hover:opacity-90"
                aria-label="Kembali ke atas"
              >
                <span className="flex items-baseline gap-0.5 text-2xl sm:text-[26px] font-normal leading-none tracking-tight text-slate-900">
                  <span>lapor</span>
                  <strong className="font-extrabold text-slate-900">UNSRI</strong>
                  <span className="ml-1 size-2 rounded-full bg-[#ffbb00] shadow-[0_0_8px_#ffbb00]" aria-hidden="true" />
                </span>
                <span className="mt-1 text-[9px] font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Layanan Aspirasi Sarana & Prasarana
                </span>
              </a>

              <p className="mt-3.5 text-xs sm:text-[13px] leading-relaxed text-slate-600 max-w-[420px]">
                Platform resmi keterbukaan dan pelaporan fasilitas kampus Universitas Sriwijaya. Menghubungkan aspirasi mahasiswa langsung ke tim teknisi sarana dan prasarana.
              </p>
            </div>

            {/* Live System Operational Status */}
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs text-slate-600 w-fit">
              <span className="relative flex size-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                <span className="relative inline-flex rounded-full size-2 bg-emerald-600" />
              </span>
              <span>Sistem Operasional Aktif • Layanan 24 Jam Terbuka</span>
            </div>
          </div>

          {/* Column 2: Kampus UNSRI (Indralaya & Palembang) (3 cols on lg) */}
          <div className="lg:col-span-3">
            <h4 className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-[#0c4278]">
              Lokasi Kampus UNSRI
            </h4>
            <div className="mt-4 space-y-3.5 text-xs text-slate-600">
              <div className="flex items-start gap-2">
                <FiMapPin className="size-4 text-[#0c4278] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 m-0">Kampus Utama Indralaya</p>
                  <p className="text-[11px] leading-relaxed text-slate-500 m-0 mt-0.5">
                    Jl. Raya Palembang - Prabumulih Km. 32, Indralaya, Kab. Ogan Ilir, Sumsel 30662
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2 pt-1">
                <FiMapPin className="size-4 text-[#b8860b] shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-slate-900 m-0">Kampus Palembang</p>
                  <p className="text-[11px] leading-relaxed text-slate-500 m-0 mt-0.5">
                    Jl. Srijaya Negara, Bukit Besar, Kota Palembang 30139
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Navigasi & Tautan Cepat (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-[#0c4278]">
              Navigasi
            </h4>
            <ul className="mt-4 space-y-2.5 text-xs text-slate-600 list-none p-0 m-0">
              <li>
                <button
                  type="button"
                  onClick={onScrollToTop}
                  className="transition duration-150 hover:text-slate-900 cursor-pointer"
                >
                  Beranda
                </button>
              </li>
              {onScrollToAbout && (
                <li>
                  <button
                    type="button"
                    onClick={onScrollToAbout}
                    className="transition duration-150 hover:text-slate-900 cursor-pointer"
                  >
                    Tentang Kami
                  </button>
                </li>
              )}
              <li>
                <button
                  type="button"
                  onClick={onScrollToSteps}
                  className="transition duration-150 hover:text-slate-900 cursor-pointer"
                >
                  Alur Pelaporan
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onScrollToFaq}
                  className="transition duration-150 hover:text-slate-900 cursor-pointer"
                >
                  FAQ & Bantuan
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Portal & Kontak (2 cols on lg) */}
          <div className="lg:col-span-2">
            <h4 className="font-['Poppins',sans-serif] text-xs font-bold uppercase tracking-wider text-[#0c4278]">
              Akses Portal
            </h4>
            <div className="mt-4 flex flex-col gap-2">
              <button
                type="button"
                onClick={() => onNavigate('/auth')}
                className="w-full text-left rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
              >
                Masuk Akun Mahasiswa
              </button>
              <button
                type="button"
                onClick={() => onNavigate('/petugas')}
                className="w-full text-left rounded-xl bg-[#0c4278] hover:bg-[#08315c] px-3 py-2 text-xs font-medium text-white transition cursor-pointer"
              >
                Portal Petugas Sarpras
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200 text-[11px] text-slate-500 space-y-1.5">
              <div className="flex items-center gap-1.5">
                <FiMail className="size-3 text-[#0c4278]" />
                <span className="truncate">sarpras@unsri.ac.id</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FiClock className="size-3 text-emerald-600" />
                <span>Senin - Jumat, 08.00 - 16.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Credits & Back to Top */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2 text-center sm:text-left">
            <FiShield className="size-3.5 text-emerald-600 shrink-0" />
            <p className="m-0 text-[11px] sm:text-xs">
              © {new Date().getFullYear()} LaporUNSRI • Universitas Sriwijaya. Inisiatif Mahasiswa & Tim Sarana Prasarana Kampus.
            </p>
          </div>

          <button
            type="button"
            onClick={onScrollToTop}
            className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-1.5 text-xs font-medium text-slate-700 transition duration-150 hover:bg-slate-100 hover:text-slate-900 cursor-pointer"
          >
            <span>Kembali ke atas</span>
            <FiArrowUp className="size-3.5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}
