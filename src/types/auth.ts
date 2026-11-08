export type UserRole = 'mahasiswa' | 'petugas' | 'admin'

export type UserProfile = {
  id: string
  full_name: string
  nim_nip?: string | null
  email?: string | null
  role: UserRole
  created_at?: string
}

export type AuthPageKind = 'user' | 'officer'
