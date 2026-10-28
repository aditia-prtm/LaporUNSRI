import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Category, ReportInput } from '../../types/report'
import { createReport, getCategories, getReport, updateReport, uploadReportPhoto } from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'
import { REPORT_PHOTO_MAX_BYTES, validateImageFile, validateReportInput } from '../../schemas/report'
import { FiArrowLeft, FiCamera, FiCheck, FiX } from 'react-icons/fi'

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
}

export function ReportFormPage({ profile, reportId, onNavigate }: ReportFormPageProps) {
  const editing = Boolean(reportId)
  const [form, setForm] = useState<ReportInput>(emptyForm)
  const [categories, setCategories] = useState<Category[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(editing)
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
      const payload: ReportInput = { ...form, room: form.room || '', photo_url: photoUrl }
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

  if (loading) {
    return (
      <div className="rounded-2xl border border-white/10 bg-[#072445]/45 p-12 text-center text-xs text-[#8cb6dc] backdrop-blur-md">
        Memuat data formulir...
      </div>
    )
  }

  const inputClass =
    'h-11 w-full rounded-xl border border-white/15 bg-[#031528]/80 px-3.5 text-xs text-white placeholder:text-[#8cb6dc]/50 backdrop-blur-md transition-all focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 hover:border-white/25'

  const selectClass =
    'h-11 w-full rounded-xl border border-white/15 bg-[#031528] px-3.5 text-xs text-white backdrop-blur-md transition-all focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 hover:border-white/25 cursor-pointer [&_option]:bg-[#031528] [&_option]:text-white'

  return (
    <div className="space-y-6 max-w-3xl">
      <button
        type="button"
        onClick={() => onNavigate(reportId ? `/mahasiswa/laporan/${reportId}` : '/mahasiswa/laporan')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8cb6dc] hover:text-white transition-colors cursor-pointer"
      >
        <FiArrowLeft className="size-3.5" />
        <span>Kembali ke Laporan</span>
      </button>

      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-[#60b6ff]/30 bg-[#60b6ff]/10 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#8fc3ee]">
          <span className="size-1.5 rounded-full bg-[#60b6ff] shadow-[0_0_8px_#60b6ff]" />
          <span>Formulir Aduan</span>
        </div>
        <h1 className="mt-2 font-['Poppins','Montserrat','Outfit',sans-serif] text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
          {editing ? 'Ubah Informasi Laporan' : 'Laporkan Kerusakan Fasilitas'}
        </h1>
        <p className="mt-1 text-xs sm:text-sm text-[#8cb6dc]">
          Tuliskan deskripsi lengkap serta lokasi detail agar tim teknisi dan sarana prasarana dapat menangani dengan cepat.
        </p>
      </div>

      {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}

      <form
        className="space-y-5 rounded-3xl border border-white/10 bg-[#072445]/45 p-6 sm:p-8 backdrop-blur-xl shadow-xl shadow-black/20"
        onSubmit={(event) => void submit(event)}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#cce5fb] sm:col-span-2">
            <span>
              Judul Laporan <span className="text-rose-400">*</span>
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

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#cce5fb] sm:col-span-2">
            <span>
              Kategori Kerusakan <span className="text-rose-400">*</span>
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

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#cce5fb] sm:col-span-2">
            <span>
              Deskripsi Masalah <span className="text-rose-400">*</span>
            </span>
            <textarea
              required
              minLength={10}
              rows={4}
              value={form.description}
              onChange={(event) => setField('description', event.target.value)}
              placeholder="Jelaskan secara rinci kronologi masalah, tingkat keparahan, serta dampaknya pada kegiatan perkuliahan..."
              className="w-full rounded-xl border border-white/15 bg-[#031528]/80 p-3.5 text-xs text-white placeholder:text-[#8cb6dc]/50 backdrop-blur-md transition-all focus:border-[#60b6ff] focus:outline-none focus:ring-2 focus:ring-[#60b6ff]/30 hover:border-white/25 resize-vertical"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#cce5fb]">
            <span>
              Fakultas <span className="text-rose-400">*</span>
            </span>
            <input
              required
              value={form.faculty}
              onChange={(event) => setField('faculty', event.target.value)}
              placeholder="Contoh: Fakultas Ilmu Komputer"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#cce5fb]">
            <span>
              Nama Gedung <span className="text-rose-400">*</span>
            </span>
            <input
              required
              value={form.building}
              onChange={(event) => setField('building', event.target.value)}
              placeholder="Contoh: Gedung Pengajaran Lt. 2"
              className={inputClass}
            />
          </label>

          <label className="flex flex-col gap-1.5 text-xs font-semibold text-[#cce5fb] sm:col-span-2">
            <div className="flex items-center justify-between">
              <span>Ruang / Detail Lokasi</span>
              <span className="text-[10px] text-[#8cb6dc]/70">Opsional</span>
            </div>
            <input
              value={form.room ?? ''}
              onChange={(event) => setField('room', event.target.value)}
              placeholder="Contoh: Lab Komputer Jaringan Ruang 2.4"
              className={inputClass}
            />
          </label>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#cce5fb]">
              <span className="flex items-center gap-1.5">
                <FiCamera className="size-3.5 text-[#60b6ff]" />
                <span>Foto Bukti Kerusakan</span>
              </span>
              <span className="text-[10px] text-[#8cb6dc]/70">Opsional · Maks. 5 MB</span>
            </div>

            <div className="rounded-2xl border border-dashed border-white/20 bg-[#031528]/50 p-4 transition-all hover:border-[#60b6ff]/50">
              <input
                type="file"
                accept="image/*"
                onChange={(event) => setFile(event.target.files?.[0] ?? null)}
                className="w-full text-xs text-[#8cb6dc] file:mr-3 file:rounded-xl file:border-0 file:bg-white/10 file:px-4 file:py-2 file:text-xs file:font-semibold file:text-[#cce5fb] file:cursor-pointer hover:file:bg-white/20"
              />

              {form.photo_url && !file && (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    className="size-16 rounded-xl object-cover border border-white/20"
                    src={form.photo_url}
                    alt="Foto saat ini"
                  />
                  <span className="text-xs text-[#8cb6dc]">Foto bukti yang tersimpan saat ini</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 border-t border-white/10 pt-5">
          <button
            type="button"
            onClick={() => onNavigate(reportId ? `/mahasiswa/laporan/${reportId}` : '/mahasiswa/laporan')}
            className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-[#cce5fb] backdrop-blur transition hover:bg-white/15 hover:text-white cursor-pointer"
          >
            <FiX className="size-3.5" />
            <span>Batalkan</span>
          </button>

          <button
            type="submit"
            disabled={busy}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#60b6ff] via-[#48a6ff] to-[#2b8ced] px-5 py-2.5 text-xs sm:text-sm font-bold text-[#021427] shadow-[0_4px_20px_rgba(58,147,232,0.4)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(58,147,232,0.6)] hover:brightness-105 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <FiCheck className="size-4 stroke-[2.5]" />
            <span>{busy ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Kirim Laporan'}</span>
          </button>
        </div>
      </form>
    </div>
  )
}
export default ReportFormPage
