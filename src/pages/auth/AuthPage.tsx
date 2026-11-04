import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { PasswordField } from '../../components/common/PasswordField'
import { useAuth } from '../../hooks/useAuth'
import { getProfile, loginUser, registerUser } from '../../services/authService'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import type { AuthPageKind, UserRole } from '../../types/auth'

type AuthPageProps = {
  kind: AuthPageKind
  onNavigate: (path: string) => void
}

type AuthMode = 'login' | 'register'

function roleLabel(role: UserRole) {
  if (role === 'mahasiswa') return 'Mahasiswa'
  if (role === 'petugas') return 'Petugas'
  return 'Admin'
}

export function AuthPage({ kind, onNavigate }: AuthPageProps) {
  const officerPage = kind === 'officer'
  const { profile, loading, signOut } = useAuth()
  const [mode, setMode] = useState<AuthMode>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [nimNip, setNimNip] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [roleRejected, setRoleRejected] = useState(false)

  useEffect(() => {
    if (loading || busy || roleRejected || !profile) return
    const destination =
      profile.role === 'admin'
        ? '/admin/dashboard'
        : profile.role === 'petugas'
          ? '/petugas/dashboard'
          : '/mahasiswa'
    onNavigate(destination)
  }, [loading, busy, roleRejected, profile, onNavigate])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')
    setRoleRejected(false)

    if (!isSupabaseConfigured) {
      setError(
        'Supabase belum dikonfigurasi. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di file .env.',
      )
      return
    }

    setBusy(true)
    try {
      if (mode === 'register') {
        const role = officerPage ? 'petugas' : 'mahasiswa'
        await registerUser(email, password, fullName, role, nimNip)
        setNotice(
          `Pendaftaran berhasil dikirim. Buka tautan konfirmasi yang kami kirim ke ${email} untuk mengaktifkan akun.`,
        )
        setMode('login')
        setPassword('')
        return
      }

      const { user } = await loginUser(email, password)
      if (!user) throw new Error('Sesi login tidak ditemukan. Silakan coba lagi.')

      const nextProfile = await getProfile(user.id)
      if (officerPage && nextProfile.role !== 'petugas') {
        setRoleRejected(true)
        await signOut()
        throw new Error(
          'Halaman ini khusus akun petugas. Gunakan halaman login pengguna untuk akun mahasiswa atau admin.',
        )
      }
      if (!officerPage && nextProfile.role === 'petugas') {
        setRoleRejected(true)
        await signOut()
        throw new Error('Akun petugas harus masuk melalui URL /petugas.')
      }

      setNotice(`Berhasil masuk sebagai ${roleLabel(nextProfile.role)}.`)
      if (officerPage && nextProfile.role === 'petugas') onNavigate('/petugas/dashboard')
      else if (nextProfile.role === 'mahasiswa') onNavigate('/mahasiswa')
      else if (!officerPage && nextProfile.role === 'admin') onNavigate('/admin/dashboard')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthLayout officerPage={officerPage} onNavigate={onNavigate}>
      {/* Heading & Subtitle exactly matching reference */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-[28px] font-bold text-slate-900 tracking-tight">
          {loading
            ? 'Memeriksa sesi...'
            : profile
              ? 'Membuka dashboard...'
              : mode === 'login'
                ? officerPage
                  ? 'Portal Petugas'
                  : 'Selamat Datang'
                : 'Buat Akun LaporUNSRI'}
        </h2>
        <p className="mt-1.5 text-sm text-slate-500">
          {mode === 'login' ? (
            <>
              Masuk ke akun <strong className="font-semibold text-[#0c4278]">LaporUNSRI</strong> Anda
            </>
          ) : (
            'Daftar gratis dan mulai kawal fasilitas kampus'
          )}
        </p>
      </div>

      {/* Notifications */}
      {notice && (
        <div className="mb-4">
          <FeedbackMessage tone="success">{notice}</FeedbackMessage>
        </div>
      )}
      {error && (
        <div className="mb-4">
          <FeedbackMessage tone="error">{error}</FeedbackMessage>
        </div>
      )}

      {/* Form or Sesi Checking */}
      {loading ? (
        <div className="py-12 text-center text-sm text-slate-500" role="status">
          Sedang memeriksa sesi akun...
        </div>
      ) : profile ? (
        <div className="py-12 text-center text-sm text-slate-500" role="status">
          Mengarahkan ke dashboard {roleLabel(profile.role)}...
        </div>
      ) : (
        <form className="space-y-4" onSubmit={(event) => void submit(event)}>
          {mode === 'register' && (
            <>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                  Nama Lengkap
                </span>
                <input
                  required
                  autoComplete="name"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Nama kamu"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-[#f9fafb] px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0c4278] focus:outline-none focus:ring-2 focus:ring-[#0c4278]/20 transition"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    {officerPage ? 'NIP' : 'NIM'}
                  </span>
                  <span className="text-[11px] text-slate-400">Opsional</span>
                </div>
                <input
                  autoComplete="off"
                  value={nimNip}
                  onChange={(event) => setNimNip(event.target.value)}
                  placeholder={officerPage ? 'Nomor Induk Pegawai' : 'Nomor Induk Mahasiswa'}
                  className="h-12 w-full rounded-xl border border-slate-200 bg-[#f9fafb] px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0c4278] focus:outline-none focus:ring-2 focus:ring-[#0c4278]/20 transition"
                />
              </label>
            </>
          )}

          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
              Email
            </span>
            <input
              required
              type="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="contoh@email.com"
              className="h-12 w-full rounded-xl border border-slate-200 bg-[#f9fafb] px-4 text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#0c4278] focus:outline-none focus:ring-2 focus:ring-[#0c4278]/20 transition"
            />
          </label>

          <div>
            <PasswordField
              value={password}
              onChange={setPassword}
              mode={mode}
              visible={showPassword}
              onToggleVisibility={() => setShowPassword((visible) => !visible)}
            />
            {mode === 'login' && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Fitur reset password dapat dilakukan melalui email konfirmasi Supabase.')}
                  className="text-xs font-semibold text-[#0c4278] hover:underline"
                >
                  Lupa password?
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-[#0c4278] hover:bg-[#08315c] text-white font-semibold text-sm transition active:scale-[0.99] mt-3 cursor-pointer shadow-md shadow-[#0c4278]/20 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={busy || !isSupabaseConfigured}
          >
            {busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
          </button>

          {/* Mode Switcher matching screenshot exactly */}
          {!officerPage && (
            <div className="mt-4 text-center text-xs sm:text-sm text-slate-500">
              {mode === 'login' ? (
                <>
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('register')
                      setError('')
                      setNotice('')
                    }}
                    className="font-semibold text-[#0c4278] hover:underline cursor-pointer"
                  >
                    Daftar sekarang
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      setMode('login')
                      setError('')
                      setNotice('')
                    }}
                    className="font-semibold text-[#0c4278] hover:underline cursor-pointer"
                  >
                    Masuk
                  </button>
                </>
              )}
            </div>
          )}

          {/* Officer Portal Switcher Link */}
          <div className="mt-6 pt-5 border-t border-slate-100 text-center text-xs text-slate-500">
            {officerPage ? (
              <div>
                Bukan petugas sarpras?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/auth')}
                  className="font-semibold text-[#0c4278] hover:underline cursor-pointer"
                >
                  Masuk sebagai Mahasiswa
                </button>
              </div>
            ) : (
              <div>
                Petugas sarpras?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/petugas')}
                  className="font-semibold text-[#0c4278] hover:underline cursor-pointer"
                >
                  Portal Petugas →
                </button>
              </div>
            )}
          </div>
        </form>
      )}
    </AuthLayout>
  )
}
