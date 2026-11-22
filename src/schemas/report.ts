import { z } from 'zod'
import type { ReportInput } from '../types/report'

export const REPORT_PHOTO_MAX_BYTES = 5 * 1024 * 1024
export const FOLLOW_UP_PHOTO_MAX_BYTES = 8 * 1024 * 1024

export const reportInputSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Judul laporan wajib diisi.')
    .max(120, 'Judul laporan maksimal 120 karakter.'),
  category_id: z
    .string()
    .min(1, 'Pilih kategori fasilitas.'),
  description: z
    .string()
    .trim()
    .min(10, 'Deskripsi laporan minimal 10 karakter.'),
  faculty: z
    .string()
    .trim()
    .min(1, 'Fakultas wajib diisi.'),
  building: z
    .string()
    .trim()
    .min(1, 'Gedung wajib diisi.'),
  room: z.string().optional(),
  photo_url: z.string().nullable().optional(),
  latitude: z
    .number()
    .min(-90, 'Latitude tidak valid (-90 s/d 90).')
    .max(90, 'Latitude tidak valid (-90 s/d 90).')
    .nullable()
    .optional(),
  longitude: z
    .number()
    .min(-180, 'Longitude tidak valid (-180 s/d 180).')
    .max(180, 'Longitude tidak valid (-180 s/d 180).')
    .nullable()
    .optional(),
})

export type ReportInputFormData = z.infer<typeof reportInputSchema>

export function validateReportInput(input: ReportInput): string | null {
  const result = reportInputSchema.safeParse(input)
  if (!result.success) {
    return result.error.issues[0]?.message ?? 'Validasi laporan gagal.'
  }
  return null
}

export function validateImageFile(file: File, maxBytes: number): string | null {
  if (!file.type.startsWith('image/')) return 'File bukti harus berupa gambar.'
  if (file.size > maxBytes) return `Ukuran foto maksimal ${Math.floor(maxBytes / 1024 / 1024)} MB.`
  return null
}
