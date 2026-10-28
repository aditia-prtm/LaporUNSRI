import { useEffect, useState } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Report } from '../../types/report'
import { getReports } from '../../services/reportService'
import { MetricCard } from '../../components/common/MetricCard'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { ReportStatusBadge } from '../../components/report/ReportStatusBadge'
import { countReportsByStatus } from '../../utils/report'
import { FiArrowRight, FiCheckCircle, FiClock, FiFileText, FiHeart, FiMapPin, FiPlus } from 'react-icons/fi'

type StudentDashboardPageProps = { profile: UserProfile; onNavigate: (path: string) => void }

export function StudentDashboardPage({ profile, onNavigate }: StudentDashboardPageProps) {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void getReports(profile.id)
      .then((data) => {
        if (active) setReports(data)
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Ringkasan gagal dimuat.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [profile.id])

  const mine = reports.filter((report) => report.user_id === profile.id)
  const { diproses: inProgress, selesai: completed } = countReportsByStatus(mine)
  const recent = reports.slice(0, 4)

  return (
    <div className="space-y-8">
      {/* Welcome Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#051d38] via-[#04162a] to-[#020b17] p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/20">
        <div
          className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[#4899e8]/15 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#60b6ff]/30 bg-[#60b6ff]/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fc3ee]">
              <span className="size-1.5 rounded-full bg-[#60b6ff] shadow-[0_0_8px_#60b6ff]" />
              <span>Portal Mahasiswa</span>
            </div>

            <h1 className="mt-3 font-['Poppins','Montserrat','Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Halo, {profile.full_name}{' '}
              <span className="font-['Instrument_Serif','Playfair_Display',Georgia,serif] italic font-normal text-[#ffbb00]">
                selamat datang!
              </span>
            </h1>

            <p className="mt-2 text-xs sm:text-sm text-[#a4c1db] max-w-[620px] leading-relaxed">
              Pantau laporan fasilitas kampus Universitas Sriwijaya, berikan dukungan pada isu serupa, dan ikuti tindak lanjut perbaikannya secara transparan.
            </p>
          </div>

          <button
            type="button"
            onClick={() => onNavigate('/mahasiswa/laporan/baru')}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#60b6ff] via-[#48a6ff] to-[#2b8ced] px-5 py-3 text-xs sm:text-sm font-bold text-[#021427] shadow-[0_4px_20px_rgba(58,147,232,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(58,147,232,0.6)] hover:brightness-105 active:translate-y-0 cursor-pointer"
          >
            <FiPlus className="size-4 stroke-[2.5]" />
            <span>Buat Laporan Baru</span>
          </button>
        </div>
      </div>

      {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <MetricCard
          label="Laporan Saya"
          value={loading ? '—' : mine.length}
          description="Total keluhan fasilitas yang Anda laporkan"
          icon={<FiFileText />}
        />
        <MetricCard
          label="Sedang Diproses"
          value={loading ? '—' : inProgress}
          description="Laporan Anda dalam penanganan petugas"
          icon={<FiClock />}
          iconClassName="text-amber-300 border-amber-400/30 from-amber-950/40 to-amber-900/20"
        />
        <MetricCard
          label="Tuntas Selesai"
          value={loading ? '—' : completed}
          description="Fasilitas telah rampung diperbaiki"
          icon={<FiCheckCircle />}
          iconClassName="text-emerald-300 border-emerald-400/30 from-emerald-950/40 to-emerald-900/20"
        />
      </div>

      {/* Recent Reports List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-['Poppins','Montserrat','Outfit',sans-serif] text-lg font-bold text-white">
              Laporan Kampus Terbaru
            </h2>
            <p className="text-xs text-[#8cb6dc]">
              Masalah fasilitas yang baru saja dilaporkan oleh komunitas kampus.
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('/mahasiswa/laporan')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#60b6ff] hover:text-[#93d5ba] transition-colors cursor-pointer"
          >
            <span>Lihat Semua</span>
            <FiArrowRight className="size-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-white/10 bg-[#072445]/45 p-8 text-center text-xs text-[#8cb6dc] backdrop-blur-md">
            Memuat daftar laporan...
          </div>
        ) : recent.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-[#072445]/30 p-10 text-center backdrop-blur-md">
            <FiFileText className="size-10 text-[#60b6ff]/50 mb-3" />
            <h3 className="text-sm font-bold text-white">Belum Ada Laporan</h3>
            <p className="mt-1 text-xs text-[#8cb6dc] max-w-sm">
              Jadilah yang pertama melaporkan kendala fasilitas di kampus Anda agar segera ditindaklanjuti.
            </p>
            <button
              type="button"
              onClick={() => onNavigate('/mahasiswa/laporan/baru')}
              className="mt-4 rounded-xl bg-gradient-to-r from-[#60b6ff] to-[#2b8ced] px-4 py-2 text-xs font-bold text-[#021427]"
            >
              Buat Laporan Sekarang
            </button>
          </div>
        ) : (
          <div className="divide-y divide-white/10 rounded-2xl border border-white/10 bg-[#072445]/45 backdrop-blur-md shadow-lg shadow-black/20 overflow-hidden">
            {recent.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => onNavigate(`/mahasiswa/laporan/${report.id}`)}
                className="group flex w-full flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 sm:p-5 text-left transition hover:bg-[#0b2f59]/60 cursor-pointer"
              >
                <div className="flex items-start gap-3.5 min-w-0 flex-1">
                  <div className="mt-1 size-2 rounded-full bg-[#60b6ff] shadow-[0_0_8px_#60b6ff] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <strong className="block truncate text-sm font-bold text-white transition-colors group-hover:text-[#c4e4ff]">
                      {report.title}
                    </strong>
                    <div className="mt-1 flex items-center gap-1.5 text-xs text-[#8cb6dc]">
                      <FiMapPin className="size-3 text-[#60b6ff]" />
                      <span className="truncate">
                        {report.faculty} · {report.building}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center shrink-0">
                  <ReportStatusBadge status={report.status} />
                  <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-semibold text-[#cce5fb]">
                    <FiHeart className="size-3 text-rose-400" />
                    <span>{report.vote_count}</span>
                  </div>
                  <FiArrowRight className="size-4 text-[#8cb6dc] transition-transform group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default StudentDashboardPage
