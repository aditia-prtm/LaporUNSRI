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
import './admin.css'
import '../officer/officer.css'
import '../student/student.css'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getReports,
  renameCategory,
  updateReportStatusWithEvidence,
  uploadReportPhoto,
} from '../../services/reportService'
type Props = { profile: UserProfile; onSignOut: () => void; onNavigate: (path: string) => void; section: string }
type Draft = ReportFollowUpDraft

function loadAdminDashboardData(userId: string) {
  return Promise.all([getReports(userId), getCategories()])
}

const navigation = [
  { id: 'dashboard', label: 'Ringkasan' },
  { id: 'laporan', label: 'Semua laporan' },
  { id: 'terlambat', label: 'Perlu eskalasi' },
  { id: 'kategori', label: 'Kelola kategori' },
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
    void loadAdminDashboardData(profile.id).then(([nextReports, nextCategories]) => {
      if (!active) return
      setReports(nextReports)
      setCategories(nextCategories)
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Data dashboard gagal dimuat.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [profile.id])

  const overdueReports = useMemo(() => reports.filter(isReportOverdue), [reports])
  const visibleReports = useMemo(() => filterReports(reports, {
    search,
    status,
    overdueOnly: section === 'terlambat',
  }), [reports, search, status, section])

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
      setNotice('Kategori berhasil ditambahkan.')
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
      setError(cause instanceof Error ? cause.message : 'Kategori tidak dapat dihapus. Mungkin kategori masih dipakai laporan.')
    } finally {
      setCategoryBusy(false)
    }
  }

  const { belum_diproses: openCount, diproses: progressCount, selesai: doneCount } = countReportsByStatus(reports)
  const activeSection = navigation.some((item) => item.id === section) ? section : 'dashboard'

  return (
    <main className="admin-shell">
      <header className="officer-topbar"><Brand /><div className="officer-account"><span>{profile.full_name}<small>Administrator</small></span><button className="button button-outline" onClick={onSignOut}>Keluar</button></div></header>
      <div className="admin-frame">
        <aside className="admin-nav"><span className="eyebrow">ADMINISTRASI</span><nav aria-label="Menu admin">{navigation.map((item) => <button key={item.id} className={activeSection === item.id ? 'admin-nav-item is-active' : 'admin-nav-item'} onClick={() => onNavigate(`/admin/${item.id}`)}>{item.label}{item.id === 'terlambat' && overdueReports.length > 0 && <b>{overdueReports.length}</b>}</button>)}</nav></aside>
        <section className="admin-content">
          <div className="student-welcome"><div><span className="eyebrow">PANEL ADMIN</span><h1>{activeSection === 'kategori' ? 'Kelola kategori' : activeSection === 'terlambat' ? 'Laporan perlu eskalasi' : activeSection === 'laporan' ? 'Semua laporan' : `Halo, ${profile.full_name}`}</h1><p>{activeSection === 'kategori' ? 'Tambah, ubah, dan hapus kategori laporan.' : activeSection === 'terlambat' ? `Belum diproses selama ${REPORT_OVERDUE_AFTER_DAYS} hari atau lebih.` : 'Pantau laporan dan tindak lanjut fasilitas kampus.'}</p></div></div>
          {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
          {notice && <FeedbackMessage tone="success">{notice}</FeedbackMessage>}

          {activeSection === 'kategori' ? <section className="admin-panel"><form className="admin-add-category" onSubmit={(event) => void addCategory(event)}><input aria-label="Nama kategori baru" required maxLength={80} value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Nama kategori baru" /><button className="button button-primary" disabled={categoryBusy}>Tambah kategori</button></form><div className="admin-category-list">{categories.map((category) => <div className="admin-category-row" key={category.id}><input aria-label={`Nama kategori ${category.name}`} maxLength={80} value={categoryNames[category.id] ?? category.name} onChange={(event) => setCategoryNames((current) => ({ ...current, [category.id]: event.target.value }))} /><button className="button button-outline" disabled={categoryBusy || (categoryNames[category.id] ?? category.name).trim() === category.name} onClick={() => void saveCategory(category)}>Simpan</button><button className="button button-danger" disabled={categoryBusy} onClick={() => void removeCategory(category)}>Hapus</button></div>)}{!loading && categories.length === 0 && <p className="admin-empty">Belum ada kategori.</p>}</div></section> : <>
            {activeSection === 'dashboard' && <div className="summary-grid">
              <MetricCard label="Total laporan" value={loading ? '—' : reports.length} description="Seluruh laporan masuk" />
              <MetricCard label="Belum diproses" value={loading ? '—' : openCount} description="Menunggu tindak lanjut" />
              <MetricCard label="Sedang diproses" value={loading ? '—' : progressCount} description="Dalam penanganan" />
              <MetricCard label="Selesai" value={loading ? '—' : doneCount} description="Sudah ditangani" />
              <MetricCard className="admin-escalation-card" label="Perlu eskalasi" value={loading ? '—' : overdueReports.length} description={`Belum diproses ≥ ${REPORT_OVERDUE_AFTER_DAYS} hari`} />
            </div>}
            {activeSection !== 'dashboard' && <div className="officer-list-heading">
              <div><h2>{activeSection === 'terlambat' ? 'Daftar laporan terlambat' : 'Daftar seluruh laporan'}</h2><p>{visibleReports.length} laporan ditampilkan</p></div>
              <ReportFilters className="officer-filters" search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} />
            </div>}
            {activeSection === 'dashboard' && <div className="admin-dashboard-list"><div className="student-section-heading"><div><h2>Laporan terbaru</h2><p>Periksa laporan yang baru masuk.</p></div><button className="text-link" onClick={() => onNavigate('/admin/laporan')}>Lihat semua →</button></div></div>}
            {loading ? <div className="student-empty">Memuat laporan...</div> : visibleReports.length === 0 ? <div className="student-empty"><h2>{activeSection === 'terlambat' ? 'Tidak ada laporan yang perlu dieskalasi' : 'Belum ada laporan'}</h2><p>Laporan yang cocok akan muncul di sini.</p></div> : <div className="admin-dashboard-list">{(activeSection === 'dashboard' ? visibleReports.slice(0, 5) : visibleReports).map((report) => {
              const draft = drafts[report.id] ?? { status: report.status, message: '', file: null }
              const ageInDays = getReportAgeInDays(report)
              return <ReportFollowUpCard
                key={report.id}
                report={report}
                draft={draft}
                busy={busyId === report.id}
                photoRequired={false}
                submitLabel="Simpan tindak lanjut"
                overdueDays={isReportOverdue(report) ? ageInDays : undefined}
                onDraftChange={(patch) => setDraft(report, patch)}
                onSubmit={(event) => void saveFollowUp(event, report)}
              />
            })}</div>}
          </>}
        </section>
      </div>
    </main>
  )
}
