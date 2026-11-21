import { supabase } from '../lib/supabaseClient'
import type { Category, Report, ReportComment, ReportInput } from '../types/report'

// reports has two foreign keys to profiles; name the reporter relation explicitly.
const REPORT_SELECT = '*, categories(name), profiles!reports_user_id_fkey(full_name)'

// In-memory cache store untuk instant page transition (SWR pattern)
type CacheEntry<T> = {
  data: T
  timestamp: number
}

const CACHE_TTL_MS = 3 * 60 * 1000 // 3 menit waktu simpan cache

let reportsCacheAll: CacheEntry<Report[]> | null = null
const reportsCacheByUser = new Map<string, CacheEntry<Report[]>>()
let categoriesCache: CacheEntry<Category[]> | null = null
const reportDetailCache = new Map<string, CacheEntry<Report>>()
const reportCommentsCache = new Map<string, CacheEntry<ReportComment[]>>()

export function getCachedReports(userId: string, mineOnly = false): Report[] | null {
  const now = Date.now()
  if (mineOnly) {
    const userEntry = reportsCacheByUser.get(userId)
    if (userEntry && now - userEntry.timestamp < CACHE_TTL_MS) {
      return userEntry.data
    }
    // Fallback otomatis memfilter dari all reports jika sudah ada di cache
    if (reportsCacheAll && now - reportsCacheAll.timestamp < CACHE_TTL_MS) {
      return reportsCacheAll.data.filter((r) => r.user_id === userId)
    }
    return null
  }

  if (reportsCacheAll && now - reportsCacheAll.timestamp < CACHE_TTL_MS) {
    return reportsCacheAll.data
  }
  return null
}

export function getCachedCategories(): Category[] | null {
  const now = Date.now()
  if (categoriesCache && now - categoriesCache.timestamp < CACHE_TTL_MS) {
    return categoriesCache.data
  }
  return null
}

export function getCachedReport(reportId: string): Report | null {
  const now = Date.now()
  const entry = reportDetailCache.get(reportId)
  if (entry && now - entry.timestamp < CACHE_TTL_MS) {
    return entry.data
  }
  if (reportsCacheAll && now - reportsCacheAll.timestamp < CACHE_TTL_MS) {
    const found = reportsCacheAll.data.find((r) => r.id === reportId)
    if (found) return found
  }
  return null
}

export function getCachedReportComments(reportId: string): ReportComment[] | null {
  const now = Date.now()
  const entry = reportCommentsCache.get(reportId)
  if (entry && now - entry.timestamp < CACHE_TTL_MS) {
    return entry.data
  }
  return null
}

export function invalidateReportsCache(): void {
  reportsCacheAll = null
  reportsCacheByUser.clear()
  reportDetailCache.clear()
}

export function invalidateCategoriesCache(): void {
  categoriesCache = null
}

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
  const reports = await addVoteSummary((data ?? []) as unknown as Record<string, unknown>[], userId)

  const now = Date.now()
  if (mineOnly) {
    reportsCacheByUser.set(userId, { data: reports, timestamp: now })
  } else {
    reportsCacheAll = { data: reports, timestamp: now }
  }
  for (const r of reports) {
    reportDetailCache.set(r.id, { data: r, timestamp: now })
  }

  return reports
}

export async function getReport(reportId: string, userId: string): Promise<Report> {
  const { data, error } = await supabase.from('reports').select(REPORT_SELECT).eq('id', reportId).single()
  throwIfError(error)
  if (!data) throw new Error('Laporan tidak ditemukan.')
  const [report] = await addVoteSummary([data as unknown as Record<string, unknown>], userId)
  reportDetailCache.set(reportId, { data: report, timestamp: Date.now() })
  return report
}

export async function getCategories(): Promise<Category[]> {
  const { data, error } = await supabase.from('categories').select('id, name').order('name')
  throwIfError(error)
  const categories = (data ?? []) as Category[]
  categoriesCache = { data: categories, timestamp: Date.now() }
  return categories
}

export async function createCategory(name: string): Promise<void> {
  const { error } = await supabase.from('categories').insert({ name })
  throwIfError(error)
  invalidateCategoriesCache()
}

export async function renameCategory(categoryId: string, name: string): Promise<void> {
  const { error } = await supabase.from('categories').update({ name }).eq('id', categoryId)
  throwIfError(error)
  invalidateCategoriesCache()
}

export async function deleteCategory(categoryId: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', categoryId)
  throwIfError(error)
  invalidateCategoriesCache()
}

export async function createReport(input: ReportInput, userId: string): Promise<string> {
  const { data, error } = await supabase.from('reports').insert({ ...input, user_id: userId }).select('id').single()
  throwIfError(error)
  if (!data) throw new Error('Laporan gagal dibuat.')
  invalidateReportsCache()
  return data.id as string
}

export async function updateReport(reportId: string, input: ReportInput): Promise<void> {
  const { error } = await supabase.from('reports').update(input).eq('id', reportId)
  throwIfError(error)
  invalidateReportsCache()
}

export async function deleteReport(reportId: string): Promise<void> {
  const { error } = await supabase.from('reports').delete().eq('id', reportId)
  throwIfError(error)
  invalidateReportsCache()
}

export async function toggleReportVote(reportId: string, userId: string, votedByMe: boolean): Promise<void> {
  if (votedByMe) {
    const { error } = await supabase.from('report_votes').delete().eq('report_id', reportId).eq('user_id', userId)
    throwIfError(error)
  } else {
    const { error } = await supabase.from('report_votes').insert({ report_id: reportId, user_id: userId })
    throwIfError(error)
  }

  // Update in-memory cache directly untuk respon instan tanpa flicker
  if (reportsCacheAll) {
    reportsCacheAll.data = reportsCacheAll.data.map((r) => {
      if (r.id === reportId) {
        return {
          ...r,
          voted_by_me: !votedByMe,
          vote_count: Math.max(0, r.vote_count + (votedByMe ? -1 : 1)),
        }
      }
      return r
    })
  }
  const detail = reportDetailCache.get(reportId)
  if (detail) {
    detail.data = {
      ...detail.data,
      voted_by_me: !votedByMe,
      vote_count: Math.max(0, detail.data.vote_count + (votedByMe ? -1 : 1)),
    }
  }
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
  const comments = (data ?? []).map((comment) => ({
    ...comment,
    profiles: Array.isArray(comment.profiles) ? comment.profiles[0] ?? null : comment.profiles,
  })) as unknown as ReportComment[]
  reportCommentsCache.set(reportId, { data: comments, timestamp: Date.now() })
  return comments
}

export async function addReportComment(reportId: string, userId: string, message: string, photoUrl: string | null = null): Promise<void> {
  const { error } = await supabase.from('report_comments').insert({ report_id: reportId, user_id: userId, message, photo_url: photoUrl })
  throwIfError(error)
  reportCommentsCache.delete(reportId)
}

export async function updateReportStatusWithEvidence(
  reportId: string,
  status: Report['status'],
  message: string,
  photoUrl: string | null,
): Promise<void> {
  const { error } = await supabase.rpc('petugas_update_report_status', {
    p_report_id: reportId,
    p_status: status,
    p_message: message,
    p_photo_url: photoUrl,
  })
  throwIfError(error)
  invalidateReportsCache()
}

export async function confirmReportCompletion(
  reportId: string,
  feedback?: string,
): Promise<void> {
  const { error } = await supabase.rpc('user_confirm_report_completion', {
    p_report_id: reportId,
    p_feedback: feedback?.trim() || null,
  })
  throwIfError(error)
  invalidateReportsCache()
}
