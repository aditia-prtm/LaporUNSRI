export type ReportStatus = 'belum_diproses' | 'diproses' | 'menunggu_konfirmasi' | 'selesai'

export type Category = { id: string; name: string }

export type Report = {
  id: string
  user_id: string
  category_id: string | null
  assigned_officer_id: string | null
  title: string
  description: string
  faculty: string
  building: string
  room: string | null
  photo_url: string | null
  latitude?: number | null
  longitude?: number | null
  status: ReportStatus
  confirmation_requested_at?: string | null
  completed_at?: string | null
  created_at: string
  updated_at: string
  categories?: { name: string } | null
  profiles?: { full_name: string } | null
  vote_count: number
  voted_by_me: boolean
}

export type ReportInput = {
  title: string
  description: string
  category_id: string
  faculty: string
  building: string
  room?: string
  photo_url?: string | null
  latitude?: number | null
  longitude?: number | null
}

export type ReportComment = {
  id: string
  report_id: string
  user_id: string
  message: string
  photo_url: string | null
  created_at: string
  profiles?: { full_name: string } | null
}
