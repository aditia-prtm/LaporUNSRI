import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { motion } from 'framer-motion'
import type { UserProfile } from '../../types/auth'
import type { Report, ReportStatus } from '../../types/report'
import { Brand } from '../../components/common/Brand'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { ReportCardSkeleton, Skeleton } from '../../components/common/Skeleton'
import { ReportFilters } from '../../components/report/ReportFilters'
import { ReportFollowUpCard } from '../../components/report/ReportFollowUpCard'
import type { ReportFollowUpDraft } from '../../components/report/ReportFollowUpCard'
import { countReportsByStatus, filterReports } from '../../utils/report'
import { FOLLOW_UP_PHOTO_MAX_BYTES, validateImageFile } from '../../schemas/report'
import { getReports, updateReportStatusWithEvidence, uploadReportPhoto } from '../../services/reportService'
import { FiAlertCircle, FiCheck, FiClock, FiInbox, FiTool } from 'react-icons/fi'

type Props = {
  profile: UserProfile
  onNavigate?: (path: string) => void
}

function loadOfficerReports(userId: string) {
  return getReports(userId)
}

export function OfficerDashboardPage({ profile, onNavigate }: Props) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<ReportStatus | ''>('')
  const [busyId, setBusyId] = useState('')
  const [drafts, setDrafts] = useState<Record<string, ReportFollowUpDraft>>({})
  const navRef = useRef<HTMLElement>(null)
  const [pillStyle, setPillStyle] = useState<{ left: number; width: number } | null>(null)

  useLayoutEffect(() => {
    const updatePill = () => {
      if (!navRef.current) return
      const activeBtn = navRef.current.querySelector<HTMLButtonElement>(`[data-status="${status}"]`)
      if (activeBtn) {
        setPillStyle({
          left: activeBtn.offsetLeft,
          width: activeBtn.offsetWidth,
        })
      } else {
        setPillStyle(null)
      }
    }
    updatePill()
    window.addEventListener('resize', updatePill)
    return () => window.removeEventListener('resize', updatePill)
  }, [status])

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
    const defaultStatus: ReportStatus = report.status === 'belum_diproses' ? 'diproses' : 'menunggu_konfirmasi'
    const draft = drafts[report.id] ?? { status: defaultStatus, message: '', file: null }
    if (!draft.file || !draft.message.trim()) {
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
      const nextStatus = draft.status || defaultStatus
      await updateReportStatusWithEvidence(report.id, nextStatus, draft.message.trim(), photoUrl)
      setDrafts((current) => ({ ...current, [report.id]: { status: nextStatus, message: '', file: null } }))
      await load()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Tindak lanjut gagal disimpan.')
    } finally {
      setBusyId('')
    }
  }

  const setDraft = (report: Report, patch: Partial<ReportFollowUpDraft>) => {
    setDrafts((current) => {
      const defaultStatus: ReportStatus = report.status === 'belum_diproses' ? 'diproses' : 'menunggu_konfirmasi'
      const existing = current[report.id] ?? { status: defaultStatus, message: '', file: null }
      return { ...current, [report.id]: { ...existing, ...patch } }
    })
  }

  const { belum_diproses: openCount, diproses: progressCount, menunggu_konfirmasi: waitingCount, selesai: doneCount } = countReportsByStatus(reports)

  const queueTabs: { label: string; value: ReportStatus | ''; count: number }[] = [
    { label: 'Semua Aduan', value: '', count: reports.length },
    { label: 'Perlu Ditangani Segera', value: 'belum_diproses', count: openCount },
    { label: 'Sedang Dikerjakan', value: 'diproses', count: progressCount },
    { label: 'Menunggu Konfirmasi', value: 'menunggu_konfirmasi', count: waitingCount },
    { label: 'Tuntas Selesai', value: 'selesai', count: doneCount },
  ]

  const avatarLetter = (profile.full_name || 'P').slice(0, 1).toUpperCase()

  return (
    <div className="min-h-screen w-full bg-[#f4f7fb] font-['Poppins','Montserrat','Outfit',system-ui,sans-serif] text-slate-800 antialiased flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-[#08315c] border-b border-white/10 shadow-md">
        <div className="mx-auto flex h-18 w-full max-w-[1280px] items-center justify-between px-4 sm:px-8 lg:px-12">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <Brand
              showSubtitle={false}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-white"
            />
          </div>

          {/* Center Tabs (Desktop) */}
          <nav ref={navRef} className="relative hidden lg:flex items-center gap-1.5 bg-[#062445]/60 p-1.5 rounded-full border border-white/10" aria-label="Antrean Tugas Petugas">
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
            {queueTabs.map((tab) => {
              const isActive = status === tab.value
              return (
                <button
                  key={tab.label}
                  data-status={tab.value}
                  type="button"
                  onClick={() => setStatus(tab.value)}
                  className={`relative z-10 min-h-[38px] rounded-full px-4 py-1.5 text-xs font-bold transition-colors duration-200 cursor-pointer flex items-center gap-2 select-none ${
                    isActive
                      ? 'text-[#08315c]'
                      : 'text-white/80 hover:text-white'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10px] font-bold transition-colors ${isActive ? 'bg-[#08315c] text-white' : 'bg-white/15 text-sky-200'}`}>
                    {loading ? '...' : tab.count}
                  </span>
                </button>
              )
            })}
          </nav>

          {/* Right: Officer Profile (Navigates to Settings) */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => onNavigate?.('/petugas/pengaturan')}
              title="Buka Pengaturan Profil & Akun"
              className="flex items-center gap-2.5 rounded-full py-1.5 pl-2 pr-4 bg-white/5 hover:bg-white/15 border border-white/10 transition cursor-pointer select-none group"
            >
              <div
                className="grid size-8 place-items-center rounded-full bg-[#ffbb00] text-xs font-bold text-[#08315c] shadow-sm select-none group-hover:scale-105 transition-transform"
                aria-hidden="true"
              >
                {avatarLetter}
              </div>
              <div className="hidden sm:block text-left">
                <span className="block text-xs font-bold text-white max-w-[160px] truncate group-hover:text-[#ffbb00] transition-colors">
                  {profile.full_name}
                </span>
                <span className="block text-[10px] text-[#ffbb00]">Petugas Sarpras</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Blue Hero Header Zone */}
      <section className="w-full bg-[#08315c] text-white px-4 sm:px-8 lg:px-12 pt-8 pb-20 sm:pb-24 shadow-inner">
        <div className="mx-auto max-w-[1280px]">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffbb00]">
            <FiTool className="size-3" aria-hidden="true" />
            <span>Ruang Kerja Petugas Sarpras</span>
          </div>

          <h1 className="mt-3 text-3xl sm:text-4xl lg:text-[40px] font-bold tracking-tight text-white leading-[1.15]">
            Halo, {profile.full_name}{' '}
            <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#ffbb00]">
              siap bertugas?
            </span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-sky-100/90 max-w-2xl leading-relaxed">
            Tinjau seluruh aduan kerusakan dari mahasiswa dan sivitas akademika UNSRI. Setiap pembaruan status wajib menyertakan foto dokumentasi penanganan nyata di lapangan.
          </p>
        </div>
      </section>

      {/* Floating 3 Metric Cards */}
      <section className="-mt-12 sm:-mt-14 relative z-10 w-full px-4 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-[1280px] grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-6">
          <div className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 inline-flex items-center gap-1.5">
              <FiAlertCircle className="size-3.5 text-amber-500" aria-hidden="true" />
              <span>Perlu Diproses Segera</span>
            </span>
            {loading ? (
              <Skeleton className="h-9 w-14 mt-2" />
            ) : (
              <strong className="block text-3xl sm:text-4xl font-extrabold text-[#08315c] mt-2">
                {openCount}
              </strong>
            )}
          </div>

          <div className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 inline-flex items-center gap-1.5">
              <FiClock className="size-3.5 text-sky-500" aria-hidden="true" />
              <span>Sedang Dikerjakan</span>
            </span>
            {loading ? (
              <Skeleton className="h-9 w-14 mt-2" />
            ) : (
              <strong className="block text-3xl sm:text-4xl font-extrabold text-[#08315c] mt-2">
                {progressCount}
              </strong>
            )}
          </div>

          <div className="rounded-2xl sm:rounded-3xl bg-white p-5 sm:p-7 shadow-xl shadow-slate-900/5 border border-slate-100 flex flex-col justify-between">
            <span className="text-xs font-semibold text-slate-500 inline-flex items-center gap-1.5">
              <FiCheck className="size-3.5 text-emerald-500 stroke-[2.5]" aria-hidden="true" />
              <span>Tuntas Selesai</span>
            </span>
            {loading ? (
              <Skeleton className="h-9 w-14 mt-2" />
            ) : (
              <strong className="block text-3xl sm:text-4xl font-extrabold text-[#08315c] mt-2">
                {doneCount}
              </strong>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="w-full px-4 sm:px-8 lg:px-12 pt-10 pb-16 flex-1">
        <div className="mx-auto max-w-[1280px] space-y-6">
          {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#08315c] tracking-tight">
                Daftar Penugasan Fasilitas
              </h2>
              <p className="text-xs text-slate-500">
                {visibleReports.length} laporan siap ditindaklanjuti dan diperbarui statusnya
              </p>
            </div>

            {/* Mobile Queue Filter Buttons */}
            <div className="flex flex-wrap gap-1.5 lg:hidden" role="tablist">
              {queueTabs.map((tab) => (
                <button
                  key={tab.label}
                  type="button"
                  onClick={() => setStatus(tab.value)}
                  className={`rounded-full px-3 py-1 text-xs font-bold transition ${
                    status === tab.value
                      ? 'bg-[#08315c] text-white'
                      : 'bg-white border border-slate-200 text-slate-600'
                  }`}
                >
                  {tab.label} ({loading ? '...' : tab.count})
                </button>
              ))}
            </div>
          </div>

          {/* Filter Component */}
          <ReportFilters
            search={search}
            status={status}
            onSearchChange={setSearch}
            onStatusChange={setStatus}
          />

          {loading ? (
            <ReportCardSkeleton count={3} />
          ) : visibleReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white p-14 text-center shadow-sm">
              <FiInbox className="size-10 text-slate-400 mb-3" aria-hidden="true" />
              <h3 className="text-sm font-bold text-slate-800">Tidak Ada Laporan di Antrean Ini</h3>
              <p className="mt-1 text-xs text-slate-500 max-w-sm">
                {status
                  ? 'Tidak ada laporan yang berstatus ini atau semua aduan sudah diproses.'
                  : 'Seluruh aduan sarpras kampus saat ini telah tertangani.'}
              </p>
              {status && (
                <button
                  type="button"
                  onClick={() => setStatus('')}
                  className="mt-4 rounded-xl bg-[#08315c] text-white px-5 py-2 text-xs font-bold hover:bg-[#0c4278]"
                >
                  Tampilkan Semua Antrean
                </button>
              )}
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
      </section>
    </div>
  )
}
export default OfficerDashboardPage
