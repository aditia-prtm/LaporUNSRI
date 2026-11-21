import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Category, ReportInput } from '../../types/report'
import { createReport, getCachedCategories, getCachedReport, getCategories, getReport, updateReport, uploadReportPhoto } from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { FormSkeleton } from '../../components/common/Skeleton'
import { REPORT_PHOTO_MAX_BYTES, validateImageFile, validateReportInput } from '../../schemas/report'
import { FiArrowLeft, FiCamera, FiCheck, FiMapPin, FiX } from 'react-icons/fi'
import { LocationPickerMap } from '../../components/report/LocationPickerMap'

type ReportFormPageProps = {
  profile: UserProfile
  reportId?: string
  onNavigate: (path: string) => void
}

const emptyForm: ReportInput = {
  title: '',
  description: '',
  category_id: '',
  faculty: '',
  building: '',
  room: '',
  photo_url: null,
  latitude: null,
  longitude: null,
}

export function ReportFormPage({ profile, reportId, onNavigate }: ReportFormPageProps) {
  const editing = Boolean(reportId)
  const cachedReport = reportId ? getCachedReport(reportId) : null
  const [form, setForm] = useState<ReportInput>(() => {
    if (cachedReport) {
      return {
        title: cachedReport.title,
        description: cachedReport.description,
        category_id: cachedReport.category_id ?? '',
        faculty: cachedReport.faculty,
        building: cachedReport.building,
        room: cachedReport.room ?? '',
        photo_url: cachedReport.photo_url,
        latitude: cachedReport.latitude ?? null,
        longitude: cachedReport.longitude ?? null,
      }
    }
    return emptyForm
  })
  const [categories, setCategories] = useState<Category[]>(() => getCachedCategories() ?? [])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(() => editing && !cachedReport)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    const load = async () => {
      try {
        const nextCategories = await getCategories()
        if (!active) return
        setCategories(nextCategories)
        if (!editing || !reportId) return
        const report = await getReport(reportId, profile.id)
        if (report.user_id !== profile.id) throw new Error('Anda hanya dapat mengubah laporan milik sendiri.')
        setForm({
          title: report.title,
          description: report.description,
          category_id: report.category_id ?? '',
          faculty: report.faculty,
          building: report.building,
          room: report.room ?? '',
          photo_url: report.photo_url,
          latitude: report.latitude ?? null,
          longitude: report.longitude ?? null,
        })
      } catch (cause) {
        if (active) setError(cause instanceof Error ? cause.message : 'Data laporan gagal dimuat.')
      } finally {
        if (active) setLoading(false)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [editing, reportId, profile.id])

  const setField = (field: keyof ReportInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    const validationError = validateReportInput(form) ?? (file ? validateImageFile(file, REPORT_PHOTO_MAX_BYTES) : null)
    if (validationError) {
      setError(validationError)
      return
    }
    setBusy(true)
    try {
      const photoUrl = file ? await uploadReportPhoto(file, profile.id) : form.photo_url
      const payload: ReportInput = {
        ...form,
        room: form.room || '',
        photo_url: photoUrl,
        latitude: form.latitude ?? null,
        longitude: form.longitude ?? null,
      }
      if (reportId) {
        await updateReport(reportId, payload)
        onNavigate(`/mahasiswa/laporan/${reportId}`)
      } else {
        const newReportId = await createReport(payload, profile.id)
        onNavigate(`/mahasiswa/laporan/${newReportId}`)
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Laporan gagal disimpan.')
    } finally {
      setBusy(false)
    }
  }

  const inputClass =
    'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/20 transition'

  const selectClass =
    'h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-xs sm:text-sm text-slate-800 focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/20 transition cursor-pointer'

  return (
    <div className="w-full flex flex-col">
      {/* Navy Top Banner */}
      <section className="w-full bg-[#08315c] text-white px-4 sm:px-8 lg:px-12 py-8 shadow-inner">
        <div className="mx-auto max-w-[960px] space-y-3">
          <button
            type="button"
            onClick={() => onNavigate(reportId ? `/mahasiswa/laporan/${reportId}` : '/mahasiswa/laporan')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-200 hover:text-white transition cursor-pointer"
          >
            <FiArrowLeft className="size-4" aria-hidden="true" />
            <span>Kembali ke Laporan</span>
          </button>

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#ffbb00]">
              <span className="size-1.5 rounded-full bg-[#ffbb00]" aria-hidden="true" />
              <span>Formulir Aduan</span>
            </div>
            <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              {editing ? 'Ubah Informasi Laporan' : 'Laporkan Kerusakan Fasilitas'}
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-sky-100/80">
              Tuliskan deskripsi lengkap serta lokasi detail agar tim teknisi dan sarana prasarana dapat menangani dengan cepat.
            </p>
          </div>
        </div>
      </section>

      {/* Main Form Content */}
      <section className="w-full px-4 sm:px-8 lg:px-12 py-8">
        <div className="mx-auto max-w-[960px] space-y-6">
          {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}

          {loading ? (
            <FormSkeleton />
          ) : (
            <form
              className="space-y-6 rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-10 shadow-sm"
              onSubmit={(event) => void submit(event)}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 sm:col-span-2">
                  <span>
                    Judul Laporan <span className="text-rose-500">*</span>
                  </span>
                  <input
                    required
                    maxLength={120}
                    value={form.title}
                    onChange={(event) => setField('title', event.target.value)}
                    placeholder="Contoh: AC Ruang Kelas 203 Mati dan Bocor Air"
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 sm:col-span-2">
                  <span>
                    Kategori Kerusakan <span className="text-rose-500">*</span>
                  </span>
                  <select
                    required
                    value={form.category_id}
                    onChange={(event) => setField('category_id', event.target.value)}
                    className={selectClass}
                  >
                    <option value="">Pilih Kategori Fasilitas</option>
                    {categories.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 sm:col-span-2">
                  <span>
                    Deskripsi Masalah <span className="text-rose-500">*</span>
                  </span>
                  <textarea
                    required
                    minLength={10}
                    rows={4}
                    value={form.description}
                    onChange={(event) => setField('description', event.target.value)}
                    placeholder="Jelaskan secara rinci kronologi masalah, tingkat keparahan, serta dampaknya pada kegiatan perkuliahan..."
                    className="w-full rounded-xl border border-slate-200 bg-white p-4 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#08315c] focus:outline-none focus:ring-2 focus:ring-[#08315c]/20 transition resize-vertical"
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
                  <span>
                    Fakultas <span className="text-rose-500">*</span>
                  </span>
                  <input
                    required
                    value={form.faculty}
                    onChange={(event) => setField('faculty', event.target.value)}
                    placeholder="Contoh: Fakultas Ilmu Komputer"
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
                  <span>
                    Nama Gedung <span className="text-rose-500">*</span>
                  </span>
                  <input
                    required
                    value={form.building}
                    onChange={(event) => setField('building', event.target.value)}
                    placeholder="Contoh: Gedung Pengajaran Lt. 2"
                    className={inputClass}
                  />
                </label>

                <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 sm:col-span-2">
                  <div className="flex items-center justify-between">
                    <span>Ruang / Detail Lokasi</span>
                    <span className="text-[10px] text-slate-400">Opsional</span>
                  </div>
                  <input
                    value={form.room ?? ''}
                    onChange={(event) => setField('room', event.target.value)}
                    placeholder="Contoh: Lab Komputer Jaringan Ruang 2.4"
                    className={inputClass}
                  />
                </label>

                {/* Tandai Titik Lokasi Peta (Leaflet) */}
                <div className="flex flex-col gap-2 sm:col-span-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                      <FiMapPin className="size-4 text-[#08315c]" aria-hidden="true" />
                      <span>Titik Lokasi Real pada Peta</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Opsional · Leaflet GPS</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Tandai lokasi spesifik di peta kampus agar petugas teknisi dapat menuju titik masalah dengan cepat dan akurat.
                  </p>
                  <LocationPickerMap
                    value={{ latitude: form.latitude, longitude: form.longitude }}
                    onChange={(coords) => {
                      setForm((current) => ({
                        ...current,
                        latitude: coords?.latitude ?? null,
                        longitude: coords?.longitude ?? null,
                      }))
                    }}
                  />
                </div>

                <div className="flex flex-col gap-1.5 sm:col-span-2">
                  <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <FiCamera className="size-4 text-[#08315c]" aria-hidden="true" />
                      <span>Foto Bukti Kerusakan</span>
                    </span>
                    <span className="text-[10px] text-slate-400">Opsional · Maks. 5 MB</span>
                  </div>

                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 transition-all hover:border-[#08315c]/50">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                      className="w-full text-xs text-slate-600 file:mr-3 file:rounded-xl file:border-0 file:bg-[#08315c] file:px-4 file:py-2 file:text-xs file:font-semibold file:text-white file:cursor-pointer hover:file:bg-[#0c4278]"
                    />

                    {form.photo_url && !file && (
                      <div className="mt-3 flex items-center gap-3">
                        <img
                          className="size-16 rounded-xl object-cover border border-slate-200"
                          src={form.photo_url}
                          alt="Foto saat ini"
                        />
                        <span className="text-xs text-slate-500">Foto bukti yang tersimpan saat ini</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
                <button
                  type="button"
                  onClick={() => onNavigate(reportId ? `/mahasiswa/laporan/${reportId}` : '/mahasiswa/laporan')}
                  className="inline-flex min-h-[44px] items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 cursor-pointer"
                >
                  <FiX className="size-4" aria-hidden="true" />
                  <span>Batalkan</span>
                </button>

                <button
                  type="submit"
                  disabled={busy}
                  className="inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-[#08315c] hover:bg-[#0c4278] px-6 py-2.5 text-xs sm:text-sm font-bold text-white shadow-md transition hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                >
                  <FiCheck className="size-4 stroke-[3]" aria-hidden="true" />
                  <span>{busy ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Kirim Laporan'}</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
export default ReportFormPage
