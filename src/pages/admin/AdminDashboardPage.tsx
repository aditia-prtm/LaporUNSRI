import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Category, Report, ReportStatus } from '../../types/report'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import {
  createCategory,
  deleteCategory,
  getCategories,
  getReports,
  renameCategory,
  updateReportStatusWithEvidence,
  uploadReportPhoto,
} from '../../services/reportService'
import '../../components/layout/admin.css'
import '../../components/layout/officer.css'
import '../../pages/student/student.css'

type Props = { profile: UserProfile; onSignOut: () => void; onNavigate: (path: string) => void; section: string }
type Draft = { status: ReportStatus; message: string; file: File | null }

const statusLabels: Record<ReportStatus, string> = {
  belum_diproses: 'Belum diproses',
  diproses: 'Diproses',
  selesai: 'Selesai',
}
const overdueAfterDays = 7
const navigation = [
  { id: 'dashboard', label: 'Ringkasan' },
  { id: 'laporan', label: 'Semua laporan' },
  { id: 'terlambat', label: 'Perlu eskalasi' },
  { id: 'kategori', label: 'Kelola kategori' },
]

function isOverdue(report: Report) {
  return report.status === 'belum_diproses'
    && Date.now() - Date.parse(report.created_at) >= overdueAfterDays * 24 * 60 * 60 * 1000
}

