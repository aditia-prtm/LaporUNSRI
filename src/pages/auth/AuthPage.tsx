import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { AuthLayout } from '../../components/layout/AuthLayout'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { PasswordField } from '../../components/common/PasswordField'
import { useAuth } from '../../hooks/useAuth'
import { getProfile, loginUser, registerUser } from '../../services/authService'
import { isSupabaseConfigured } from '../../lib/supabaseClient'
import type { AuthPageKind, UserRole } from '../../types/auth'
import {
  loginSchema,
  registerSchema,
  type AuthFormData,
} from '../../schemas/auth'

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
  const [showPassword, setShowPassword] = useState(false)
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [roleRejected, setRoleRejected] = useState(false)

  // React Hook Form dengan Zod (validasi dievaluasi saat submit formulir)
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AuthFormData>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
    mode: 'onSubmit',
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      nimNip: '',
    },
  })

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

  const handleModeChange = (newMode: AuthMode) => {
    setMode(newMode)
    setError('')
    setNotice('')
    reset({
      email: '',
      password: '',
      fullName: '',
      nimNip: '',
    })
  }

  const onFormSubmit = async (data: AuthFormData) => {
    setError('')
    setNotice('')
    setRoleRejected(false)

    if (!isSupabaseConfigured) {
      setError(
        'Supabase belum dikonfigurasi. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di file .env.'
      )
      return
    }

    setBusy(true)
    try {
      if (mode === 'register') {
        const role = officerPage ? 'petugas' : 'mahasiswa'
        await registerUser(
          data.email,
          data.password,
          data.fullName ?? '',
          role,
          data.nimNip ?? ''
        )
        setNotice(
          `Pendaftaran berhasil dikirim. Buka tautan konfirmasi yang kami kirim ke ${data.email} untuk mengaktifkan akun.`
        )
        handleModeChange('login')
        return
      }

      const { user } = await loginUser(data.email, data.password)
      if (!user) throw new Error('Sesi login tidak ditemukan. Silakan coba lagi.')

      const nextProfile = await getProfile(user.id)
      if (officerPage && nextProfile.role !== 'petugas') {
        setRoleRejected(true)
        await signOut()
        throw new Error(
          'Halaman ini khusus akun petugas. Gunakan halaman login pengguna untuk akun mahasiswa atau admin.'
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
      {/* Heading & Subtitle */}
      <div className="mb-6">
        <h2 className="text-2xl sm:text-[28px] font-bold text-white tracking-tight">
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
        <p className="mt-1.5 text-sm text-sky-100/85">
          {mode === 'login' ? (
            <>
              Masuk ke akun <strong className="font-semibold text-[#ffbb00]">LaporUNSRI</strong> Anda
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
        <div className="py-12 text-center text-sm text-sky-100/80" role="status">
          Sedang memeriksa sesi akun...
        </div>
      ) : profile ? (
        <div className="py-12 text-center text-sm text-sky-100/80" role="status">
          Mengarahkan ke dashboard {roleLabel(profile.role)}...
        </div>
      ) : (
        <form
          className="space-y-4"
          onSubmit={(event) => void handleSubmit(onFormSubmit)(event)}
          noValidate
        >
          {mode === 'register' && (
            <>
              <label className="flex flex-col gap-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-200/80">
                  Nama Lengkap
                </span>
                <input
                  required
                  autoComplete="name"
                  {...register('fullName')}
                  placeholder="Nama kamu"
                  className={`h-12 w-full rounded-xl border bg-white/10 px-4 text-sm text-white placeholder:text-sky-200/50 focus:bg-white/15 focus:outline-none transition ${
                    errors.fullName
                      ? 'border-rose-400/80 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/25'
                      : 'border-white/20 focus:border-[#ffbb00] focus:ring-2 focus:ring-[#ffbb00]/25'
                  }`}
                />
                {errors.fullName && (
                  <span className="text-[11px] font-medium text-rose-300 mt-0.5 flex items-center gap-1">
                    <span>•</span> {errors.fullName.message}
                  </span>
                )}
              </label>

              <label className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-200/80">
                    {officerPage ? 'NIP' : 'NIM'}
                  </span>
                  <span className="text-[11px] text-sky-200/60">Opsional</span>
                </div>
                <input
                  autoComplete="off"
                  {...register('nimNip')}
                  placeholder={officerPage ? 'Nomor Induk Pegawai' : 'Nomor Induk Mahasiswa'}
                  className="h-12 w-full rounded-xl border border-white/20 bg-white/10 px-4 text-sm text-white placeholder:text-sky-200/50 focus:bg-white/15 focus:border-[#ffbb00] focus:outline-none focus:ring-2 focus:ring-[#ffbb00]/25 transition"
                />
              </label>
            </>
          )}

          {/* Email Field */}
          <label className="flex flex-col gap-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-sky-200/80">
              Email
            </span>
            <input
              required
              type="email"
              autoComplete="email"
              {...register('email')}
              placeholder="contoh@mhs.unsri.ac.id"
              className={`h-12 w-full rounded-xl border bg-white/10 px-4 text-sm text-white placeholder:text-sky-200/50 focus:bg-white/15 focus:outline-none transition ${
                errors.email
                  ? 'border-rose-400/80 focus:border-rose-400 focus:ring-2 focus:ring-rose-400/25'
                  : 'border-white/20 focus:border-[#ffbb00] focus:ring-2 focus:ring-[#ffbb00]/25'
              }`}
            />
            {errors.email && (
              <span className="text-[11px] font-medium text-rose-300 mt-0.5 flex items-center gap-1">
                <span>•</span> {errors.email.message}
              </span>
            )}
          </label>

          {/* Password Field */}
          <div>
            <PasswordField
              mode={mode}
              visible={showPassword}
              onToggleVisibility={() => setShowPassword((visible) => !visible)}
              registration={register('password')}
              error={errors.password?.message}
            />
            {mode === 'login' && (
              <div className="mt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => alert('Fitur reset password dapat dilakukan melalui email konfirmasi Supabase.')}
                  className="text-xs font-semibold text-[#ffbb00] hover:underline cursor-pointer"
                >
                  Lupa password?
                </button>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="w-full h-12 rounded-2xl bg-white hover:bg-sky-50 text-[#0c4278] font-bold text-sm transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.99] mt-3 cursor-pointer shadow-lg shadow-black/25 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={busy || !isSupabaseConfigured}
          >
            {busy ? 'Memproses...' : mode === 'login' ? 'Masuk' : 'Daftar Sekarang'}
          </button>

          {/* Mode Switcher */}
          {!officerPage && (
            <div className="mt-4 text-center text-xs sm:text-sm text-sky-100/80">
              {mode === 'login' ? (
                <>
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('register')}
                    className="font-semibold text-[#ffbb00] hover:underline cursor-pointer"
                  >
                    Daftar sekarang
                  </button>
                </>
              ) : (
                <>
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => handleModeChange('login')}
                    className="font-semibold text-[#ffbb00] hover:underline cursor-pointer"
                  >
                    Masuk
                  </button>
                </>
              )}
            </div>
          )}

          {/* Officer Portal Switcher Link */}
          <div className="mt-6 pt-5 border-t border-white/15 text-center text-xs text-sky-100/80">
            {officerPage ? (
              <div>
                Bukan petugas sarpras?{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('/auth')}
                  className="font-semibold text-[#ffbb00] hover:underline cursor-pointer"
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
                  className="font-semibold text-[#ffbb00] hover:underline cursor-pointer"
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
