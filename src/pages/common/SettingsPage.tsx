import { useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types/auth'
import { updateProfile, updatePassword } from '../../services/authService'
import { useAuth } from '../../hooks/useAuth'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { formatDateTime } from '../../utils/date'
import {
  FiArrowLeft,
  FiCheck,
  FiEye,
  FiEyeOff,
  FiKey,
  FiLock,
  FiLogOut,
  FiMail,
  FiShield,
  FiUser,
} from 'react-icons/fi'

type SettingsPageProps = {
  profile: UserProfile
  onNavigate: (path: string) => void
  onSignOut: () => void
}

export function SettingsPage({ profile, onNavigate, onSignOut }: SettingsPageProps) {
  const { refreshProfile } = useAuth()

  // State Profile Form
  const [fullName, setFullName] = useState(profile.full_name || '')
  const [nimNip, setNimNip] = useState(profile.nim_nip || '')
  const [savingProfile, setSavingProfile] = useState(false)
  const [profileSuccess, setProfileSuccess] = useState('')
  const [profileError, setProfileError] = useState('')

  // State Password Form
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [savingPassword, setSavingPassword] = useState(false)
  const [passwordSuccess, setPasswordSuccess] = useState('')
  const [passwordError, setPasswordError] = useState('')

  // State Sign Out Confirmation
  const [signingOut, setSigningOut] = useState(false)

  const defaultBackPath =
    profile.role === 'petugas'
      ? '/petugas/dashboard'
      : profile.role === 'admin'
        ? '/admin'
        : '/mahasiswa'

  const avatarLetter = (fullName || profile.full_name || 'U').slice(0, 1).toUpperCase()

  const handleUpdateProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!fullName.trim()) {
      setProfileError('Nama lengkap wajib diisi.')
      return
    }

    setSavingProfile(true)
    setProfileError('')
    setProfileSuccess('')
    try {
      await updateProfile(profile.id, {
        full_name: fullName.trim(),
        nim_nip: nimNip.trim() || null,
      })
      await refreshProfile()
      setProfileSuccess('Perubahan profil berhasil disimpan!')
    } catch (cause) {
      setProfileError(cause instanceof Error ? cause.message : 'Gagal memperbarui profil.')
    } finally {
      setSavingProfile(false)
    }
  }

  const handleUpdatePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (newPassword.length < 6) {
      setPasswordError('Kata sandi baru minimal 6 karakter.')
      return
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok.')
      return
    }

    setSavingPassword(true)
    setPasswordError('')
    setPasswordSuccess('')
    try {
      await updatePassword(newPassword)
      setPasswordSuccess('Kata sandi berhasil diperbarui!')
      setNewPassword('')
      setConfirmPassword('')
    } catch (cause) {
      setPasswordError(cause instanceof Error ? cause.message : 'Gagal mengubah kata sandi.')
    } finally {
      setSavingPassword(false)
    }
  }

  const handleSignOutClick = () => {
    if (window.confirm('Apakah Anda yakin ingin keluar dari akun LaporUNSRI?')) {
      setSigningOut(true)
      onSignOut()
    }
  }

  return (
    <div className="w-full flex flex-col">
      {/* Navy Top Banner */}
      <section className="w-full bg-[#08315c] text-white px-4 sm:px-8 lg:px-12 py-8 shadow-inner">
        <div className="mx-auto max-w-[880px] space-y-3">
          <button
            type="button"
            onClick={() => onNavigate(defaultBackPath)}
            className="inline-flex min-h-[38px] items-center gap-2 text-xs font-semibold text-sky-200 hover:text-white transition cursor-pointer"
          >
            <FiArrowLeft className="size-4" aria-hidden="true" />
            <span>Kembali ke Beranda</span>
          </button>

          <div>
            <span className="rounded-full bg-white/10 border border-white/20 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ffbb00]">
              Akun & Privasi
            </span>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Pengaturan Profil
            </h1>
            <p className="mt-1 text-xs text-sky-100/80 max-w-xl">
              Perbarui data identitas Anda, ganti kata sandi, dan kelola sesi akses akun LaporUNSRI.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form Area */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-8">
        <div className="mx-auto max-w-[880px] space-y-7">
          {/* Overview Profile Card */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-7 shadow-sm">
            <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-[#ffbb00] text-3xl font-extrabold text-[#08315c] shadow-md select-none">
              {avatarLetter}
            </div>
            <div className="space-y-1.5 text-center sm:text-left min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
                  {fullName || profile.full_name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 border border-sky-200 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-sky-700">
                  <FiShield className="size-3" />
                  <span>
                    {profile.role === 'petugas'
                      ? 'Petugas Sarpras'
                      : profile.role === 'admin'
                        ? 'Administrator'
                        : 'Mahasiswa UNSRI'}
                  </span>
                </span>
              </div>
              <p className="text-xs text-slate-500">
                {profile.email ?? 'Akun Terautentikasi'} · {nimNip ? `NIM/NIP: ${nimNip}` : 'NIM/NIP belum diisi'}
              </p>
              {profile.created_at && (
                <p className="text-[11px] text-slate-400">
                  Terdaftar sejak {formatDateTime(profile.created_at)}
                </p>
              )}
            </div>
          </div>

          {/* Section 1: Edit Data Diri */}
          <article className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FiUser className="size-4 text-[#08315c]" />
                <span>Informasi Data Diri</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Data ini digunakan pada tanda pengenal saat membuat atau menindaklanjuti laporan sarana kampus.
              </p>
            </div>

            {profileError && <FeedbackMessage tone="error">{profileError}</FeedbackMessage>}
            {profileSuccess && <FeedbackMessage tone="success">{profileSuccess}</FeedbackMessage>}

            <form onSubmit={(e) => void handleUpdateProfile(e)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs font-semibold text-slate-700">
                  <span className="mb-1 block text-[11px] text-slate-500">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </span>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Contoh: Muhammad Aditia Pratama"
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/15 transition"
                  />
                </label>

                <label className="block text-xs font-semibold text-slate-700">
                  <span className="mb-1 block text-[11px] text-slate-500">
                    {profile.role === 'petugas' ? 'NIP / ID Pegawai' : 'NIM (Nomor Induk Mahasiswa)'}
                  </span>
                  <input
                    type="text"
                    value={nimNip}
                    onChange={(e) => setNimNip(e.target.value)}
                    placeholder={profile.role === 'petugas' ? 'Contoh: 198501012010121001' : 'Contoh: 09021282227045'}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/15 transition"
                  />
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs font-semibold text-slate-700">
                  <span className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <FiMail className="size-3 text-slate-400" />
                      <span>Alamat Email</span>
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                      <FiLock className="size-2.5" /> Terkunci
                    </span>
                  </span>
                  <input
                    disabled
                    type="email"
                    value={profile.email ?? ''}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs text-slate-500 cursor-not-allowed shadow-inner"
                  />
                </label>

                <label className="block text-xs font-semibold text-slate-700">
                  <span className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="inline-flex items-center gap-1">
                      <FiShield className="size-3 text-slate-400" />
                      <span>Hak Akses Akun</span>
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] text-slate-400">
                      <FiLock className="size-2.5" /> Terkunci
                    </span>
                  </span>
                  <input
                    disabled
                    type="text"
                    value={
                      profile.role === 'petugas'
                        ? 'Petugas Sarpras UNSRI'
                        : profile.role === 'admin'
                          ? 'Administrator Sistem'
                          : 'Mahasiswa UNSRI'
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-xs text-slate-500 cursor-not-allowed shadow-inner"
                  />
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#08315c] hover:bg-[#0c4278] px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FiCheck className="size-4 stroke-[3]" aria-hidden="true" />
                  <span>{savingProfile ? 'Menyimpan...' : 'Simpan Perubahan Profil'}</span>
                </button>
              </div>
            </form>
          </article>

          {/* Section 2: Keamanan Kata Sandi */}
          <article className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <FiKey className="size-4 text-[#08315c]" />
                <span>Ubah Kata Sandi</span>
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Gunakan kata sandi yang aman dan tidak digunakan di situs lain.
              </p>
            </div>

            {passwordError && <FeedbackMessage tone="error">{passwordError}</FeedbackMessage>}
            {passwordSuccess && <FeedbackMessage tone="success">{passwordSuccess}</FeedbackMessage>}

            <form onSubmit={(e) => void handleUpdatePassword(e)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="block text-xs font-semibold text-slate-700">
                  <span className="mb-1 block text-[11px] text-slate-500">Kata Sandi Baru</span>
                  <div className="relative">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Minimal 6 karakter..."
                      className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 pr-10 text-xs text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/15 transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                      aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                    >
                      {showPassword ? <FiEyeOff className="size-4" /> : <FiEye className="size-4" />}
                    </button>
                  </div>
                </label>

                <label className="block text-xs font-semibold text-slate-700">
                  <span className="mb-1 block text-[11px] text-slate-500">Konfirmasi Kata Sandi Baru</span>
                  <input
                    required
                    type={showPassword ? 'text' : 'password'}
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru..."
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-xs text-slate-800 placeholder:text-slate-400 shadow-sm focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/15 transition"
                  />
                </label>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={savingPassword || !newPassword}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-slate-800 hover:bg-slate-900 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FiKey className="size-4" aria-hidden="true" />
                  <span>{savingPassword ? 'Memproses...' : 'Perbarui Kata Sandi'}</span>
                </button>
              </div>
            </form>
          </article>

          {/* Section 3: Zona Keluar Akun (Logout) */}
          <article className="rounded-3xl border border-rose-200 bg-rose-50/40 p-6 sm:p-8 shadow-sm space-y-4">
            <div>
              <h3 className="text-base font-bold text-rose-800 flex items-center gap-2">
                <FiLogOut className="size-4 text-rose-600" />
                <span>Keluar dari Akun</span>
              </h3>
              <p className="text-xs text-rose-700/80 mt-1 leading-relaxed">
                Keluar dari akun Anda pada perangkat ini. Anda perlu masuk kembali menggunakan email dan kata sandi Anda untuk mengakses platform LaporUNSRI.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                disabled={signingOut}
                onClick={handleSignOutClick}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-rose-600 hover:bg-rose-700 px-6 py-2.5 text-xs font-bold text-white shadow-sm transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <FiLogOut className="size-4" aria-hidden="true" />
                <span>{signingOut ? 'Sedang keluar...' : 'Keluar dari Akun'}</span>
              </button>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}
export default SettingsPage