export function AdminDashboardPage({ profile, onSignOut, onNavigate, section }: Props) {
  const [reports, setReports] = useState<Report[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [drafts, setDrafts] = useState<Record<string, Draft>>({})
  const [newCategory, setNewCategory] = useState('')
  const [categoryNames, setCategoryNames] = useState<Record<string, string>>({})
  const [categoryBusy, setCategoryBusy] = useState(false)

  const loadData = async () => {
    setError('')
    try {
      const [nextReports, nextCategories] = await Promise.all([getReports(profile.id), getCategories()])
      setReports(nextReports)
      setCategories(nextCategories)
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Data dashboard gagal dimuat.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void loadData() }, [profile.id])

  const overdueReports = useMemo(() => reports.filter(isOverdue), [reports])
  const visibleReports = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('id')
    return reports.filter((report) => {
      const textMatch = !term || [report.title, report.description, report.faculty, report.building, report.room ?? '', report.profiles?.full_name ?? '']
        .some((value) => value.toLocaleLowerCase('id').includes(term))
      const statusMatch = !status || report.status === status
      const overdueMatch = section !== 'terlambat' || isOverdue(report)
      return textMatch && statusMatch && overdueMatch
    })
  }, [reports, search, status, section])

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
    if (draft.file && (!draft.file.type.startsWith('image/') || draft.file.size > 8 * 1024 * 1024)) {
      setError('Foto harus berupa gambar dengan ukuran maksimal 8 MB.')
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

  const openCount = reports.filter((report) => report.status === 'belum_diproses').length
  const progressCount = reports.filter((report) => report.status === 'diproses').length
  const doneCount = reports.filter((report) => report.status === 'selesai').length
  const activeSection = navigation.some((item) => item.id === section) ? section : 'dashboard'

  return (
    <main className="admin-shell">
      <header className="officer-topbar"><a className="brand" href="/"><span className="brand-mark">L</span><span>Lapor<span className="brand-accent">Unsri</span></span></a><div className="officer-account"><span>{profile.full_name}<small>Administrator</small></span><button className="button button-outline" onClick={onSignOut}>Keluar</button></div></header>
      <div className="admin-frame">
        <aside className="admin-nav"><span className="eyebrow">ADMINISTRASI</span><nav aria-label="Menu admin">{navigation.map((item) => <button key={item.id} className={activeSection === item.id ? 'admin-nav-item is-active' : 'admin-nav-item'} onClick={() => onNavigate(`/admin/${item.id}`)}>{item.label}{item.id === 'terlambat' && overdueReports.length > 0 && <b>{overdueReports.length}</b>}</button>)}</nav></aside>
        <section className="admin-content">
          <div className="student-welcome"><div><span className="eyebrow">PANEL ADMIN</span><h1>{activeSection === 'kategori' ? 'Kelola kategori' : activeSection === 'terlambat' ? 'Laporan perlu eskalasi' : activeSection === 'laporan' ? 'Semua laporan' : `Halo, ${profile.full_name}`}</h1><p>{activeSection === 'kategori' ? 'Tambah, ubah, dan hapus kategori laporan.' : activeSection === 'terlambat' ? `Belum diproses selama ${overdueAfterDays} hari atau lebih.` : 'Pantau laporan dan tindak lanjut fasilitas kampus.'}</p></div></div>
          {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
          {notice && <FeedbackMessage tone="success">{notice}</FeedbackMessage>}

          {activeSection === 'kategori' ? <section className="admin-panel"><form className="admin-add-category" onSubmit={(event) => void addCategory(event)}><input aria-label="Nama kategori baru" required maxLength={80} value={newCategory} onChange={(event) => setNewCategory(event.target.value)} placeholder="Nama kategori baru" /><button className="button button-primary" disabled={categoryBusy}>Tambah kategori</button></form><div className="admin-category-list">{categories.map((category) => <div className="admin-category-row" key={category.id}><input aria-label={`Nama kategori ${category.name}`} maxLength={80} value={categoryNames[category.id] ?? category.name} onChange={(event) => setCategoryNames((current) => ({ ...current, [category.id]: event.target.value }))} /><button className="button button-outline" disabled={categoryBusy || (categoryNames[category.id] ?? category.name).trim() === category.name} onClick={() => void saveCategory(category)}>Simpan</button><button className="button button-danger" disabled={categoryBusy} onClick={() => void removeCategory(category)}>Hapus</button></div>)}{!loading && categories.length === 0 && <p className="admin-empty">Belum ada kategori.</p>}</div></section> : <>
            {activeSection === 'dashboard' && <div className="summary-grid"><article className="summary-card"><span className="summary-label">Total laporan</span><strong>{loading ? '—' : reports.length}</strong><small>Seluruh laporan masuk</small></article><article className="summary-card"><span className="summary-label">Belum diproses</span><strong>{loading ? '—' : openCount}</strong><small>Menunggu tindak lanjut</small></article><article className="summary-card"><span className="summary-label">Sedang diproses</span><strong>{loading ? '—' : progressCount}</strong><small>Dalam penanganan</small></article><article className="summary-card"><span className="summary-label">Selesai</span><strong>{loading ? '—' : doneCount}</strong><small>Sudah ditangani</small></article><article className="summary-card admin-escalation-card"><span className="summary-label">Perlu eskalasi</span><strong>{loading ? '—' : overdueReports.length}</strong><small>Belum diproses ≥ {overdueAfterDays} hari</small></article></div>}
            {activeSection !== 'dashboard' && <div className="officer-list-heading"><div><h2>{activeSection === 'terlambat' ? 'Daftar laporan terlambat' : 'Daftar seluruh laporan'}</h2><p>{visibleReports.length} laporan ditampilkan</p></div><div className="officer-filters"><input aria-label="Cari laporan" placeholder="Cari laporan atau lokasi..." value={search} onChange={(event) => setSearch(event.target.value)} /><select aria-label="Filter status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Semua status</option>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div></div>}
            {activeSection === 'dashboard' && <div className="admin-dashboard-list"><div className="student-section-heading"><div><h2>Laporan terbaru</h2><p>Periksa laporan yang baru masuk.</p></div><button className="text-link" onClick={() => onNavigate('/admin/laporan')}>Lihat semua →</button></div></div>}
            {loading ? <div className="student-empty">Memuat laporan...</div> : visibleReports.length === 0 ? <div className="student-empty"><h2>{activeSection === 'terlambat' ? 'Tidak ada laporan yang perlu dieskalasi' : 'Belum ada laporan'}</h2><p>Laporan yang cocok akan muncul di sini.</p></div> : <div className="officer-report-list">{(activeSection === 'dashboard' ? visibleReports.slice(0, 5) : visibleReports).map((report) => {
              const draft = drafts[report.id] ?? { status: report.status, message: '', file: null }
              const ageInDays = Math.floor((Date.now() - Date.parse(report.created_at)) / (24 * 60 * 60 * 1000))
              return <article className="officer-report-card" key={report.id}><div className="officer-report-overview"><div className="report-card-meta"><span className={`status-pill status-${report.status}`}>{statusLabels[report.status]}</span><span>{report.categories?.name ?? 'Lainnya'}</span><time>{new Date(report.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</time>{isOverdue(report) && <b className="admin-overdue-tag">Terlambat {ageInDays} hari</b>}</div><h3>{report.title}</h3><p>{report.description}</p><div className="report-location">{report.faculty} · {report.building}{report.room ? ` · ${report.room}` : ''}</div><small className="officer-reporter">Pelapor: {report.profiles?.full_name ?? 'Mahasiswa'} · Dukungan {report.vote_count}</small>{report.photo_url && <a className="officer-evidence-link" href={report.photo_url} target="_blank" rel="noreferrer">Lihat foto laporan</a>}</div><form className="officer-update-form" onSubmit={(event) => void saveFollowUp(event, report)}><strong>Catatan dan status</strong><select aria-label={`Status baru untuk ${report.title}`} value={draft.status} onChange={(event) => setDraft(report, { status: event.target.value as ReportStatus })}>{Object.entries(statusLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><textarea required maxLength={1000} rows={3} placeholder="Tulis tindak lanjut untuk pelapor..." value={draft.message} onChange={(event) => setDraft(report, { message: event.target.value })} /><label className="officer-file-label">Foto bukti (opsional)<input type="file" accept="image/*" onChange={(event) => setDraft(report, { file: event.target.files?.[0] ?? null })} /></label><button className="button button-primary" disabled={busyId === report.id}>{busyId === report.id ? 'Menyimpan...' : 'Simpan tindak lanjut'}</button></form></article>
            })}</div>}
          </>}
        </section>
      </div>
    </main>
  )
}
