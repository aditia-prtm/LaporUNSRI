import { useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Report, ReportStatus } from '../../types/report'
import { Brand } from '../../components/common/Brand'
import { MetricCard } from '../../components/common/MetricCard'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { ReportFilters } from '../../components/report/ReportFilters'
import { ReportFollowUpCard } from '../../components/report/ReportFollowUpCard'
import type { ReportFollowUpDraft } from '../../components/report/ReportFollowUpCard'
import { countReportsByStatus, filterReports } from '../../utils/report'
import { FOLLOW_UP_PHOTO_MAX_BYTES, validateImageFile } from '../../schemas/report'
import { getReports, updateReportStatusWithEvidence, uploadReportPhoto } from '../../services/reportService'
import './officer.css'
type Props = { profile: UserProfile; onSignOut: () => void }

function loadOfficerReports(userId: string) {
  return getReports(userId)
}

export function OfficerDashboardPage({ profile, onSignOut }: Props) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ReportStatus | ''>('')
  const [busyId, setBusyId] = useState('')
  const [drafts, setDrafts] = useState<Record<string, ReportFollowUpDraft>>({})

  const load = async () => {
    setError('')
    try {
      setReports(await loadOfficerReports(profile.id))
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Laporan gagal dimuat.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    void loadOfficerReports(profile.id).then((nextReports) => {
      if (active) setReports(nextReports)
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Laporan gagal dimuat.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [profile.id])

  const visibleReports = useMemo(() => filterReports(reports, { search, status }), [reports, search, status])

  const submitUpdate = async (event: FormEvent<HTMLFormElement>, report: Report) => {
    event.preventDefault()
    const draft = drafts[report.id]
    if (!draft?.file || !draft.message.trim()) {
      setError('Setiap tindak lanjut status wajib disertai foto bukti dan catatan.')
      return
    }
    const fileError = validateImageFile(draft.file, FOLLOW_UP_PHOTO_MAX_BYTES)
    if (fileError) {
      setError(fileError)
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

  const setDraft = (report: Report, patch: Partial<ReportFollowUpDraft>) => {
    setDrafts((current) => {
      const existing = current[report.id] ?? { status: report.status, message: '', file: null }
      return { ...current, [report.id]: { ...existing, ...patch } }
    })
  }

  const { belum_diproses: openCount, diproses: progressCount, selesai: doneCount } = countReportsByStatus(reports)

  return (
    <main className="admin-shell">
      <header className="officer-topbar"><Brand /><div className="officer-account"><span>{profile.full_name}<small>Petugas fasilitas</small></span><button className="button button-outline" onClick={onSignOut}>Keluar</button></div></header>
      <section className="officer-content">
        <div className="student-welcome"><div><span className="eyebrow">RUANG KERJA PETUGAS</span><h1>Halo, {profile.full_name}</h1><p>Tinjau laporan dan catat tindak lanjut dengan bukti foto.</p></div></div>
        {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
        <div className="summary-grid">
          <MetricCard label="Perlu diproses" value={loading ? '—' : openCount} description="Laporan belum ditangani" />
          <MetricCard label="Sedang dikerjakan" value={loading ? '—' : progressCount} description="Laporan dalam tindak lanjut" />
          <MetricCard label="Selesai" value={loading ? '—' : doneCount} description="Laporan sudah ditangani" />
        </div>
        <div className="officer-list-heading">
          <div><h2>Daftar laporan</h2><p>{visibleReports.length} laporan ditampilkan</p></div>
          <ReportFilters className="officer-filters" search={search} status={status} onSearchChange={setSearch} onStatusChange={setStatus} />
        </div>
        {loading ? <div className="student-empty">Memuat laporan...</div> : visibleReports.length === 0 ? <div className="student-empty"><h2>Tidak ada laporan</h2><p>Coba ubah pencarian atau filter status.</p></div> : <div className="admin-dashboard-list">
          {visibleReports.map((report) => {
            const draft = drafts[report.id] ?? { status: report.status, message: '', file: null }
            return <ReportFollowUpCard
              key={report.id}
              report={report}
              draft={draft}
              busy={busyId === report.id}
              photoRequired
              submitLabel="Simpan tindak lanjut"
              onDraftChange={(patch) => setDraft(report, patch)}
              onSubmit={(event) => void submitUpdate(event, report)}
            />
          })}
        </div>}
      </section>
    </main>
  )
}
