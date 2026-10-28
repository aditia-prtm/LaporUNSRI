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
import { FiAlertCircle, FiCheckCircle, FiClock, FiLogOut, FiTool } from 'react-icons/fi'

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
    void loadOfficerReports(profile.id)
      .then((nextReports) => {
        if (active) setReports(nextReports)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Laporan gagal dimuat.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [profile.id])

  const visibleReports = useMemo(() => filterReports(reports, { search, status }), [reports, search, status])

  const submitUpdate = async (event: FormEvent<HTMLFormElement>, report: Report) => {
    event.preventDefault()
    const draft = drafts[report.id]
    if (!draft?.file || !draft.message.trim()) {
      setError('Setiap tindak lanjut status wajib disertai foto bukti dan catatan penanganan.')
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

      {/* Header Bar */}
      <header className="sticky top-0 z-30 flex h-18 w-full items-center justify-between border-b border-white/10 bg-[#031830]/85 px-6 sm:px-10 backdrop-blur-md">
        <Brand onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} />

        <div className="flex items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5">
            <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-[#0c4278] to-[#4899e8] text-xs font-bold text-white shadow-sm">
              {(profile.full_name || 'P').slice(0, 1).toUpperCase()}
            </div>
            <div className="hidden sm:block text-right">
              <strong className="block text-xs font-bold text-white">{profile.full_name}</strong>
              <small className="flex items-center justify-end gap-1 text-[10px] text-[#60b6ff]">
                <span className="size-1.5 rounded-full bg-[#60b6ff] shadow-[0_0_6px_#60b6ff]" />
                Petugas Fasilitas Sarpras
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

      {/* Dashboard Content */}
      <div className="relative z-10 mx-auto max-w-[1240px] px-4 sm:px-8 py-8 space-y-8">
        {/* Hero Welcome Box */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#051d38] via-[#04162a] to-[#020b17] p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/20">
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-amber-300">
              <FiTool className="size-3" />
              <span>Ruang Kerja Petugas Sarpras</span>
            </div>

            <h1 className="mt-3 font-['Poppins','Montserrat','Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Halo, {profile.full_name}{' '}
              <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#ffbb00]">
                siap bertugas?
              </span>
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#a4c1db] max-w-2xl leading-relaxed">
              Tinjau seluruh aduan kerusakan dari mahasiswa dan sivitas akademika UNSRI. Setiap pembaruan status wajib menyertakan foto dokumentasi penanganan nyata.
            </p>
          </div>
        </div>

        {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            label="Perlu Diproses Segera"
            value={loading ? '—' : openCount}
            description="Laporan baru menunggu tindak lanjut tim"
            icon={<FiAlertCircle />}
            iconClassName="text-amber-300 border-amber-400/30 from-amber-950/40 to-amber-900/20"
          />
          <MetricCard
            label="Sedang Dikerjakan"
            value={loading ? '—' : progressCount}
            description="Fasilitas dalam proses perbaikan lapangan"
            icon={<FiClock />}
            iconClassName="text-sky-300 border-sky-400/30 from-sky-950/40 to-sky-900/20"
          />
          <MetricCard
            label="Tuntas Selesai"
            value={loading ? '—' : doneCount}
            description="Laporan telah diverifikasi selesai dikerjakan"
            icon={<FiCheckCircle />}
            iconClassName="text-emerald-300 border-emerald-400/30 from-emerald-950/40 to-emerald-900/20"
          />
        </div>

        {/* Reports Listing Section */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-['Poppins','Montserrat','Outfit',sans-serif] text-lg font-bold text-white">
                Daftar Penugasan Fasilitas
              </h2>
              <p className="text-xs text-[#8cb6dc]">
                {visibleReports.length} laporan tersedia untuk ditindaklanjuti
              </p>
            </div>
          </div>

          <ReportFilters
            search={search}
            status={status}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
          />

          {loading ? (
            <div className="rounded-2xl border border-white/10 bg-[#072445]/45 p-12 text-center text-xs text-[#8cb6dc] backdrop-blur-md">
              Memuat penugasan laporan...
            </div>
          ) : visibleReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#072445]/30 p-12 text-center backdrop-blur-md">
              <FiCheckCircle className="size-10 text-emerald-400/50 mb-3" />
              <h3 className="text-sm font-bold text-white">Tidak Ada Laporan yang Perlu Ditindaklanjuti</h3>
              <p className="mt-1 text-xs text-[#8cb6dc] max-w-sm">
                Semua laporan sesuai filter sudah tertangani dengan baik atau belum ada laporan baru.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleReports.map((report) => {
                const draft = drafts[report.id] ?? { status: report.status, message: '', file: null }
                return (
                  <ReportFollowUpCard
                    key={report.id}
                    report={report}
                    draft={draft}
                    busy={busyId === report.id}
                    photoRequired
                    submitLabel="Simpan Tindak Lanjut & Bukti"
                    onDraftChange={(patch) => setDraft(report, patch)}
                    onSubmit={(event) => void submitUpdate(event, report)}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
export default OfficerDashboardPage
