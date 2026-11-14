import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Report, ReportStatus } from '../../types/report'
import { formatDate } from '../../utils/date'
import {
  FiAlertTriangle,
  FiArrowUpRight,
  FiCamera,
  FiCheck,
  FiCopy,
  FiMap,
  FiMapPin,
  FiTool,
  FiUser,
} from 'react-icons/fi'
import { LocationViewerMap } from './LocationViewerMap'

export type ReportFollowUpDraft = {
  status: ReportStatus
  message: string
  file: File | null
}

type ReportFollowUpCardProps = {
  report: Report
  draft: ReportFollowUpDraft
  busy: boolean
  photoRequired: boolean
  submitLabel?: string
  overdueDays?: number
  onDraftChange: (patch: Partial<ReportFollowUpDraft>) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onTakeAssignment?: (report: Report) => void
}

export function ReportFollowUpCard({
  report,
  draft,
  busy,
  photoRequired,
  submitLabel = 'Selesaikan & Minta Konfirmasi Pelapor',
  overdueDays,
  onDraftChange,
  onSubmit,
  onTakeAssignment,
}: ReportFollowUpCardProps) {
  const [showMap, setShowMap] = useState(true)
  const [copiedCoords, setCopiedCoords] = useState(false)

  const hasCoordinates = typeof report.latitude === 'number' && typeof report.longitude === 'number'

  const handleCopyCoords = async () => {
    if (!hasCoordinates) return
    try {
      await navigator.clipboard.writeText(`${report.latitude?.toFixed(6)}, ${report.longitude?.toFixed(6)}`)
      setCopiedCoords(true)
      setTimeout(() => setCopiedCoords(false), 2000)
    } catch {
      // fallback
    }
  }

  return (
    <article className="group relative grid grid-cols-1 lg:grid-cols-[1fr_minmax(300px,380px)] gap-6 rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-7 shadow-sm transition-all duration-200 hover:border-[#08315c]/40 hover:shadow-md">
      {/* Left: Report Overview */}
      <div className="flex flex-col justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-slate-500">
            {report.status === 'belum_diproses' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200/80 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                <span className="size-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                <span>Belum diproses</span>
              </span>
            ) : report.status === 'diproses' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 text-xs font-semibold text-sky-700">
                <span className="size-1.5 rounded-full bg-sky-500" aria-hidden="true" />
                <span>Diproses</span>
              </span>
            ) : report.status === 'menunggu_konfirmasi' ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 border border-indigo-200/80 px-2.5 py-0.5 text-xs font-semibold text-indigo-700">
                <span className="size-1.5 rounded-full bg-indigo-500" aria-hidden="true" />
                <span>Menunggu Konfirmasi</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                <FiCheck className="size-3 stroke-[2.5]" aria-hidden="true" />
                <span>Selesai</span>
              </span>
            )}

            <span className="rounded-full bg-slate-100 border border-slate-200 px-2.5 py-0.5 text-[10px] font-semibold text-slate-600">
              {report.categories?.name ?? 'Umum'}
            </span>
            <time className="text-[11px] text-slate-500">{formatDate(report.created_at)}</time>

            {overdueDays !== undefined && (
              <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 border border-rose-200 px-2.5 py-0.5 text-[10px] font-bold text-rose-700">
                <FiAlertTriangle className="size-3 text-rose-500" aria-hidden="true" />
                <span>Terlambat {overdueDays} hari</span>
              </span>
            )}
          </div>

          <h3 className="mt-3.5 text-base sm:text-lg font-bold text-slate-800 transition-colors group-hover:text-[#08315c]">
            {report.title}
          </h3>

          <p className="mt-2 text-xs leading-relaxed text-slate-600 line-clamp-3">
            {report.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <FiMapPin className="size-3.5 text-[#08315c]" aria-hidden="true" />
              <span>
                {report.faculty} · {report.building}
                {report.room ? ` · ${report.room}` : ''}
              </span>
            </div>
          </div>

          {/* Titik Lokasi Peta & Koordinat */}
          {hasCoordinates ? (
            <div className="mt-3.5 rounded-2xl border border-slate-200/90 bg-slate-50/70 p-3.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#08315c]">
                  <FiMapPin className="size-4 text-[#ffbb00] shrink-0" aria-hidden="true" />
                  <span>Titik Lokasi Kerusakan (Peta Leaflet)</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowMap((prev) => !prev)}
                    className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                    title={showMap ? 'Sembunyikan tampilan peta' : 'Tampilkan peta interaktif'}
                  >
                    <FiMap className="size-3 text-[#08315c]" aria-hidden="true" />
                    <span>{showMap ? 'Sembunyikan Peta' : 'Buka Peta'}</span>
                  </button>

                  <a
                    href={`https://www.google.com/maps?q=${report.latitude},${report.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 rounded-lg bg-[#08315c] px-2.5 py-1 text-[11px] font-bold text-white hover:bg-[#0c4278] transition"
                    title="Buka rute navigasi di Google Maps"
                  >
                    <span>Google Maps</span>
                    <FiArrowUpRight className="size-3" aria-hidden="true" />
                  </a>
                </div>
              </div>

              {/* Readout koordinat presisi */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl bg-white border border-slate-200/80 px-3 py-1.5 text-xs">
                <span className="font-mono text-slate-700 font-semibold">
                  Lat: {report.latitude?.toFixed(6)}, Lng: {report.longitude?.toFixed(6)}
                </span>
                <button
                  type="button"
                  onClick={() => void handleCopyCoords()}
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-[#08315c] transition cursor-pointer"
                >
                  {copiedCoords ? (
                    <>
                      <FiCheck className="size-3 text-emerald-600 stroke-[3]" aria-hidden="true" />
                      <span className="text-emerald-700 font-bold">Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <FiCopy className="size-3 text-slate-400" aria-hidden="true" />
                      <span>Salin Koordinat</span>
                    </>
                  )}
                </button>
              </div>

              {/* Render Peta Interaktif Leaflet jika showMap aktif */}
              {showMap && (
                <LocationViewerMap
                  latitude={report.latitude!}
                  longitude={report.longitude!}
                  title={report.title}
                  locationName={`${report.faculty} · ${report.building}${report.room ? ` · ${report.room}` : ''}`}
                  mapHeight="h-52 sm:h-56"
                  showBottomBar={false}
                />
              )}
            </div>
          ) : (
            <div className="mt-3 flex items-center gap-2 rounded-xl bg-slate-50 border border-slate-200/70 px-3 py-2 text-xs text-slate-400">
              <FiMapPin className="size-3.5 text-slate-300 shrink-0" aria-hidden="true" />
              <span>Koordinat peta tidak ditandai pada laporan ini</span>
            </div>
          )}

          <div className="mt-3 flex items-center gap-1.5 text-[11px] text-slate-500">
            <FiUser className="size-3 text-slate-400" aria-hidden="true" />
            <span>
              Pelapor: <strong className="text-slate-700 font-semibold">{report.profiles?.full_name ?? 'Mahasiswa'}</strong> · Dukungan {report.vote_count}
            </span>
          </div>
        </div>

        {report.photo_url && (
          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
            <a
              href={report.photo_url}
              target="_blank"
              rel="noreferrer"
              className="group/photo relative block size-16 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100"
              title="Klik untuk memperbesar foto bukti"
            >
              <img
                src={report.photo_url}
                alt="Foto bukti kerusakan"
                className="size-full object-cover transition-transform group-hover/photo:scale-110"
              />
            </a>
            <div className="flex flex-col gap-0.5">
              <a
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#08315c] hover:underline transition-colors"
                href={report.photo_url}
                target="_blank"
                rel="noreferrer"
              >
                <span>Foto Bukti Kerusakan</span>
                <FiArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
              <span className="text-[11px] text-slate-400">Klik thumbnail untuk melihat ukuran penuh</span>
            </div>
          </div>
        )}
      </div>

      {/* Right: Follow-up Action Form */}
      {report.status === 'menunggu_konfirmasi' ? (
        <div className="flex flex-col justify-center rounded-2xl border border-indigo-100 bg-indigo-50/50 p-6 text-center lg:border-t-0 lg:border-l lg:rounded-none lg:bg-transparent lg:p-0 lg:pl-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-700">
            <FiCheck className="size-6 stroke-[2.5]" aria-hidden="true" />
          </div>
          <h4 className="mt-3 text-sm font-bold text-slate-800">Menunggu Konfirmasi Pelapor</h4>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Bukti penanganan telah dicatat. Sistem sedang menunggu konfirmasi dari mahasiswa pelapor apakah fasilitas sudah benar-benar berfungsi normal.
          </p>
        </div>
      ) : report.status === 'selesai' ? (
        <div className="flex flex-col justify-center rounded-2xl border border-emerald-100 bg-emerald-50/50 p-6 text-center lg:border-t-0 lg:border-l lg:rounded-none lg:bg-transparent lg:p-0 lg:pl-6">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <FiCheck className="size-6 stroke-[3]" aria-hidden="true" />
          </div>
          <h4 className="mt-3 text-sm font-bold text-slate-800">Laporan Telah Tuntas</h4>
          <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
            Penanganan fasilitas telah selesai dan telah dikonfirmasi tuntas oleh pelapor. Status bersifat final.
          </p>
        </div>
      ) : report.status === 'belum_diproses' ? (
        /* Status: Belum Diproses -> Aksi 'Ambil Tugas / Tindak Lanjuti' seperti ambil orderan */
        <div className="flex flex-col justify-between rounded-2xl border border-amber-200/80 bg-amber-50/40 p-5 sm:p-6 lg:border-t-0 lg:border-l lg:rounded-none lg:bg-transparent lg:p-0 lg:pl-6">
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-[11px] font-bold text-amber-800">
                <span className="size-2 rounded-full bg-amber-500 animate-pulse" aria-hidden="true" />
                <span>Aduan Baru Masuk</span>
              </span>
              <span className="text-[11px] font-medium text-slate-500">Antrean Siap Diambil</span>
            </div>

            <div>
              <h4 className="text-sm sm:text-base font-extrabold text-slate-800">
                Tindak Lanjuti Laporan
              </h4>
              <p className="mt-1 text-xs leading-relaxed text-slate-600">
                Laporan ini belum ada petugas yang menangani. Ambil tugas ini untuk memulai proses investigasi dan perbaikan di lokasi fasilitas kampus.
              </p>
            </div>

            <div className="rounded-xl border border-slate-200/90 bg-white p-3.5 text-xs text-slate-600 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Gedung / Fakultas:</span>
                <strong className="text-slate-800">{report.faculty} · {report.building}</strong>
              </div>
              <div className="flex items-center justify-between border-t border-slate-100 pt-1.5">
                <span className="text-slate-500">Dukungan Mahasiswa:</span>
                <span className="font-bold text-[#08315c]">{report.vote_count} orang mengalami ini</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3.5 border-t border-slate-100">
            <button
              type="button"
              disabled={busy}
              onClick={() => onTakeAssignment?.(report)}
              className="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-[#08315c] hover:bg-[#0c4278] px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              <FiTool className="size-4 text-[#ffbb00]" aria-hidden="true" />
              <span>{busy ? 'Mengambil Tugas...' : 'Tindak Lanjuti Laporan Ini'}</span>
            </button>
            <p className="mt-2 text-center text-[10px] text-slate-400">
              Laporan akan langsung beralih ke status <strong>"Diproses"</strong> atas nama Anda
            </p>
          </div>
        </div>
      ) : (
        /* Status: Diproses -> Formulir Selesaikan Perbaikan & Minta Konfirmasi */
        <form
          className="flex flex-col justify-between gap-3.5 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6"
          onSubmit={onSubmit}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-100 border border-sky-200 px-3 py-1 text-[11px] font-bold text-sky-800">
                <span className="size-1.5 rounded-full bg-sky-600 animate-ping" aria-hidden="true" />
                <span>Sedang Ditangani</span>
              </span>
              <span className="text-[11px] font-semibold text-[#08315c]">Tahap Pengerjaan</span>
            </div>

            <div className="rounded-xl border border-sky-100 bg-sky-50/70 p-3 text-xs leading-relaxed text-sky-950">
              <strong>Penanganan Berjalan:</strong> Lakukan perbaikan fasilitas, lalu unggah foto bukti dan catatan penanganan untuk meminta konfirmasi pelapor.
            </div>

            <label className="block text-xs font-semibold text-slate-700">
              <span className="mb-1 block text-[11px] text-slate-500">
                Catatan Hasil Penanganan <span className="text-rose-500">*</span>
              </span>
              <textarea
                required
                maxLength={1000}
                rows={3}
                placeholder={
                  photoRequired
                    ? 'Jelaskan tindakan perbaikan yang telah dilakukan di lapangan...'
                    : 'Tuliskan catatan tindak lanjut perbaikan...'
                }
                value={draft.message}
                onChange={(event) => onDraftChange({ message: event.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-800 placeholder:text-slate-400 focus:bg-white focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/15 transition resize-vertical"
              />
            </label>

            <label className="block text-xs font-semibold text-slate-700">
              <span className="mb-1 flex items-center justify-between text-[11px] text-slate-500">
                <span className="inline-flex items-center gap-1">
                  <FiCamera className="size-3.5 text-[#08315c]" aria-hidden="true" />
                  <span>Foto Bukti Penanganan Selesai</span>
                </span>
                <span className="text-[10px] text-slate-400">{photoRequired ? 'Wajib' : 'Opsional'}</span>
              </span>
              <input
                required={photoRequired}
                type="file"
                accept="image/*"
                onChange={(event) => onDraftChange({ file: event.target.files?.[0] ?? null })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2 text-xs text-slate-600 file:mr-2.5 file:rounded-lg file:border-0 file:bg-[#08315c] file:px-3 file:py-1 file:text-xs file:font-semibold file:text-white file:cursor-pointer hover:file:bg-[#0c4278]"
              />
            </label>
          </div>

          <button
            type="submit"
            disabled={busy}
            className="mt-2 flex min-h-[46px] w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 px-5 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FiCheck className="size-4 stroke-[3]" aria-hidden="true" />
            <span>{busy ? 'Menyimpan...' : submitLabel}</span>
          </button>
        </form>
      )}
    </article>
  )
}
export default ReportFollowUpCard
