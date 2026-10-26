type LandingFooterProps = {
  onNavigate: (path: string) => void
  onScrollToTop: () => void
  onScrollToSteps: () => void
  onScrollToFaq: () => void
}

export function LandingFooter({
  onNavigate,
  onScrollToTop,
  onScrollToSteps,
  onScrollToFaq,
}: LandingFooterProps) {
  return (
    <footer className="relative border-t border-white/10 bg-[#020b17]/90 px-6 py-12 sm:px-10 lg:px-16 text-white" aria-label="Footer LaporUNSRI">
      <div className="mx-auto max-w-[1280px]">
        {/* Main Footer Row */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-10 border-b border-white/10">
          {/* Brand & Campus Description */}
          <div className="max-w-[420px]">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault()
                onScrollToTop()
              }}
              className="inline-flex flex-col items-start no-underline transition duration-200 hover:opacity-90"
              aria-label="Kembali ke atas"
            >
              <span className="flex items-baseline gap-0.5 text-2xl font-normal leading-none tracking-tight">
                <span>lapor</span>
                <strong className="font-extrabold">UNSRI</strong>
                <i className="ml-0.5 size-1.5 -translate-y-1 rounded-full bg-[#60b6ff] shadow-[0_0_10px_#60b6ff]" aria-hidden="true" />
              </span>
              <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.24em] text-[rgba(220,238,255,0.72)]">
                Layanan Aspirasi Kampus
              </span>
            </a>
            <p className="mt-3.5 text-xs leading-[1.65] text-[#86a7c4]">
              Platform aspirasi dan pelaporan fasilitas terpadu Universitas Sriwijaya. Membantu mewujudkan lingkungan perkuliahan yang aman, nyaman, dan akuntabel.
            </p>
          </div>

          {/* Quick Nav Links */}
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-xs font-medium text-[#a4c2dc]">
            <button
              type="button"
              onClick={onScrollToTop}
              className="transition duration-150 hover:text-white"
            >
              Beranda
            </button>
            <button
              type="button"
              onClick={onScrollToSteps}
              className="transition duration-150 hover:text-white"
            >
              Alur Pelaporan
            </button>
            <button
              type="button"
              onClick={onScrollToFaq}
              className="transition duration-150 hover:text-white"
            >
              FAQ
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/auth')}
              className="font-semibold text-[#7fc3f8] transition duration-150 hover:text-white"
            >
              Masuk Akun
            </button>
            <button
              type="button"
              onClick={() => onNavigate('/petugas')}
              className="transition duration-150 hover:text-white"
            >
              Portal Petugas
            </button>
          </div>
        </div>

        {/* Bottom Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#698ba8]">
          <p className="m-0">
            © {new Date().getFullYear()} LaporUNSRI • Universitas Sriwijaya. Seluruh hak cipta dilindungi.
          </p>
          <p className="m-0">
            Untuk kampus yang lebih nyaman, bersama.
          </p>
        </div>
      </div>
    </footer>
  )
}
