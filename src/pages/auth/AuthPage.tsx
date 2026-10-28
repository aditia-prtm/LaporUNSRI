import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { PasswordField } from '../../components/common/PasswordField'
import { useAuth } from '../../hooks/useAuth'
import { getProfile, loginUser, registerUser } from '../../services/authService'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import type { AuthPageKind, UserRole } from '../../types/auth'
import { FiArrowRight, FiLock, FiMail, FiUser } from 'react-icons/fi'

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
    // A newly authenticated session can arrive before submit() checks its role.
    if (loading || busy || roleRejected || !profile) return
    const destination = profile.role === 'admin'
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
      setError('Supabase belum dikonfigurasi. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di file .env.')
      return
    }

    setBusy(true)
    try {
      if (mode === 'register') {
        const role = officerPage ? 'petugas' : 'mahasiswa'
        await registerUser(email, password, fullName, role, nimNip)
        setNotice(`Pendaftaran berhasil dikirim. Buka tautan konfirmasi yang kami kirim ke ${email} untuk mengaktifkan akun.`)
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
        throw new Error('Halaman ini khusus akun petugas. Gunakan halaman login pengguna untuk akun mahasiswa atau admin.')
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

  const title = officerPage ? 'Portal Petugas' : 'Selamat Datang'

  return (
    <AuthLayout officerPage={officerPage} onNavigate={onNavigate}>
      <div className="relative rounded-3xl border border-white/12 bg-[#051c36]/75 p-6 sm:p-8 backdrop-blur-xl shadow-2xl shadow-black/50">
        {/* Header inside Card */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#60b6ff]">
              {officerPage ? 'Akses Khusus Petugas' : 'Autentikasi Kampus'}
            </span>
            {officerPage && (
              <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-300">
                Staff Only
              </span>
            )}
          </div>
          <h2 className="mt-2 font-['Poppins','Montserrat','Outfit',sans-serif] text-2xl font-bold tracking-tight text-white">
            {loading ? 'Memeriksa sesi...' : profile ? 'Membuka dashboard...' : mode === 'login' ? title : 'Buat Akun Baru'}
          </h2>
          <p className="mt-1 text-xs leading-relaxed text-[#8cb6dc]">
            {profile
              ? 'Anda akan diarahkan ke halaman sesuai role akun Anda.'
              : mode === 'login'
                ? (officerPage ? 'Masuk untuk mengelola laporan yang ditugaskan kepada Anda.' : 'Masuk untuk membuat laporan dan memantau perkembangannya.')
                : 'Lengkapi formulir di bawah ini untuk mendaftar akun baru.'}
          </p>
        </div>

        {/* Tab switch for User Login/Register */}
        {!officerPage && !profile && !loading && (
          <div className="mb-6 grid grid-cols-2 rounded-xl border border-white/10 bg-[#031122]/60 p-1">
            <button
              type="button"
              className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#60b6ff] to-[#3a93e8] text-[#021427] shadow-sm'
                  : 'text-[#8cb6dc] hover:text-white'
              }`}
              onClick={() => {
                setMode('login')
                setError('')
                setNotice('')
              }}
            >
              Masuk
            </button>
            <button
              type="button"
              className={`rounded-lg py-2 text-xs font-semibold transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#60b6ff] to-[#3a93e8] text-[#021427] shadow-sm'
                  : 'text-[#8cb6dc] hover:text-white'
              }`}
              onClick={() => {
                setMode('register')
                setError('')
                setNotice('')
              }}
            >
              Daftar Akun
            </button>
          </div>
        )}

        {notice && <FeedbackMessage tone="success">{notice}</FeedbackMessage>}
        {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}

        {loading ? (
          <div className="flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-6 text-xs text-[#8cb6dc]" role="status">
            <span className="size-2 animate-ping rounded-full bg-[#60b6ff]" />
            <span>Sedang memeriksa sesi akun...</span>
          </div>
        ) : profile ? (
          <div className="flex items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 py-6 text-xs text-[#8cb6dc]" role="status">
            <span className="size-2 animate-ping rounded-full bg-[#34d399]" />
            <span>Mengarahkan ke dashboard {roleLabel(profile.role)}...</span>
          </div>
        ) : (
          <>
            {!isSupabaseConfigured && (
              <FeedbackMessage tone="warning">
                Supabase belum dikonfigurasi. Lengkapi URL dan publishable key di file .env.
              </FeedbackMessage>
            )}

            <form className="space-y-4" onSubmit={(event) => void submit(event)}>
              {mode === 'register' && (
                <>
                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#cce5fb]">
                    <span>Nama Lengkap</span>
                    <div className="relative">
                      <input
                        required
                        autoComplete="name"
                        value={fullName}
                        onChange={(event) => setFullName(event.target.value)}
                        placeholder="Nama lengkap Anda"
                        className="h-11 w-full rounded-xl border border-white/15 bg-[#031528]/80 px-3.5 pr-10 text-xs text-white placeholder:text-[#8cb6dc]/50 backdrop-blur-md transition-all focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 hover:border-white/25"
                      />
                      <FiUser className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8cb6dc]" />
                    </div>
                  </label>

                  <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#cce5fb]">
                    <div className="flex items-center justify-between">
                      <span>{officerPage ? 'NIP' : 'NIM'}</span>
                      <span className="text-[10px] font-normal text-[#8cb6dc]/70">Opsional</span>
                    </div>
                    <input
                      autoComplete="off"
                      value={nimNip}
                      onChange={(event) => setNimNip(event.target.value)}
                      placeholder={officerPage ? 'Nomor Induk Pegawai' : 'Nomor Induk Mahasiswa'}
                      className="h-11 w-full rounded-xl border border-white/15 bg-[#031528]/80 px-3.5 text-xs text-white placeholder:text-[#8cb6dc]/50 backdrop-blur-md transition-all focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 hover:border-white/25"
                    />
                  </label>
                </>
              )}

              <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#cce5fb]">
                <span>Alamat Email</span>
                <div className="relative">
                  <input
                    required
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="nama@unsri.ac.id atau nama@email.com"
                    className="h-11 w-full rounded-xl border border-white/15 bg-[#031528]/80 px-3.5 pr-10 text-xs text-white placeholder:text-[#8cb6dc]/50 backdrop-blur-md transition-all focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 hover:border-white/25"
                  />
                  <FiMail className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-sm text-[#8cb6dc]" />
                </div>
              </label>

              <PasswordField
                value={password}
                onChange={setPassword}
                mode={mode}
                visible={showPassword}
                onToggleVisibility={() => setShowPassword((visible) => !visible)}
              />

              <button
                type="submit"
                className="group relative mt-2 flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#60b6ff] via-[#48a6ff] to-[#2b8ced] px-5 text-sm font-bold text-[#021427] shadow-[0_4px_20px_rgba(58,147,232,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(58,147,232,0.6)] hover:brightness-105 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                disabled={busy || !isSupabaseConfigured}
              >
                <span>{busy ? 'Memproses...' : mode === 'login' ? 'Masuk ke Akun' : 'Daftarkan Akun'}</span>
                {!busy && <FiArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />}
              </button>
            </form>

            {!officerPage && (
              <div className="mt-5 rounded-xl border border-white/10 bg-[#031224]/60 p-3 text-center text-xs leading-relaxed text-[#8cb6dc]">
                Akun administrator universitas masuk melalui form ini menggunakan kredensial admin.
              </div>
            )}
          </>
        )}

        {/* Security Footer */}
        <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/10 pt-4 text-[11px] text-[#8cb6dc]">
          <FiLock className="size-3 text-[#60b6ff]" />
          <span>Koneksi aman & data akun terenkripsi</span>
        </div>
      </div>
    </AuthLayout>
  )
}
