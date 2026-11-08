import { lazy, Suspense } from 'react'
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { StudentLayout } from '../components/layout/StudentLayout'
import { LoadingScreen } from '../components/common/LoadingScreen'
import { useAuth } from '../hooks/useAuth'
import type { UserProfile } from '../types/auth'

const AuthPage = lazy(() => import('../pages/auth/AuthPage').then((module) => ({ default: module.AuthPage })))
const LandingPage = lazy(() => import('../pages/public/LandingPage').then((module) => ({ default: module.LandingPage })))
const ReportDetailPage = lazy(() => import('../pages/student/ReportDetailPage').then((module) => ({ default: module.ReportDetailPage })))
const ReportFormPage = lazy(() => import('../pages/student/ReportFormPage').then((module) => ({ default: module.ReportFormPage })))
const ReportsPage = lazy(() => import('../pages/student/ReportsPage').then((module) => ({ default: module.ReportsPage })))
const StudentDashboardPage = lazy(() => import('../pages/student/StudentDashboardPage').then((module) => ({ default: module.StudentDashboardPage })))
const OfficerDashboardPage = lazy(() => import('../pages/officer/OfficerDashboardPage').then((module) => ({ default: module.OfficerDashboardPage })))
const AdminDashboardPage = lazy(() => import('../pages/admin/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage })))
const SettingsPage = lazy(() => import('../pages/common/SettingsPage').then((module) => ({ default: module.SettingsPage })))

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
  const { profile, loading } = useAuth()
  const navigate = useNavigate()
  if (!loading && (!profile || profile.role !== 'petugas')) return <Navigate to="/petugas" replace />
  return (
    <>
      <LoadingScreen isLoading={loading} />
      {profile && (
        <OfficerDashboardPage
          profile={profile}
          onNavigate={navigate}
        />
      )}
    </>
  )
}

function OfficerSettingsRoute() {
  const { profile, loading, signOut } = useAuth()
  const navigate = useNavigate()
  if (!loading && (!profile || profile.role !== 'petugas')) return <Navigate to="/petugas" replace />
  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/petugas', { replace: true })
    } catch {
      // Keep the workspace open if Supabase cannot complete sign-out.
    }
  }
  return (
    <>
      <LoadingScreen isLoading={loading} />
      {profile && (
        <SettingsPage
          profile={profile}
          onNavigate={navigate}
          onSignOut={() => void handleSignOut()}
        />
      )}
    </>
  )
}

function AdminLayoutRoute() {
  const { profile, loading, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  if (!loading && (!profile || profile.role !== 'admin')) {
    const destination = profile?.role === 'petugas' ? '/petugas/dashboard' : profile?.role === 'mahasiswa' ? '/mahasiswa' : '/auth'
    return <Navigate to={destination} replace />
  }
  const handleSignOut = async () => {
    try {
      await signOut()
      navigate('/auth', { replace: true })
    } catch {
      // Keep the admin dashboard open if Supabase cannot complete sign-out.
    }
  }
  const section = location.pathname.replace(/^\/admin\/?/, '').split('/')[0] || 'dashboard'
  return (
    <>
      <LoadingScreen isLoading={loading} />
      {profile && <AdminDashboardPage profile={profile} section={section} onNavigate={navigate} onSignOut={() => void handleSignOut()} />}
    </>
  )
}

function StudentLayoutRoute() {
  const { profile, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  if (!loading && (!profile || profile.role !== 'mahasiswa')) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />
  }

  const active = location.pathname === '/mahasiswa'
    ? 'dashboard'
    : location.pathname === '/mahasiswa/laporan-saya'
      ? 'mine'
      : location.pathname === '/mahasiswa/pengaturan'
        ? 'settings'
        : 'reports'

  return (
    <>
      <LoadingScreen isLoading={loading} />
      {profile && (
        <StudentLayout profile={profile} active={active} onNavigate={navigate}>
          <Outlet context={profile} />
        </StudentLayout>
      )}
    </>
  )
}

function useStudentPage() {
  return { profile: useOutletContext<UserProfile>(), onNavigate: useNavigate() }
}

function StudentSettingsRoute() {
  const { profile, onNavigate } = useStudentPage()
  const { signOut } = useAuth()
  const handleSignOut = async () => {
    try {
      await signOut()
      onNavigate('/auth', { replace: true })
    } catch {
      // Leave the page open if Supabase cannot complete sign-out.
    }
  }
  return <SettingsPage profile={profile} onNavigate={onNavigate} onSignOut={() => void handleSignOut()} />
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

const NotFoundPage = lazy(() => import('../pages/public/NotFoundPage').then((module) => ({ default: module.NotFoundPage })))

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/" element={<LandingRoute />} />
        <Route path="/auth" element={<AuthRoute kind="user" />} />
        {/* Public authentication entry for officers; only work pages are guarded. */}
        <Route path="/petugas" element={<AuthRoute kind="officer" />} />
        <Route path="/petugas/dashboard" element={<OfficerLayoutRoute />} />
        <Route path="/petugas/pengaturan" element={<OfficerSettingsRoute />} />
        <Route path="/admin/*" element={<AdminLayoutRoute />} />
        <Route path="/mahasiswa" element={<StudentLayoutRoute />}>
          <Route index element={<StudentDashboardRoute />} />
          <Route path="laporan" element={<AllReportsRoute />} />
          <Route path="laporan-saya" element={<MyReportsRoute />} />
          <Route path="laporan/baru" element={<NewReportRoute />} />
          <Route path="laporan/:reportId/edit" element={<EditReportRoute />} />
          <Route path="laporan/:reportId" element={<ReportDetailRoute />} />
          <Route path="pengaturan" element={<StudentSettingsRoute />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
