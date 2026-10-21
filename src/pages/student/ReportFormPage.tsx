import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { UserProfile } from '../../types/auth'
import type { Category, ReportInput } from '../../types/report'
import { createReport, getCategories, getReport, updateReport, uploadReportPhoto } from '../../services/reportService'
import { FeedbackMessage } from '../../components/common/FeedbackMessage'

type ReportFormPageProps = {
  profile: UserProfile
  reportId?: string
  onNavigate: (path: string) => void
}

const emptyForm: ReportInput = {
  title: '', description: '', category_id: '', faculty: '', building: '', room: '', photo_url: null,
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
    return () => { active = false }
  }, [editing, reportId, profile.id])

  const setField = (field: keyof ReportInput, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')
    if (file && !file.type.startsWith('image/')) {
      setError('File bukti harus berupa gambar.')
      return
    }
    if (file && file.size > 5 * 1024 * 1024) {
      setError('Ukuran foto maksimal 5 MB.')
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

  if (loading) return <div className="student-empty">Memuat formulir...</div>

  return (
    <section className="student-page form-page">
      <button className="text-link form-back" onClick={() => onNavigate(reportId ? `/mahasiswa/laporan/${reportId}` : '/mahasiswa/laporan')}><span aria-hidden="true">&#8592;</span> Kembali</button>
      <div className="page-title-row"><div><span className="eyebrow">LAPORAN FASILITAS</span><h1>{editing ? 'Ubah laporan' : 'Buat laporan'}</h1><p>Jelaskan masalah dan lokasi agar petugas dapat menindaklanjutinya.</p></div></div>
      {error && <FeedbackMessage tone="error">{error}</FeedbackMessage>}
      <form className="report-form" onSubmit={(event) => void submit(event)}>
        <label>Judul laporan<input required maxLength={120} value={form.title} onChange={(event) => setField('title', event.target.value)} placeholder="Contoh: AC ruang kelas tidak dingin" /></label>
        <label>Kategori<select required value={form.category_id} onChange={(event) => setField('category_id', event.target.value)}><option value="">Pilih kategori</option>{categories.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</select></label>
        <label className="field-span">Deskripsi<textarea required minLength={10} rows={5} value={form.description} onChange={(event) => setField('description', event.target.value)} placeholder="Ceritakan kondisi dan dampak masalah yang ditemukan..." /></label>
        <label>Fakultas<input required value={form.faculty} onChange={(event) => setField('faculty', event.target.value)} placeholder="Nama fakultas" /></label>
        <label>Gedung<input required value={form.building} onChange={(event) => setField('building', event.target.value)} placeholder="Nama atau nomor gedung" /></label>
        <label>Ruang / lokasi detail <span className="optional-label">Opsional</span><input value={form.room ?? ''} onChange={(event) => setField('room', event.target.value)} placeholder="Contoh: Ruang 204" /></label>
        <label className="field-span">Foto bukti <span className="optional-label">Opsional · Maks. 5 MB</span><input type="file" accept="image/*" onChange={(event) => setFile(event.target.files?.[0] ?? null)} />{form.photo_url && !file && <img className="form-current-photo" src={form.photo_url} alt="Foto laporan saat ini" />}</label>
        <div className="form-actions field-span"><button type="button" className="button button-outline" onClick={() => onNavigate(reportId ? `/mahasiswa/laporan/${reportId}` : '/mahasiswa/laporan')}>Batal</button><button className="button button-primary" disabled={busy}>{busy ? 'Menyimpan...' : editing ? 'Simpan perubahan' : 'Kirim laporan'}</button></div>
      </form>
    </section>
  )
}
