import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import type { UserProfile } from '../../types/auth'
import type { Category, Report, ReportStatus } from '../../types/report'
import { Brand } from '../../components/common/Brand'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { ReportCardSkeleton } from '../../components/common/Skeleton'
import { AdminStatusRingCard } from '../../components/admin/AdminStatusRingCard'
import { ReportFilters } from '../../components/report/ReportFilters'
import { ReportFollowUpCard } from '../../components/report/ReportFollowUpCard'
import type { ReportFollowUpDraft } from '../../components/report/ReportFollowUpCard'
import { countReportsByStatus, filterReports, getReportAgeInDays, isReportOverdue, REPORT_OVERDUE_AFTER_DAYS } from '../../utils/report'
import { FOLLOW_UP_PHOTO_MAX_BYTES, validateImageFile } from '../../schemas/report'
import {
  createCategory,
  deleteCategory,
  getCachedCategories,
  getCachedReports,
  getCategories,
  getReports,
  renameCategory,
  updateReportStatusWithEvidence,
  uploadReportPhoto,
} from '../../services/reportService'
import {
  FiAlertTriangle,
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiFileText,
  FiFolder,
  FiGrid,
  FiLogOut,
  FiMapPin,
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
  const cachedReports = getCachedReports(profile.id)
  const cachedCategories = getCachedCategories()
  const [reports, setReports] = useState<Report[]>(() => cachedReports ?? [])
  const [categories, setCategories] = useState<Category[]>(() => cachedCategories ?? [])
  const [loading, setLoading] = useState(() => !cachedReports)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ReportStatus | ''>('')
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [newCategory, setNewCategory] = useState('')
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({})
  const [categoryBusy, setCategoryBusy] = useState(false)
  const activeSection = navigation.some((item) => item.id === section) ? section : 'dashboard'
  const navRef = useRef<HTMLElement>(null)
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null)

  useLayoutEffect(() => {
    const updatePill = () => {
      if (!navRef.current) return
      const activeBtn = navRef.current.querySelector<HTMLButtonElement>(`[data-section="${activeSection}"]`)
      if (activeBtn) {
        setPillStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
        })
      }
    }
    updatePill()
    window.addEventListener('resize', updatePill)
    return () => window.removeEventListener('resize', updatePill)
  }, [activeSection])

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
    const currentCached = getCachedReports(profile.id)
    if (!currentCached) {
      setLoading(true)
    }
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
  const withCoordinatesCount = useMemo(
    () => reports.filter((r) => typeof r.latitude === 'number' && typeof r.longitude === 'number').length,
    [reports]
  )
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

  const handleTakeAssignment = async (report: Report) => {
    setBusyId(report.id)
    setError('')
    setNotice('')
    try {
      await updateReportStatusWithEvidence(
        report.id,
        'diproses',
        `Laporan telah diambil dan mulai ditindaklanjuti oleh admin (${profile.full_name}).`,
        null
      )
      setNotice('Laporan berhasil ditindaklanjuti dan status kini berubah menjadi Diproses.')
      await loadData()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Gagal menindaklanjuti laporan.')
    } finally {
      setBusyId('')
    }
  }

  const saveFollowUp = async (event: FormEvent<HTMLFormElement>, report: Report) => {
    event.preventDefault()
    const draft = drafts[report.id] ?? { status: 'menunggu_konfirmasi', message: '', file: null }
    if (!draft.message.trim()) {
      setError('Catatan hasil penanganan wajib diisi.')
      return
    }
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
      await updateReportStatusWithEvidence(report.id, 'menunggu_konfirmasi', draft.message.trim(), photoUrl)
      setDrafts((current) => ({ ...current, [report.id]: { status: 'menunggu_konfirmasi', message: '', file: null } }))
      setNotice('Penanganan berhasil disimpan dan diajukan untuk konfirmasi pelapor.')
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
    if (!window.confirm(`Hapus kategori "${category.name}"?`)) return
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

  const { belum_diproses: openCount, diproses: progressCount, menunggu_konfirmasi: waitingConfirmCount, selesai: doneCount } = countReportsByStatus(reports)
  const avatarLetter = (profile.full_name || 'A').slice(0, 1).toUpperCase()

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] font-['Poppins','Montserrat','Outfit',system-ui,sans-serif] text-slate-800 antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-[#08315c] border-b border-white/10 shadow-md">
        <div className="mx-auto flex h-18 w-full max-w-[1280px] items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Brand
              showSubtitle={false}
              onClick={() => onNavigate('/admin/dashboard')}
              className="text-white"
            />
          </div>

          {/* Navigation Pills (Desktop) */}
          <nav ref={navRef} className="relative hidden lg:flex items-center gap-1.5 bg-[#062445]/60 p-1.5 rounded-full border border-white/10" aria-label="Menu Admin">
            {pillStyle && (
              <motion.div
                className="absolute rounded-full bg-white shadow-sm z-0 pointer-events-none"
                style={{ top: 6, bottom: 6 }}
                initial={false}
                animate={{
                  left: pillStyle.left,
                  width: pillStyle.width,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 420,
                  damping: 32,
                }}
              />
            )}
            {navigation.map((item) => {
              const isActive = activeSection === item.id
              const hasOverdue = item.id === 'terlambat' && overdueReports.length > 0
              return (
                <button
                  key={item.id}
                  data-section={item.id}
                  type="button"
                  onClick={() => onNavigate(`/admin/${item.id}`)}
                  className={`relative z-10 min-h-[38px] rounded-full px-4 py-1.5 text-xs font-bold transition-colors duration-200 cursor-pointer flex items-center gap-2 select-none ${
                    isActive
                      ? 'text-[#08315c]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span>{item.label}</span>
                  {hasOverdue && (
                    <span className="grid size-4.5 place-items-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                      {overdueReports.length}
                    </span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Right: Admin Profile & Logout */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="grid size-8 place-items-center rounded-full bg-[#ffbb00] text-xs font-bold text-[#08315c] shadow-sm select-none"
                aria-hidden="true"
              >
                {avatarLetter}
              </div>
              <div className="hidden sm:block text-right">
                <span className="block text-xs font-bold text-white max-w-[160px] truncate">{profile.full_name}</span>
                <span className="block text-[10px] text-[#ffbb00]">Administrator Sarpras</span>
              </div>
            </div>

            <button
              type="button"
              onClick={onSignOut}
              className="inline-flex min-h-[38px] items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold text-sky-200 hover:text-white transition cursor-pointer"
            >
              <FiLogOut className="size-3.5" aria-hidden="true" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Blue Hero Header Zone */}
      <section className="w-full bg-[#08315c] text-white px-4 sm:px-8 lg:px-12 pt-8 pb-20 sm:pb-24 shadow-inner">
        <div className="mx-auto max-w-[1280px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffbb00]">
            <FiShield className="size-3" aria-hidden="true" />
            <span>Panel Manajemen UNSRI</span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-white leading-[1.15]">
            {activeSection === 'kategori'
              ? 'Kelola Kategori Laporan'
              : activeSection === 'terlambat'
                ? 'Laporan Perlu Eskalasi Cepat'
                : activeSection === 'laporan'
                  ? 'Seluruh Laporan Kampus'
                  : `Selamat Datang, ${profile.full_name}`}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-sky-100/90 max-w-xl leading-relaxed">
            {activeSection === 'kategori'
              ? 'Atur klasifikasi sarana & prasarana agar mahasiswa dapat menyampaikan aduan dengan presisi.'
              : activeSection === 'terlambat'
                ? `Laporan yang belum tertangani selama ${REPORT_OVERDUE_AFTER_DAYS} hari atau lebih dan memerlukan tindakan segera.`
                : 'Pantau seluruh aktivitas pelaporan fasilitas, rekam jejak teknisi, dan performa penanganan kampus.'}
          </p>

          {activeSection !== 'kategori' && reports.length > 0 && (
            <div className="mt-3.5 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/20 px-3 py-1 text-xs text-sky-200">
                <FiMapPin className="size-3.5 text-[#ffbb00]" aria-hidden="true" />
                <span>
                  <strong>{withCoordinatesCount}</strong> dari {reports.length} laporan dilengkapi titik koordinat peta
                </span>
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Floating Status Ring Card on Dashboard Section */}
      {activeSection === 'dashboard' && (
        <section className="-mt-12 sm:-mt-14 relative z-10 w-full px-4 sm:px-8 lg:px-12">
          <div className="mx-auto max-w-[1280px]">
            <AdminStatusRingCard
              total={reports.length}
              openCount={openCount}
              progressCount={progressCount}
              waitingConfirmCount={waitingConfirmCount}
              doneCount={doneCount}
              overdueCount={overdueReports.length}
              loading={loading}
              onSelectStatus={(st) => setStatus(st)}
              onSelectSection={(sec) => onNavigate(`/admin/${sec}`)}
            />
          </div>
        </section>
      )}

      {/* Main Content Area */}
      <section className="w-full px-4 sm:px-8 lg:px-12 pt-10 pb-16 flex-1">
        <div className="mx-auto max-w-[1280px] space-y-6">
          {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
          {notice && <FeedbackMessage tone="success">{notice}</FeedbackMessage>}

          {/* Overdue Alert Banner on Dashboard */}
          {activeSection === 'dashboard' && overdueReports.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-4.5 shadow-sm">
              <div className="flex items-center gap-3">
                <FiAlertTriangle className="size-5 text-rose-500 shrink-0" aria-hidden="true" />
                <div>
                  <strong className="block text-xs font-bold text-rose-800">
                    Perhatian: {overdueReports.length} laporan fasilitas belum tertangani ≥ {REPORT_OVERDUE_AFTER_DAYS} hari
                  </strong>
                  <p className="text-[11px] text-rose-700">
                    Segera lakukan eskalasi kepada tim penanggung jawab sarpras gedung terkait.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('/admin/terlambat')}
                className="inline-flex min-h-[36px] items-center gap-1.5 self-start sm:self-auto rounded-xl bg-rose-600 px-4 py-1.5 text-xs font-bold text-white hover:bg-rose-700 transition cursor-pointer"
              >
                <span>Tinjau Sekarang</span>
                <FiArrowRight className="size-3.5" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Section: Category Management */}
          {activeSection === 'kategori' ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-sm space-y-6">
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
                  className="h-12 flex-1 rounded-xl border border-slate-200 bg-slate-50/50 px-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/20 transition"
                />
                <button
                  type="submit"
                  disabled={categoryBusy}
                  className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#08315c] hover:bg-[#0c4278] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <FiPlus className="size-4" aria-hidden="true" />
                  <span>Tambah Kategori</span>
                </button>
              </form>

              <div className="space-y-3 pt-3">
                <span className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                  Daftar Kategori Tersedia ({categories.length})
                </span>

                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col sm:flex-row items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5"
                  >
                    <input
                      aria-label={`Nama kategori ${category.name}`}
                      maxLength={80}
                      value={categoryNames[category.id] ?? category.name}
                      onChange={(event) =>
                        setCategoryNames((current) => ({ ...current, [category.id]: event.target.value }))
                      }
                      className="h-11 w-full flex-1 rounded-xl border border-slate-200 bg-white px-3.5 text-xs sm:text-sm text-slate-800 focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/20 transition"
                    />

                    <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                      <button
                        type="button"
                        disabled={
                          categoryBusy ||
                          (categoryNames[category.id] ?? category.name).trim() === category.name
                        }
                        onClick={() => void saveCategory(category)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 transition cursor-pointer"
                      >
                        <FiCheck className="size-3.5" aria-hidden="true" />
                        <span>Simpan</span>
                      </button>
                      <button
                        type="button"
                        disabled={categoryBusy}
                        onClick={() => void removeCategory(category)}
                        className="inline-flex min-h-[40px] items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-100 disabled:opacity-40 transition cursor-pointer"
                      >
                        <FiTrash2 className="size-3.5" aria-hidden="true" />
                        <span>Hapus</span>
                      </button>
                    </div>
                  </div>
                ))}

                {!loading && categories.length === 0 && (
                  <p className="text-center text-xs text-slate-400 py-8">Belum ada kategori yang dibuat.</p>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Listings Header & Filters */}
              {activeSection !== 'dashboard' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-[#08315c] tracking-tight">
                        {activeSection === 'terlambat' ? 'Laporan Melebihi Batas Waktu' : 'Katalog Laporan'}
                      </h2>
                      <p className="text-xs text-slate-500">{visibleReports.length} laporan ditampilkan</p>
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
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#08315c] tracking-tight">
                      Laporan Masuk Terbaru
                    </h2>
                    <p className="text-xs text-slate-500">Kelola dan pantau 5 laporan terkini dari mahasiswa.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigate('/admin/laporan')}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#08315c] hover:underline transition cursor-pointer"
                  >
                    <span>Buka Semua Laporan</span>
                    <FiArrowRight className="size-4" aria-hidden="true" />
                  </button>
                </div>
              )}

              {/* Report List */}
              {loading ? (
                <ReportCardSkeleton count={3} />
              ) : visibleReports.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">
                  <FiCheckCircle className="size-10 text-emerald-500 mb-3" aria-hidden="true" />
                  <h3 className="text-sm font-bold text-slate-800">
                    {activeSection === 'terlambat'
                      ? 'Bagus, Tidak Ada Laporan yang Perlu Dieskalasi'
                      : 'Belum Ada Laporan'}
                  </h3>
                  <p className="mt-1 text-xs text-slate-500 max-w-sm">
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
                          submitLabel="Selesaikan & Minta Konfirmasi Pelapor"
                          overdueDays={isReportOverdue(report) ? ageInDays : undefined}
                          onDraftChange={(patch) => setDraft(report, patch)}
                          onSubmit={(event) => void saveFollowUp(event, report)}
                          onTakeAssignment={(rep) => void handleTakeAssignment(rep)}
                        />
                      )
                    }
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
export default AdminDashboardPage
