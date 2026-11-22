import { z } from 'zod'

// Validasi domain email: harus memiliki @ dan domain dengan TLD minimal 2 karakter (misal .com, .ac.id, .id, .edu)
const emailDomainRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

export const emailSchema = z
  .string()
  .trim()
  .min(1, 'Email wajib diisi.')
  .email('Format email tidak valid.')
  .refine(
    (val) => emailDomainRegex.test(val),
    'Domain email tidak valid (contoh: student@unsri.ac.id atau nama@gmail.com).'
  )

export const passwordSchema = z
  .string()
  .min(1, 'Password wajib diisi.')
  .min(6, 'Password minimal harus 6 karakter.')

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
})

export type LoginFormData = z.infer<typeof loginSchema>

export const registerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, 'Nama lengkap wajib diisi.')
    .min(3, 'Nama lengkap minimal 3 karakter.'),
  email: emailSchema,
  password: passwordSchema,
  nimNip: z.string().optional().default(''),
})

export type RegisterFormData = z.infer<typeof registerSchema>

export type AuthFormData = {
  email: string
  password: string
  fullName?: string
  nimNip?: string
}
