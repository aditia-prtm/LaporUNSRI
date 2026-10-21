import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { StudentLayout } from '../components/layout/StudentLayout'
import { useAuth } from '../hooks/useAuth'
import type { UserProfile } from '../types/auth'

const AuthPage = lazy(() => import('../pages/auth/AuthPage').then((module) => ({ default: module.AuthPage })))
const LandingPage = lazy(() => import('../pages/public/LandingPage').then((module) => ({ default: module.LandingPage })))
const ReportDetailPage = lazy(() => import('../pages/student/ReportDetailPage').then((module) => ({ default: module.ReportDetailPage })))
const ReportFormPage = lazy(() => import('../pages/student/ReportFormPage').then((module) => ({ default: module.ReportFormPage })))
const ReportsPage = lazy(() => import('../pages/student/ReportsPage').then((module) => ({ default: module.ReportsPage })))
const StudentDashboardPage = lazy(() => import('../pages/student/StudentDashboardPage').then((module) => ({ default: module.StudentDashboardPage })))
const OfficerDashboardPage = lazy(() => import('../pages/officer/OfficerDashboardPage').then((module) => ({ default: module.OfficerDashboardPage })))

function LandingRoute() {
  const navigate = useNavigate()
  return <LandingPage onNavigate={navigate} />
}

function AuthRoute({ kind }: { kind: 'user' | 'officer' }) {
  const navigate = useNavigate()
  const location = useLocation()
  const requestedPath = (location.state as { from?: unknown } | null)?.from
  const afterLogin = typeof requestedPath === 'string' && requestedPath.startsWith('/mahasiswa')
    ? requestedPath
    : '/mahasiswa'

  return <AuthPage kind={kind} onNavigate={(path) => navigate(path === '/mahasiswa' ? afterLogin : path)} />
}

function OfficerLayoutRoute() {
  const { profile, loading, signOut } = useAuth()
  const navigate = useNavigate()
  if (loading) return <main className="access-page"><div className="access-card">Memeriksa sesi akun...</div></main>
  if (!profile || profile.role !== 'petugas') return <Navigate to="/petugas" replace />
  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/petugas', { replace: true })
    } catch {
      // Keep the workspace open if Supabase cannot complete sign-out.
    }
  }
  return <OfficerDashboardPage profile={profile} onSignOut={() => void handleSignOut()} />
}

function StudentLayoutRoute() {
  const { profile, loading, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (loading) return <main className="access-page"><div className="access-card">Memeriksa sesi akun...</div></main>
  if (!profile || profile.role !== 'mahasiswa') {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  const active = location.pathname === '/mahasiswa'
    ? 'dashboard'
    : location.pathname === '/mahasiswa/laporan-saya'
      ? 'mine'
      : 'reports'

  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth', { replace: true })
    } catch {
      // Leave the page open if Supabase cannot complete sign-out.
    }
  }

  return <StudentLayout profile={profile} active={active} onNavigate={navigate} onSignOut={() => void handleSignOut()}><Outlet context={profile} /></StudentLayout>
}

function useStudentPage() {
  return { profile: useOutletContext<UserProfile>(), onNavigate: useNavigate() }
}

function StudentDashboardRoute() {
  const { profile, onNavigate } = useStudentPage()
  return <StudentDashboardPage profile={profile} onNavigate={onNavigate} />
}

function AllReportsRoute() {
  const { profile, onNavigate } = useStudentPage()
  return <ReportsPage profile={profile} onNavigate={onNavigate} />
}

function MyReportsRoute() {
  const { profile, onNavigate } = useStudentPage()
  return <ReportsPage profile={profile} mineOnly onNavigate={onNavigate} />
}

function NewReportRoute() {
  const { profile, onNavigate } = useStudentPage()
  return <ReportFormPage profile={profile} onNavigate={onNavigate} />
}

function EditReportRoute() {
  const { profile, onNavigate } = useStudentPage()
  const { reportId = '' } = useParams()
  return <ReportFormPage profile={profile} reportId={reportId} onNavigate={onNavigate} />
}

function ReportDetailRoute() {
  const { profile, onNavigate } = useStudentPage()
  const { reportId = '' } = useParams()
  return <ReportDetailPage profile={profile} reportId={reportId} onNavigate={onNavigate} />
}

function NotFoundRoute() {
  const navigate = useNavigate()
  return <main className="access-page"><div className="access-card"><span className="eyebrow">404</span><h1>Halaman tidak ditemukan</h1><p>Alamat yang Anda buka tidak tersedia.</p><button className="button button-primary" onClick={() => navigate('/')}>Kembali ke beranda</button></div></main>
}

export function AppRoutes() {
  return (
    <Suspense fallback={<main className="access-page"><div className="access-card">Memuat halaman...</div></main>}>
      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route path="/auth" element={<AuthRoute kind="user" />} />
        {/* Public authentication entry for officers; only work pages are guarded. */}
        <Route path="/petugas" element={<AuthRoute kind="officer" />} />
        <Route path="/petugas/dashboard" element={<OfficerLayoutRoute />} />
        <Route path="/mahasiswa" element={<StudentLayoutRoute />}>
          <Route index element={<StudentDashboardRoute />} />
          <Route path="laporan" element={<AllReportsRoute />} />
          <Route path="laporan-saya" element={<MyReportsRoute />} />
          <Route path="laporan/baru" element={<NewReportRoute />} />
          <Route path="laporan/:reportId/edit" element={<EditReportRoute />} />
          <Route path="laporan/:reportId" element={<ReportDetailRoute />} />
        </Route>
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </Suspense>
  )
}
