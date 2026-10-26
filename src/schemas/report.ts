import type { ReportInput } from '../types/report'

export const REPORT_PHOTO_MAX_BYTES = 5 * 1024 * 1024
export const FOLLOW_UP_PHOTO_MAX_BYTES = 8 * 1024 * 1024

export function validateReportInput(input: ReportInput): string | null {
  if (!input.title.trim()) return 'Judul laporan wajib diisi.'
  if (input.title.trim().length > 120) return 'Judul laporan maksimal 120 karakter.'
  if (!input.category_id) return 'Pilih kategori laporan.'
  if (input.description.trim().length < 10) return 'Deskripsi laporan minimal 10 karakter.'
  if (!input.faculty.trim()) return 'Fakultas wajib diisi.'
  if (!input.building.trim()) return 'Gedung wajib diisi.'
  return null
}

export function validateImageFile(file: File, maxBytes: number): string | null {
  if (!file.type.startsWith('image/')) return 'File bukti harus berupa gambar.'
  if (file.size > maxBytes) return `Ukuran foto maksimal ${Math.floor(maxBytes / 1024 / 1024)} MB.`
  return null
}
