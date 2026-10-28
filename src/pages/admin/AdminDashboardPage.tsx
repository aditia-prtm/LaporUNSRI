import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Category, Report, ReportStatus } from '../../types/report'
import { Brand } from '../../components/common/Brand'
import { MetricCard } from '../../components/common/MetricCard'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { ReportFilters } from '../../components/report/ReportFilters'
import { ReportFollowUpCard } from '../../components/report/ReportFollowUpCard'
import type { ReportFollowUpDraft } from '../../components/report/ReportFollowUpCard'
import { countReportsByStatus, filterReports, getReportAgeInDays, isReportOverdue, REPORT_OVERDUE_AFTER_DAYS } from '../../utils/report'
import { FOLLOW_UP_PHOTO_MAX_BYTES, validateImageFile } from '../../schemas/report'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getReports,
  renameCategory,
  updateReportStatusWithEvidence,
  uploadReportPhoto,
} from '../../services/reportService'
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiFolder,
  FiGrid,
  FiLogOut,
  FiPlus,
  FiShield,
  FiTrash2,
} from 'react-icons/fi'

type Props = { profile: UserProfile; onSignOut: () => void; onNavigate: (path: string) => void; section: string }
type Draft = ReportFollowUpDraft

function loadAdminDashboardData(userId: string) {
  return Promise.all([getReports(userId), getCategories()])
}

const navigation = [
  { id: 'dashboard', label: 'Ringkasan', icon: FiGrid },
  { id: 'laporan', label: 'Semua Laporan', icon: FiFileText },
  { id: 'terlambat', label: 'Perlu Eskalasi', icon: FiAlertTriangle },
  { id: 'kategori', label: 'Kelola Kategori', icon: FiFolder },
]

