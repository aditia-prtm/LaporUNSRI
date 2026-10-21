import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Report, ReportStatus } from '../../types/report'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { getReports, updateReportStatusWithEvidence, uploadReportPhoto } from '../../services/reportService'
import '../../components/layout/officer.css'

type Props = { profile: UserProfile; onSignOut: () => void }

const labels: Record<ReportStatus, string> = {
  belum_diproses: 'Belum diproses',
  diproses: 'Diproses',
  selesai: 'Selesai',
}

export function OfficerDashboardPage({ profile, onSignOut }: Props) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [busyId, setBusyId] = useState('')
  const [drafts, setDrafts] = useState<Record<string, { status: ReportStatus; message: string; file: File | null }>>({})

  const load = async () => {
    setError('')
    try {
      setReports(await getReports(profile.id))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Laporan gagal dimuat.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [profile.id])

  const visibleReports = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('id')
    return reports.filter((report) => (!status || report.status === status)
      && (!term || [report.title, report.description, report.faculty, report.building, report.room ?? '', report.profiles?.full_name ?? '']
        .some((value) => value.toLocaleLowerCase('id').includes(term))))
  }, [reports, search, status])

  const submitUpdate = async (event: FormEvent<HTMLFormElement>, report: Report) => {
    event.preventDefault()
    const draft = drafts[report.id]
    if (!draft?.file || !draft.message.trim()) {
      setError('Setiap tindak lanjut status wajib disertai foto bukti dan catatan.')
      return
    }
    if (!draft.file.type.startsWith('image/') || draft.file.size > 8 * 1024 * 1024) {
      setError('Pilih foto berformat gambar dengan ukuran maksimal 8 MB.')
      return
    }

    setBusyId(report.id)
    setError('')
    try {
      const photoUrl = await uploadReportPhoto(draft.file, profile.id)
      await updateReportStatusWithEvidence(report.id, draft.status, draft.message.trim(), photoUrl)
      setDrafts((current) => ({ ...current, [report.id]: { status: draft.status, message: '', file: null } }))
      await load()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Tindak lanjut gagal disimpan.')
    } finally {
      setBusyId('')
    }
  }

  const setDraft = (report: Report, patch: Partial<{ status: ReportStatus; message: string; file: File | null }>) => {
    setDrafts((current) => {
      const existing = current[report.id] ?? { status: report.status, message: '', file: null }
      return { ...current, [report.id]: { ...existing, ...patch } }
    })
  }

  const openCount = reports.filter((report) => report.status === 'belum_diproses').length
  const progressCount = reports.filter((report) => report.status === 'diproses').length
  const doneCount = reports.filter((report) => report.status === 'selesai').length

  return (
    <main className="officer-shell">
      <header className="officer-topbar"><a className="brand" href="/"><span className="brand-mark">L</span><span>Lapor<span className="brand-accent">Unsri</span></span></a><div className="officer-account"><span>{profile.full_name}<small>Petugas fasilitas</small></span><button className="button button-outline" onClick={onSignOut}>Keluar</button></div></header>
      <section className="officer-content">
        <div className="student-welcome"><div><span className="eyebrow">RUANG KERJA PETUGAS</span><h1>Halo, {profile.full_name}</h1><p>Tinjau laporan dan catat tindak lanjut dengan bukti foto.</p></div></div>
        {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
        <div className="summary-grid">
          <article className="summary-card"><span className="summary-label">Perlu diproses</span><strong>{loading ? '—' : openCount}</strong><small>Laporan belum ditangani</small></article>
          <article className="summary-card"><span className="summary-label">Sedang dikerjakan</span><strong>{loading ? '—' : progressCount}</strong><small>Laporan dalam tindak lanjut</small></article>
          <article className="summary-card"><span className="summary-label">Selesai</span><strong>{loading ? '—' : doneCount}</strong><small>Laporan sudah ditangani</small></article>
        </div>
        <div className="officer-list-heading"><div><h2>Daftar laporan</h2><p>{visibleReports.length} laporan ditampilkan</p></div><div className="officer-filters"><input aria-label="Cari laporan" placeholder="Cari laporan atau lokasi..." value={search} onChange={(event) => setSearch(event.target.value)} /><select aria-label="Filter status" value={status} onChange={(event) => setStatus(event.target.value)}><option value="">Semua status</option>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div></div>
        {loading ? <div className="student-empty">Memuat laporan...</div> : visibleReports.length === 0 ? <div className="student-empty"><h2>Tidak ada laporan</h2><p>Coba ubah pencarian atau filter status.</p></div> : <div className="officer-report-list">
          {visibleReports.map((report) => {
            const draft = drafts[report.id] ?? { status: report.status, message: '', file: null }
            return <article className="officer-report-card" key={report.id}>
              <div className="officer-report-overview"><div className="report-card-meta"><span className={`status-pill status-${report.status}`}>{labels[report.status]}</span><span>{report.categories?.name ?? 'Lainnya'}</span><time>{new Date(report.created_at).toLocaleDateString('id-ID', { dateStyle: 'medium' })}</time></div><h3>{report.title}</h3><p>{report.description}</p><div className="report-location">{report.faculty} · {report.building}{report.room ? ` · ${report.room}` : ''}</div><small className="officer-reporter">Pelapor: {report.profiles?.full_name ?? 'Mahasiswa'} · Dukungan {report.vote_count}</small>{report.photo_url && <a className="officer-evidence-link" href={report.photo_url} target="_blank" rel="noreferrer">Lihat foto laporan</a>}</div>
              <form className="officer-update-form" onSubmit={(event) => void submitUpdate(event, report)}><strong>Catat tindak lanjut</strong><select aria-label={`Status baru untuk ${report.title}`} value={draft.status} onChange={(event) => setDraft(report, { status: event.target.value as ReportStatus })}>{Object.entries(labels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select><textarea required maxLength={1000} rows={3} placeholder="Jelaskan tindakan atau hasil pemeriksaan..." value={draft.message} onChange={(event) => setDraft(report, { message: event.target.value })} /><label className="officer-file-label">Foto bukti <input required type="file" accept="image/*" onChange={(event) => setDraft(report, { file: event.target.files?.[0] ?? null })} /></label><button className="button button-primary" disabled={busyId === report.id}>{busyId === report.id ? 'Menyimpan...' : 'Simpan tindak lanjut'}</button></form>
            </article>
          })}
        </div>}
      </section>
    </main>
  )
}
