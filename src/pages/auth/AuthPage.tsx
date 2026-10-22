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
    // A newly authenticated session can arrive before submit() checks its role.
    // Wait until login validation finishes so a wrong-role account is rejected
    // on the page where it attempted to sign in.
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
        throw new Error('Halaman ini hanya untuk akun petugas. Gunakan halaman login pengguna untuk akun mahasiswa atau admin.')
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

  const title = officerPage ? 'Portal petugas' : 'Selamat datang kembali'

  return (
    <AuthLayout officerPage={officerPage} onNavigate={onNavigate}>
      <div className="auth-card">
        <div className="auth-heading">
          <span className="eyebrow">{officerPage ? 'Akses petugas' : 'Akun LaporUnsri'}</span>
          <h2>{loading ? 'Memeriksa sesi…' : profile ? 'Membuka dashboard' : mode === 'login' ? title : 'Buat akun baru'}</h2>
          <p>{profile ? 'Anda akan diarahkan ke halaman sesuai role akun.' : mode === 'login' ? (officerPage ? 'Masuk untuk mengelola laporan yang ditugaskan.' : 'Masuk untuk mengirim dan memantau laporan.') : 'Konfirmasi email diperlukan sebelum Anda bisa masuk.'}</p>
        </div>

        {notice && <FeedbackMessage tone="success">{notice}</FeedbackMessage>}
        {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}

        {loading ? <div className="message message-warning" role="status">Sedang memeriksa sesi akun…</div> : profile ? (
          <div className="message message-warning" role="status">Mengarahkan ke dashboard {roleLabel(profile.role)}…</div>
        ) : <>
          {!isSupabaseConfigured && <FeedbackMessage tone="warning">Supabase belum dikonfigurasi. Lengkapi URL dan publishable key di file .env untuk mengaktifkan autentikasi.</FeedbackMessage>}
          <form className="auth-form" onSubmit={(event) => void submit(event)}>
            {mode === 'register' && <>
              <label>Nama lengkap<input required autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Nama Anda" /></label>
              <label>{officerPage ? 'NIP' : 'NIM'}<span className="optional-label">Opsional</span><input autoComplete="off" value={nimNip} onChange={(event) => setNimNip(event.target.value)} placeholder={officerPage ? 'Nomor induk pegawai' : 'Nomor induk mahasiswa'} /></label>
            </>}
            <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" /></label>
            <PasswordField
              value={password}
              onChange={setPassword}
              mode={mode}
              visible={showPassword}
              onToggleVisibility={() => setShowPassword((visible) => !visible)}
            />
            <button className="button button-primary submit-button" disabled={busy || !isSupabaseConfigured}>
              {busy ? 'Mohon tunggu…' : mode === 'login' ? 'Masuk' : 'Daftar'}
            </button>
          </form>
          <p className="auth-switch">
            {mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'}{' '}
            <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setNotice(''); setError('') }}>
              {mode === 'login' ? 'Daftar sekarang' : 'Masuk'}
            </button>
          </p>
          {!officerPage && <p className="admin-hint">Akun admin masuk melalui halaman ini menggunakan akun admin yang sudah dibuat.</p>}
        </>}

        <div className="auth-footnote"><span className="lock-icon">&#9633;</span> Data akun tersimpan dengan aman.</div>
      </div>
    </AuthLayout>
  )
}
