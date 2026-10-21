import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { FiEye, FiEyeOff } from 'react-icons/fi'
import {
  getProfile,
  loginUser,
  logoutUser,
  registerUser,
  type UserRole,
} from './services/authService'
import { isSupabaseConfigured, supabase } from './lib/supabaseClient'
import './App.css'

type Page = 'home' | 'user-auth' | 'officer-auth'
type AuthMode = 'login' | 'register'
type Profile = { full_name: string; role: UserRole }

function pageFromPath(path: string): Page {
  if (path === '/auth') return 'user-auth'
  if (path === '/petugas') return 'officer-auth'
  return 'home'
}

function roleLabel(role: UserRole) {
  if (role === 'mahasiswa') return 'Mahasiswa'
  if (role === 'petugas') return 'Petugas'
  return 'Admin'
}

export default function App() {
  const [page, setPage] = useState<Page>(() => pageFromPath(window.location.pathname))
  const [mode, setMode] = useState<AuthMode>('login')
  const [profile, setProfile] = useState<Profile | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [fullName, setFullName] = useState('')
  const [nimNip, setNimNip] = useState('')
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const navigate = (path: string) => {
    window.history.pushState({}, '', path)
    setPage(pageFromPath(path))
    setMode('login')
    setNotice('')
    setError('')
  }

  useEffect(() => {
    const onPopState = () => {
      setPage(pageFromPath(window.location.pathname))
      setMode('login')
      setNotice('')
      setError('')
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (!isSupabaseConfigured) return
    let active = true
    const syncProfile = async (userId: string) => {
      try {
        const nextProfile = await getProfile(userId)
        if (active) setProfile(nextProfile)
      } catch {
        if (active) setProfile(null)
      }
    }
    void supabase.auth.getSession().then(({ data }) => {
      if (!active) return
      if (data.session) void syncProfile(data.session.user.id)
      else setProfile(null)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setProfile(null)
        return
      }
      window.setTimeout(() => void syncProfile(session.user.id), 0)
    })
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    setNotice('')
    if (!isSupabaseConfigured) {
      setError('Supabase belum dikonfigurasi. Periksa VITE_SUPABASE_URL dan VITE_SUPABASE_PUBLISHABLE_KEY di file .env.')
      return
    }
    setBusy(true)
    try {
      if (mode === 'register') {
        const role = page === 'officer-auth' ? 'petugas' : 'mahasiswa'
        await registerUser(email, password, fullName, role, nimNip)
        setNotice(`Pendaftaran berhasil dikirim. Buka tautan konfirmasi yang kami kirim ke ${email} untuk mengaktifkan akun.`)
        setMode('login')
        setPassword('')
      } else {
        const { user } = await loginUser(email, password)
        if (!user) throw new Error('Sesi login tidak ditemukan. Silakan coba lagi.')
        const nextProfile = await getProfile(user.id)
        const expectedRole = page === 'officer-auth' ? 'petugas' : undefined
        if (expectedRole && nextProfile.role !== expectedRole) {
          await logoutUser()
          throw new Error('Halaman ini hanya untuk akun petugas. Gunakan halaman login pengguna untuk akun mahasiswa atau admin.')
        }
        if (!expectedRole && nextProfile.role === 'petugas') {
          await logoutUser()
          throw new Error('Akun petugas harus masuk melalui URL /petugas.')
        }
        setProfile(nextProfile)
        setNotice(`Berhasil masuk sebagai ${roleLabel(nextProfile.role)}.`)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setBusy(false)
    }
  }

  const signOut = async () => {
    try {
      await logoutUser()
      setProfile(null)
      setNotice('Anda sudah keluar dari akun.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Tidak dapat keluar dari akun.')
    }
  }

  if (page === 'home') {
    return (
      <main className="landing-page">
        <header className="site-header">
          <a className="brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }} aria-label="LaporUnsri beranda">
            <span className="brand-mark" aria-hidden="true">L</span>
            <span>Lapor<span className="brand-accent">Unsri</span></span>
          </a>
          <button className="button button-outline header-action" onClick={() => navigate('/auth')}>Masuk</button>
        </header>

        <section className="hero-section">
          <div className="hero-copy">
            <span className="eyebrow"><span className="status-dot" /> Layanan aspirasi kampus UNSRI</span>
            <h1>Temukan masalah.<br /><span>Sampaikan laporannya.</span></h1>
            <p className="hero-description">Bantu wujudkan lingkungan kampus yang lebih nyaman. Laporkan fasilitas yang perlu diperbaiki dan pantau tindak lanjutnya.</p>
            <div className="hero-actions">
              <button className="button button-primary" onClick={() => navigate('/auth')}>Buat laporan <span aria-hidden="true">→</span></button>
              <button className="button button-text" onClick={() => navigate('/auth')}>Saya sudah punya akun</button>
            </div>
            <div className="hero-points"><span><i>✓</i> Mudah disampaikan</span><span><i>✓</i> Status bisa dipantau</span></div>
          </div>
          <div className="hero-art" aria-label="Ilustrasi kampus dan laporan fasilitas">
            <div className="art-sun" />
            <div className="art-cloud cloud-one" /><div className="art-cloud cloud-two" />
            <div className="art-building"><div className="building-roof" /><div className="building-body"><div className="building-sign">UNSRI</div><div className="building-windows"><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /></div><div className="building-door" /></div></div>
            <div className="art-tree tree-left"><i /><b /></div><div className="art-tree tree-right"><i /><b /></div>
            <div className="report-card"><span className="report-icon">✓</span><span><b>Laporan tersampaikan</b><small>Siap ditindaklanjuti</small></span></div>
            <div className="art-ground" />
          </div>
        </section>

        <section className="steps-section" aria-label="Cara kerja">
          <div className="section-heading"><span className="eyebrow">Mulai dalam beberapa langkah</span><h2>Suara Anda membantu kampus bergerak.</h2></div>
          <div className="steps-grid">
            <article className="step-card"><span className="step-number">01</span><div className="step-icon">✎</div><h3>Ceritakan masalahnya</h3><p>Jelaskan kendala fasilitas di lingkungan kampus dengan singkat dan jelas.</p></article>
            <article className="step-card"><span className="step-number">02</span><div className="step-icon">⌖</div><h3>Tentukan lokasinya</h3><p>Sertakan gedung dan lokasi agar laporan mudah ditemukan petugas.</p></article>
            <article className="step-card"><span className="step-number">03</span><div className="step-icon">↗</div><h3>Pantau tindak lanjut</h3><p>Lihat perkembangan laporan dan informasi penanganannya.</p></article>
          </div>
        </section>

        <footer className="site-footer"><a className="brand footer-brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}><span className="brand-mark">L</span><span>Lapor<span className="brand-accent">Unsri</span></span></a><span>Untuk kampus yang lebih nyaman, bersama.</span><button className="footer-link" onClick={() => navigate('/auth')}>Mulai melapor <span aria-hidden="true">→</span></button></footer>
      </main>
    )
  }

  const officerPage = page === 'officer-auth'
  const title = officerPage ? 'Portal petugas' : 'Selamat datang kembali'
  return (
    <main className="auth-page">
      <section className="auth-aside">
        <a className="brand auth-brand" href="/" onClick={(event) => { event.preventDefault(); navigate('/') }}><span className="brand-mark">L</span><span>Lapor<span className="brand-accent">Unsri</span></span></a>
        <div className="aside-message"><span className="eyebrow"><span className="status-dot" /> Layanan aspirasi kampus UNSRI</span><h1>{officerPage ? 'Bersama, kita jaga kampus tetap nyaman.' : 'Satu laporan bisa membawa perubahan.'}</h1><p>{officerPage ? 'Masuk untuk melihat laporan dan membantu proses penanganan fasilitas kampus.' : 'Sampaikan kendala fasilitas kampus dan ikuti perkembangannya dengan mudah.'}</p></div>
        <div className="aside-bottom"><span className="aside-check">✓</span> Layanan pelaporan fasilitas kampus</div>
        <div className="aside-decoration decoration-one" /><div className="aside-decoration decoration-two" />
      </section>
      <section className="auth-main">
        <button className="back-link" onClick={() => navigate('/')}><span aria-hidden="true">←</span> Kembali ke beranda</button>
        <div className="auth-card">
          <div className="auth-heading"><span className="eyebrow">{officerPage ? 'Akses petugas' : 'Akun LaporUnsri'}</span><h2>{profile ? 'Akun Anda' : mode === 'login' ? title : 'Buat akun baru'}</h2><p>{profile ? 'Anda sudah terhubung ke LaporUnsri.' : mode === 'login' ? (officerPage ? 'Masuk untuk mengelola laporan yang ditugaskan.' : 'Masuk untuk mengirim dan memantau laporan.') : 'Konfirmasi email diperlukan sebelum Anda bisa masuk.'}</p></div>
          {profile ? <div className="signed-in-card"><div className="signed-avatar">{profile.full_name.slice(0, 1).toUpperCase()}</div><div><strong>{profile.full_name}</strong><span>{roleLabel(profile.role)}</span></div><button className="button button-outline" onClick={() => void signOut()}>Keluar</button></div> : <>
            {notice && <div className="message message-success" role="status">{notice}</div>}
            {error && <div className="message message-error" role="alert">{error}</div>}
            {!isSupabaseConfigured && <div className="message message-warning" role="status">Supabase belum dikonfigurasi. Lengkapi URL dan publishable key di file .env untuk mengaktifkan autentikasi.</div>}
            <form className="auth-form" onSubmit={(event) => void submit(event)}>
              {mode === 'register' && <>
                <label>Nama lengkap<input required autoComplete="name" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Nama Anda" /></label>
                <label>{officerPage ? 'NIP' : 'NIM'}<span className="optional-label">Opsional</span><input autoComplete="off" value={nimNip} onChange={(event) => setNimNip(event.target.value)} placeholder={officerPage ? 'Nomor induk pegawai' : 'Nomor induk mahasiswa'} /></label>
              </>}
              <label>Email<input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@email.com" /></label>
              <label>Kata sandi<div className="password-input-wrap"><input required type={showPassword ? 'text' : 'password'} minLength={6} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} value={password} onChange={(event) => setPassword(event.target.value)} placeholder={mode === 'login' ? 'Masukkan kata sandi' : 'Minimal 6 karakter'} /><button className="password-visibility" type="button" aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'} aria-pressed={showPassword} onClick={() => setShowPassword((visible) => !visible)}>{showPassword ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}</button></div></label>
              <button className="button button-primary submit-button" disabled={busy || !isSupabaseConfigured}>{busy ? 'Mohon tunggu…' : mode === 'login' ? 'Masuk' : 'Daftar'}</button>
            </form>
            <p className="auth-switch">{mode === 'login' ? 'Belum punya akun?' : 'Sudah punya akun?'} <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setNotice(''); setError('') }}>{mode === 'login' ? 'Daftar sekarang' : 'Masuk'}</button></p>
            {!officerPage && <p className="admin-hint">Akun admin masuk melalui halaman ini menggunakan akun admin yang sudah dibuat.</p>}
          </>}
          <div className="auth-footnote"><span className="lock-icon">▣</span> Data akun tersimpan dengan aman.</div>
        </div>
      </section>
    </main>
  )
}
