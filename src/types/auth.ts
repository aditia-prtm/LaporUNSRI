export type UserRole = 'mahasiswa' | 'petugas' | 'admin'

export type UserProfile = {
  full_name: string
  role: UserRole
}

export type AuthPageKind = 'user' | 'officer'
