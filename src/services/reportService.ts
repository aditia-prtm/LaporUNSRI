import { supabase } from '../lib/supabaseClient'
import type { Category, Report, ReportComment, ReportInput } from '../types/report'

// reports has two foreign keys to profiles; name the reporter relation explicitly.
const REPORT_SELECT = '*, categories(name), profiles!reports_user_id_fkey(full_name)'

function throwIfError(error: { message: string } | null) {
  if (error) throw new Error(error.message)
}

async function addVoteSummary(rows: Record<string, unknown>[], userId: string): Promise<Report[]> {
  if (!rows.length) return []
  const reportIds = rows.map((row) => String(row.id))
  const { data, error } = await supabase.from('report_votes').select('report_id, user_id').in('report_id', reportIds)
  throwIfError(error)

  const counts = new Map<string, number>()
  const myVotes = new Set<string>()
  for (const vote of data ?? []) {
    counts.set(vote.report_id, (counts.get(vote.report_id) ?? 0) + 1)
    if (vote.user_id === userId) myVotes.add(vote.report_id)
  }
  return rows.map((row) => ({
    ...row,
    vote_count: counts.get(String(row.id)) ?? 0,
    voted_by_me: myVotes.has(String(row.id)),
  })) as Report[]
}

export async function getReports(userId: string, mineOnly = false): Promise<Report[]> {
  let query = supabase.from('reports').select(REPORT_SELECT).order('created_at', { ascending: false })
  if (mineOnly) query = query.eq('user_id', userId)
  const { data, error } = await query
  throwIfError(error)
  return addVoteSummary((data ?? []) as unknown as Record<string, unknown>[], userId)
}

export async function getReport(reportId: string, userId: string): Promise<Report> {
  const { data, error } = await supabase.from('reports').select(REPORT_SELECT).eq('id', reportId).single()
  throwIfError(error)
  if (!data) throw new Error('Laporan tidak ditemukan.')
  const [report] = await addVoteSummary([data as unknown as Record<string, unknown>], userId)
  return report
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('id, name').order('name')
  throwIfError(error)
  return (data ?? []) as Category[]
}

export async function createReport(input: ReportInput, userId: string): Promise<string> {
  const { data, error } = await supabase.from('reports').insert({ ...input, user_id: userId }).select('id').single()
  throwIfError(error)
  if (!data) throw new Error('Laporan gagal dibuat.')
  return data.id as string
}

export async function updateReport(reportId: string, input: ReportInput): Promise<void> {
  const { error } = await supabase.from('reports').update(input).eq('id', reportId)
  throwIfError(error)
}

export async function deleteReport(reportId: string): Promise<void> {
  const { error } = await supabase.from('reports').delete().eq('id', reportId)
  throwIfError(error)
}

export async function toggleReportVote(reportId: string, userId: string, votedByMe: boolean): Promise<void> {
  if (votedByMe) {
    const { error } = await supabase.from('report_votes').delete().eq('report_id', reportId).eq('user_id', userId)
    throwIfError(error)
    return
  }
  const { error } = await supabase.from('report_votes').insert({ report_id: reportId, user_id: userId })
  throwIfError(error)
}

export async function uploadReportPhoto(file: File, userId: string): Promise<string> {
  const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
  const filePath = `${userId}/${crypto.randomUUID()}.${extension}`
  const { error } = await supabase.storage.from('report-photos').upload(filePath, file, {
    cacheControl: '3600',
    contentType: file.type,
    upsert: false,
  })
  throwIfError(error)
  return supabase.storage.from('report-photos').getPublicUrl(filePath).data.publicUrl
}

export async function getReportComments(reportId: string): Promise<ReportComment[]> {
  const { data, error } = await supabase.from('report_comments')
    .select('id, report_id, user_id, message, photo_url, created_at, profiles(full_name)')
    .eq('report_id', reportId)
    .order('created_at', { ascending: true })
  throwIfError(error)
  return (data ?? []).map((comment) => ({
    ...comment,
    profiles: Array.isArray(comment.profiles) ? comment.profiles[0] ?? null : comment.profiles,
  })) as unknown as ReportComment[]
}

export async function addReportComment(reportId: string, userId: string, message: string, photoUrl: string | null = null): Promise<void> {
  const { error } = await supabase.from('report_comments').insert({ report_id: reportId, user_id: userId, message, photo_url: photoUrl })
  throwIfError(error)
}

export async function updateReportStatusWithEvidence(
  reportId: string,
  status: Report['status'],
  message: string,
  photoUrl: string,
): Promise<void> {
  const { error } = await supabase.rpc('petugas_update_report_status', {
    p_report_id: reportId,
    p_status: status,
    p_message: message,
    p_photo_url: photoUrl,
  })
  throwIfError(error)
}
