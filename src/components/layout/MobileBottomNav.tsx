import { FiFileText, FiHome, FiLayers, FiPlus, FiUser } from 'react-icons/fi'

type NavTab = 'dashboard' | 'reports' | 'mine' | 'settings' | 'new'

type MobileBottomNavProps = {
  active: NavTab
  onNavigate: (path: string) => void
}

export function MobileBottomNav({ active, onNavigate }: MobileBottomNavProps) {
  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 lg:hidden pointer-events-auto select-none"
      aria-label="Navigasi Bawah Mobile"
    >
      <div className="relative mx-auto w-full max-w-md">
        {/* Background layer with continuous smooth notch cradle */}
        <div className="pointer-events-none absolute inset-0 flex flex-col filter drop-shadow-[0_-6px_16px_rgba(8,49,92,0.08)]">
          {/* Top Notch Row: height 26px */}
          <div className="flex h-[26px] w-full">
            <div className="flex-1 bg-white rounded-tl-2xl" />
            <div className="relative h-[26px] w-[88px] shrink-0">
              <svg
                viewBox="0 0 88 26"
                className="block h-full w-full"
                preserveAspectRatio="none"
                fill="white"
              >
                <path d="M 0 0 C 18 0, 24 26, 44 26 C 64 26, 70 0, 88 0 L 88 26 L 0 26 Z" />
              </svg>
            </div>
            <div className="flex-1 bg-white rounded-tr-2xl" />
          </div>

          {/* Solid White Base filling all remaining height & safe area */}
          <div className="flex-1 w-full bg-white" />
        </div>

        {/* Foreground Interactive Buttons */}
        <div className="relative z-10 flex w-full items-end justify-between px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.625rem)]">
          {/* 1. Ringkasan */}
          <button
            type="button"
            onClick={() => onNavigate('/mahasiswa')}
            className="group flex flex-1 flex-col items-center justify-end py-1 transition-colors cursor-pointer"
            aria-label="Ringkasan Dashboard"
          >
            <div className="flex h-6 items-center justify-center">
              <FiHome
                className={`size-5 transition-transform duration-150 group-active:scale-90 ${
                  active === 'dashboard' ? 'text-[#08315c] stroke-[2.5]' : 'text-slate-400'
                }`}
              />
            </div>
            <span
              className={`mt-1 text-[10px] tracking-tight transition-colors ${
                active === 'dashboard' ? 'font-bold text-[#08315c]' : 'font-medium text-slate-500'
              }`}
            >
              Ringkasan
            </span>
            <span
              className={`mt-1 size-1.5 rounded-full transition-all duration-200 ${
                active === 'dashboard' ? 'bg-[#08315c] opacity-100 scale-100' : 'bg-transparent opacity-0 scale-0'
              }`}
              aria-hidden="true"
            />
          </button>

          {/* 2. Semua Laporan */}
          <button
            type="button"
            onClick={() => onNavigate('/mahasiswa/laporan')}
            className="group flex flex-1 flex-col items-center justify-end py-1 transition-colors cursor-pointer"
            aria-label="Semua Laporan"
          >
            <div className="flex h-6 items-center justify-center">
              <FiLayers
                className={`size-5 transition-transform duration-150 group-active:scale-90 ${
                  active === 'reports' ? 'text-[#08315c] stroke-[2.5]' : 'text-slate-400'
                }`}
              />
            </div>
            <span
              className={`mt-1 text-[10px] tracking-tight transition-colors ${
                active === 'reports' ? 'font-bold text-[#08315c]' : 'font-medium text-slate-500'
              }`}
            >
              Semua
            </span>
            <span
              className={`mt-1 size-1.5 rounded-full transition-all duration-200 ${
                active === 'reports' ? 'bg-[#08315c] opacity-100 scale-100' : 'bg-transparent opacity-0 scale-0'
              }`}
              aria-hidden="true"
            />
          </button>

          {/* 3. Center Elevated Button: Tambah Laporan (Sesuai Referensi) */}
          <div className="relative flex w-[88px] shrink-0 flex-col items-center justify-end py-1">
            <button
              type="button"
              onClick={() => onNavigate('/mahasiswa/laporan/baru')}
              className="group flex flex-col items-center cursor-pointer"
              aria-label="Tambah Laporan Baru"
            >
              {/* Floating Elevated Circle resting in the cradle notch */}
              <div className="relative h-6 w-full flex items-center justify-center">
                <div
                  className={`absolute -top-7 flex size-13.5 items-center justify-center rounded-full p-1 transition-transform duration-150 active:scale-95 shadow-md ${
                    active === 'new'
                      ? 'bg-[#bcd7ee] ring-2 ring-[#08315c]'
                      : 'bg-[#cfe2f3] hover:bg-[#bcd7ee]'
                  }`}
                >
                  <div className="flex size-full items-center justify-center rounded-full bg-[#08315c] text-white shadow-sm transition-colors group-hover:bg-[#0c4278]">
                    <FiPlus className="size-6 stroke-[2.8]" />
                  </div>
                </div>
              </div>

              {/* Label: Aligned horizontally on the same baseline as other labels */}
              <span
                className={`mt-1 text-[10px] tracking-tight transition-colors ${
                  active === 'new' ? 'font-bold text-[#08315c]' : 'font-medium text-slate-600'
                }`}
              >
                Tambah
              </span>
              <span
                className={`mt-1 size-1.5 rounded-full transition-all duration-200 ${
                  active === 'new' ? 'bg-[#08315c] opacity-100 scale-100' : 'bg-transparent opacity-0 scale-0'
                }`}
                aria-hidden="true"
              />
            </button>
          </div>

          {/* 4. Laporan Saya */}
          <button
            type="button"
            onClick={() => onNavigate('/mahasiswa/laporan-saya')}
            className="group flex flex-1 flex-col items-center justify-end py-1 transition-colors cursor-pointer"
            aria-label="Laporan Saya"
          >
            <div className="flex h-6 items-center justify-center">
              <FiFileText
                className={`size-5 transition-transform duration-150 group-active:scale-90 ${
                  active === 'mine' ? 'text-[#08315c] stroke-[2.5]' : 'text-slate-400'
                }`}
              />
            </div>
            <span
              className={`mt-1 text-[10px] tracking-tight transition-colors ${
                active === 'mine' ? 'font-bold text-[#08315c]' : 'font-medium text-slate-500'
              }`}
            >
              Laporan Saya
            </span>
            <span
              className={`mt-1 size-1.5 rounded-full transition-all duration-200 ${
                active === 'mine' ? 'bg-[#08315c] opacity-100 scale-100' : 'bg-transparent opacity-0 scale-0'
              }`}
              aria-hidden="true"
            />
          </button>

          {/* 5. Akun / Profil */}
          <button
            type="button"
            onClick={() => onNavigate('/mahasiswa/pengaturan')}
            className="group flex flex-1 flex-col items-center justify-end py-1 transition-colors cursor-pointer"
            aria-label="Profil dan Pengaturan Akun"
          >
            <div className="flex h-6 items-center justify-center">
              <FiUser
                className={`size-5 transition-transform duration-150 group-active:scale-90 ${
                  active === 'settings' ? 'text-[#08315c] stroke-[2.5]' : 'text-slate-400'
                }`}
              />
            </div>
            <span
              className={`mt-1 text-[10px] tracking-tight transition-colors ${
                active === 'settings' ? 'font-bold text-[#08315c]' : 'font-medium text-slate-500'
              }`}
            >
              Profil
            </span>
            <span
              className={`mt-1 size-1.5 rounded-full transition-all duration-200 ${
                active === 'settings' ? 'bg-[#08315c] opacity-100 scale-100' : 'bg-transparent opacity-0 scale-0'
              }`}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </nav>
  )
}

export default MobileBottomNav