export function AdminDashboardPage({ profile, onSignOut, onNavigate, section }: Props) {
  const [reports, setReports] = useState<Report[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ReportStatus | ''>('')
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [newCategory, setNewCategory] = useState('')
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({})
  const [categoryBusy, setCategoryBusy] = useState(false)

  const loadData = async () => {
    setError('')
    try {
      const [nextReports, nextCategories] = await loadAdminDashboardData(profile.id)
      setReports(nextReports)
      setCategories(nextCategories)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Data dashboard gagal dimuat.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    void loadAdminDashboardData(profile.id)
      .then(([nextReports, nextCategories]) => {
        if (!active) return
        setReports(nextReports)
        setCategories(nextCategories)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Data dashboard gagal dimuat.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [profile.id])

  const overdueReports = useMemo(() => reports.filter(isReportOverdue), [reports])
  const visibleReports = useMemo(
    () =>
      filterReports(reports, {
        search,
        status,
        overdueOnly: section === 'terlambat',
      }),
    [reports, search, status, section]
  )

  const setDraft = (report: Report, patch: Partial<Draft>) => {
    setDrafts((current) => {
      const existing = current[report.id] ?? { status: report.status, message: '', file: null }
      return { ...current, [report.id]: { ...existing, ...patch } }
    })
  }

  const saveFollowUp = async (event: FormEvent<HTMLFormElement>, report: Report) => {
    event.preventDefault()
    const draft = drafts[report.id] ?? { status: report.status, message: '', file: null }
    if (!draft.message.trim()) return
    const fileError = draft.file ? validateImageFile(draft.file, FOLLOW_UP_PHOTO_MAX_BYTES) : null
    if (fileError) {
      setError(fileError)
      return
    }
    setBusyId(report.id)
    setError('')
    setNotice('')
    try {
      const photoUrl = draft.file ? await uploadReportPhoto(draft.file, profile.id) : null
      await updateReportStatusWithEvidence(report.id, draft.status, draft.message.trim(), photoUrl)
      setDrafts((current) => ({ ...current, [report.id]: { ...draft, message: '', file: null } }))
      setNotice('Status dan catatan tindak lanjut berhasil disimpan.')
      await loadData()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Tindak lanjut gagal disimpan.')
    } finally {
      setBusyId('')
    }
  }

  const addCategory = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const name = newCategory.trim()
    if (!name) return
    setCategoryBusy(true)
    setError('')
    setNotice('')
    try {
      await createCategory(name)
      setNewCategory('')
      setNotice('Kategori fasilitas berhasil ditambahkan.')
      await loadData()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Kategori gagal ditambahkan.')
    } finally {
      setCategoryBusy(false)
    }
  }

  const saveCategory = async (category: Category) => {
    const name = (categoryNames[category.id] ?? category.name).trim()
    if (!name) {
      setError('Nama kategori tidak boleh kosong.')
      return
    }
    setCategoryBusy(true)
    setError('')
    try {
      await renameCategory(category.id, name)
      setNotice('Nama kategori diperbarui.')
      await loadData()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Kategori gagal diperbarui.')
    } finally {
      setCategoryBusy(false)
    }
  }

  const removeCategory = async (category: Category) => {
    if (!window.confirm(`Hapus kategori “${category.name}”?`)) return
    setCategoryBusy(true)
    setError('')
    setNotice('')
    try {
      await deleteCategory(category.id)
      setNotice('Kategori berhasil dihapus.')
      await loadData()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Kategori tidak dapat dihapus. Mungkin kategori masih dipakai oleh laporan aktif.')
    } finally {
      setCategoryBusy(false)
    }
  }

  const { belum_diproses: openCount, diproses: progressCount, selesai: doneCount } = countReportsByStatus(reports)
  const activeSection = navigation.some((item) => item.id === section) ? section : 'dashboard'

  return (
    <main className="relative min-h-screen w-full bg-[#020b17] font-['Poppins','Montserrat','Outfit',system-ui,sans-serif] text-white">
      {/* Ambient background lighting */}
      <div
        className="pointer-events-none fixed -left-40 top-0 size-[500px] rounded-full bg-[#105292]/15 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none fixed right-0 bottom-0 size-[500px] rounded-full bg-[#4899e8]/10 blur-[150px]"
        aria-hidden="true"
      />

      {/* Top Header */}
      <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-white/10 bg-[#031830]/85 px-6 sm:px-10 backdrop-blur-md">
        <Brand onClick={() => onNavigate('/admin/dashboard')} />

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
            <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[#0c4278] to-[#2b8ced] text-xs font-bold text-white shadow-sm">
              {(profile.full_name || 'A').slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden sm:block text-right">
              <strong className="block text-xs font-bold text-white">{profile.full_name}</strong>
              <small className="flex items-center justify-end gap-1 text-[10px] text-amber-300">
                <span className="size-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#f59e0b]" />
                Administrator Kampus
              </small>
            </div>
          </div>

          <button
            type="button"
            onClick={onSignOut}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2 text-xs font-semibold text-[#8cb6dc] transition hover:border-rose-500/30 hover:bg-rose-500/10 hover:text-rose-300 cursor-pointer"
          >
            <FiLogOut className="size-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </header>

      {/* Main Body with Sidebar Layout */}
      <div className="relative mx-auto flex w-full max-w-[1440px] flex-col lg:flex-row">
        {/* Sidebar Nav */}
        <aside className="sticky top-18 z-20 w-full lg:w-64 shrink-0 border-b lg:border-b-0 lg:border-r border-white/10 bg-[#031326]/90 p-4 lg:p-6 backdrop-blur-xl lg:min-h-[calc(100vh-72px)]">
          <div className="hidden lg:block text-[10px] font-bold uppercase tracking-[0.2em] text-[#60b6ff] mb-3">
            Menu Administrasi
          </div>

          <nav className="flex flex-wrap lg:flex-col gap-1.5" aria-label="Menu admin">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = activeSection === item.id
              const hasOverdue = item.id === 'terlambat' && overdueReports.length > 0

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(`/admin/${item.id}`)}
                  className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#4899e8]/20 to-[#60b6ff]/10 text-[#60b6ff] border-l-2 border-[#60b6ff] shadow-[0_0_15px_rgba(96,182,255,0.15)]'
                      : 'text-[#8cb6dc] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className="size-4" />
                    <span>{item.label}</span>
                  </div>
                  {hasOverdue && (
                    <span className="grid size-5 place-items-center rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-300 border border-rose-500/40">
                      {overdueReports.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>
        </aside>

        {/* Content View */}
        <section className="relative z-10 flex-1 p-4 sm:p-8 space-y-6">
          {/* Section Hero Banner */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#051d38] via-[#04162a] to-[#020b17] p-6 backdrop-blur-xl shadow-xl shadow-black/20">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#60b6ff]/30 bg-[#60b6ff]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fc3ee]">
              <FiShield className="size-3" />
              <span>Panel Manajemen UNSRI</span>
            </div>

            <h1 className="mt-3 font-['Poppins','Montserrat','Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {activeSection === 'kategori'
                ? 'Kelola Kategori Laporan'
                : activeSection === 'terlambat'
                  ? 'Laporan Perlu Eskalasi Cepat'
                  : activeSection === 'laporan'
                    ? 'Seluruh Laporan Kampus'
                    : `Selamat Datang, ${profile.full_name}`}
            </h1>

            <p className="mt-1 text-xs sm:text-sm text-[#a4c1db] max-w-xl">
              {activeSection === 'kategori'
                ? 'Atur klasifikasi sarana & prasarana agar mahasiswa dapat menyampaikan aduan dengan presisi.'
                : activeSection === 'terlambat'
                  ? `Laporan yang belum tertangani selama ${REPORT_OVERDUE_AFTER_DAYS} hari atau lebih dan memerlukan tindakan segera.`
                  : 'Pantau seluruh aktivitas pelaporan fasilitas, rekam jejak teknisi, dan performa penanganan.'}
            </p>
          </div>

          {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
          {notice && <FeedbackMessage tone="success">{notice}</FeedbackMessage>}

          {/* Section: Category Management */}
          {activeSection === 'kategori' ? (
            <div className="rounded-3xl border border-white/10 bg-[#072445]/45 p-6 backdrop-blur-md shadow-xl space-y-6">
              <form
                className="flex flex-col sm:flex-row gap-3"
                onSubmit={(event) => void addCategory(event)}
              >
                <input
                  aria-label="Nama kategori baru"
                  required
                  maxLength={80}
                  value={newCategory}
                  onChange={(event) => setNewCategory(event.target.value)}
                  placeholder="Nama kategori fasilitas baru (contoh: Sanitasi & Toilet)"
                  className="h-11 flex-1 rounded-xl border border-white/15 bg-[#031528]/80 px-4 text-xs text-white placeholder:text-[#8cb6dc]/50 backdrop-blur-md transition focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30"
                />
                <button
                  type="submit"
                  disabled={categoryBusy}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#60b6ff] to-[#2b8ced] px-5 py-2.5 text-xs font-bold text-[#021427] shadow-[0_4px_16px_rgba(58,147,232,0.35)] transition-all hover:brightness-105 disabled:opacity-50 cursor-pointer"
                >
                  <FiPlus className="size-4" />
                  <span>Tambah Kategori</span>
                </button>
              </form>

              <div className="space-y-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-[#60b6ff]">
                  Daftar Kategori Tersedia ({categories.length})
                </span>

                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-white/10 bg-[#031427]/60 p-3.5 backdrop-blur-sm"
                  >
                    <input
                      aria-label={`Nama kategori ${category.name}`}
                      maxLength={80}
                      value={categoryNames[category.id] ?? category.name}
                      onChange={(event) =>
                        setCategoryNames((current) => ({ ...current, [category.id]: event.target.value }))
                      }
                      className="h-10 w-full flex-1 rounded-xl border border-white/15 bg-[#072445]/50 px-3.5 text-xs text-white focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30"
                    />

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        disabled={
                          categoryBusy ||
                          (categoryNames[category.id] ?? category.name).trim() === category.name
                        }
                        onClick={() => void saveCategory(category)}
                        className="rounded-xl border border-white/20 bg-white/5 px-3 py-2 text-xs font-semibold text-[#cce5fb] transition hover:bg-white/15 hover:text-white disabled:opacity-40 cursor-pointer"
                      >
                        Simpan
                      </button>
                      <button
                        type="button"
                        disabled={categoryBusy}
                        onClick={() => void removeCategory(category)}
                        className="inline-flex items-center gap-1 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-40 cursor-pointer"
                      >
                        <FiTrash2 className="size-3.5" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}

                {!loading && categories.length === 0 && (
                  <p className="text-center text-xs text-[#8cb6dc] py-6">Belum ada kategori yang dibuat.</p>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Summary Cards Grid on Dashboard Overview */}
              {activeSection === 'dashboard' && (
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
                  <MetricCard
                    label="Total Aduan"
                    value={loading ? '—' : reports.length}
                    description="Seluruh laporan masuk"
                    icon={<FiFileText />}
                  />
                  <MetricCard
                    label="Belum Diproses"
                    value={loading ? '—' : openCount}
                    description="Menunggu penugasan"
                    icon={<FiClock />}
                    iconClassName="text-amber-300 border-amber-400/30 from-amber-950/40 to-amber-900/20"
                  />
                  <MetricCard
                    label="Sedang Diproses"
                    value={loading ? '—' : progressCount}
                    description="Sedang dikerjakan"
                    icon={<FiClock />}
                    iconClassName="text-sky-300 border-sky-400/30 from-sky-950/40 to-sky-900/20"
                  />
                  <MetricCard
                    label="Tuntas Selesai"
                    value={loading ? '—' : doneCount}
                    description="Telah diperbaiki"
                    icon={<FiCheckCircle />}
                    iconClassName="text-emerald-300 border-emerald-400/30 from-emerald-950/40 to-emerald-900/20"
                  />
                  <MetricCard
                    label="Perlu Eskalasi"
                    value={loading ? '—' : overdueReports.length}
                    description={`Belum diproses ≥ ${REPORT_OVERDUE_AFTER_DAYS} hari`}
                    icon={<FiAlertTriangle />}
                    iconClassName="text-rose-400 border-rose-500/40 from-rose-950/50 to-rose-900/30"
                    className="col-span-2 lg:col-span-1 border-rose-500/30 bg-[#200e18]/40"
                  />
                </div>
              )}

              {/* Filters for listings */}
              {activeSection !== 'dashboard' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-['Poppins','Montserrat','Outfit',sans-serif] text-lg font-bold text-white">
                        {activeSection === 'terlambat' ? 'Laporan Melebihi Batas Waktu' : 'Katalog Laporan'}
                      </h2>
                      <p className="text-xs text-[#8cb6dc]">{visibleReports.length} laporan ditampilkan</p>
                    </div>
                  </div>

                  <ReportFilters
                    search={search}
                    status={status}
                    onSearchChange={setSearch}
                    onStatusChange={setStatus}
                  />
                </div>
              )}

              {/* Recent section header on dashboard */}
              {activeSection === 'dashboard' && (
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <h2 className="font-['Poppins','Montserrat','Outfit',sans-serif] text-lg font-bold text-white">
                      Laporan Masuk Terbaru
                    </h2>
                    <p className="text-xs text-[#8cb6dc]">Kelola dan pantau 5 laporan terkini dari mahasiswa.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('/admin/laporan')}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#60b6ff] hover:text-[#93d5ba] transition-colors cursor-pointer"
                  >
                    <span>Buka Semua Laporan</span>
                    <FiArrowRight className="size-3.5" />
                  </button>
                </div>
              )}

              {/* Report List */}
              {loading ? (
                <div className="rounded-2xl border border-white/10 bg-[#072445]/45 p-12 text-center text-xs text-[#8cb6dc] backdrop-blur-md">
                  Memuat data laporan...
                </div>
              ) : visibleReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#072445]/30 p-12 text-center backdrop-blur-md">
                  <FiCheckCircle className="size-10 text-emerald-400/50 mb-3" />
                  <h3 className="text-sm font-bold text-white">
                    {activeSection === 'terlambat'
                      ? 'Hebat! Tidak Ada Laporan yang Perlu Dieskalasi'
                      : 'Belum Ada Laporan'}
                  </h3>
                  <p className="mt-1 text-xs text-[#8cb6dc] max-w-sm">
                    {activeSection === 'terlambat'
                      ? 'Seluruh laporan tertangani tepat waktu sesuai batas hari yang ditetapkan.'
                      : 'Laporan yang sesuai filter pencarian akan muncul di sini.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {(activeSection === 'dashboard' ? visibleReports.slice(0, 5) : visibleReports).map(
                    (report) => {
                      const draft = drafts[report.id] ?? { status: report.status, message: '', file: null }
                      const ageInDays = getReportAgeInDays(report)

                      return (
                        <ReportFollowUpCard
                          key={report.id}
                          report={report}
                          draft={draft}
                          busy={busyId === report.id}
                          photoRequired={false}
                          submitLabel="Simpan Tindak Lanjut"
                          overdueDays={isReportOverdue(report) ? ageInDays : undefined}
                          onDraftChange={(patch) => setDraft(report, patch)}
                          onSubmit={(event) => void saveFollowUp(event, report)}
                        />
                      )
                    }
                  )}
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </main>
  )
}
export default AdminDashboardPage
