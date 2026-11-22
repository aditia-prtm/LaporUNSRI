import { FiArrowUp } from 'react-icons/fi'
import { Brand } from '../common/Brand'

type LandingFooterProps = {
  onNavigate: (path: string) => void
  onScrollToTop: () => void
  onScrollToAbout?: () => void
  onScrollToSteps: () => void
  onScrollToFaq: () => void
}

export function LandingFooter({
  onScrollToTop,
  onScrollToAbout,
  onScrollToSteps,
  onScrollToFaq,
}: LandingFooterProps) {
  return (
    <footer
      className="relative border-t border-white/10 bg-[#041d38] px-6 py-8 sm:px-10 lg:px-16 text-white select-none"
      aria-label="Footer LaporUNSRI"
    >
      <div className="mx-auto max-w-[1280px] flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & Institutional Copyright */}
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5 text-center sm:text-left">
          <Brand
            onClick={onScrollToTop}
            subtitle="Layanan Aspirasi Sarana & Prasarana"
          />
          <div className="hidden sm:block h-5 w-px bg-white/15" aria-hidden="true" />
          <p className="m-0 text-xs text-sky-200/60">
            © {new Date().getFullYear()} LaporUNSRI • Universitas Sriwijaya
          </p>
        </div>

        {/* Essential Navigation & Back to Top */}
        <div className="flex flex-wrap items-center justify-center gap-5 sm:gap-7 text-xs sm:text-[13px] text-sky-100/75">
          {onScrollToAbout && (
            <button
              type="button"
              onClick={onScrollToAbout}
              className="hover:text-white transition-colors duration-150 cursor-pointer"
            >
              Tentang
            </button>
          )}
          <button
            type="button"
            onClick={onScrollToSteps}
            className="hover:text-white transition-colors duration-150 cursor-pointer"
          >
            Alur Pelaporan
          </button>
          <button
            type="button"
            onClick={onScrollToFaq}
            className="hover:text-white transition-colors duration-150 cursor-pointer"
          >
            FAQ
          </button>
          <button
            type="button"
            onClick={onScrollToTop}
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 px-3.5 py-1.5 text-xs text-sky-100 hover:text-white transition-colors duration-150 cursor-pointer"
          >
            <span>Kembali ke atas</span>
            <FiArrowUp className="size-3" aria-hidden="true" />
          </button>
        </div>
      </div>
    </footer>
  )
}
