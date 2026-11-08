import { isSupabaseConfigured, supabase } from '../lib/supabaseClient'
import type { UserProfile, UserRole } from '../types/auth'

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum dikonfigurasi. Periksa URL dan publishable key di file .env.')
  }
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  role: Exclude<UserRole, 'admin'>,
  nimNip = '',
) {
  ensureConfigured()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, nim_nip: nimNip || null, role },
      emailRedirectTo: `${window.location.origin}${role === 'petugas' ? '/petugas' : '/auth'}`,
    },
  });
 
  if (error) throw error;
  return data;
}
 
export async function loginUser(email: string, password: string) {
  ensureConfigured()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
 
  if (error) throw error;
  return data;
}
 
export async function logoutUser() {
  ensureConfigured()
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getProfile(userId: string): Promise<UserProfile> {
  ensureConfigured()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, full_name, nim_nip, role, created_at')
    .eq('id', userId)
    .single()
  if (error) throw error

  // Dapatkan email dari sesi login Supabase Auth saat ini
  const { data: sessionData } = await supabase.auth.getSession()
  const email = sessionData.session?.user?.email ?? null

  return {
    ...data,
    email,
  } as UserProfile
}

export async function updateProfile(
  userId: string,
  input: { full_name: string; nim_nip?: string | null }
): Promise<void> {
  ensureConfigured()
  const fullName = input.full_name.trim()
  const nimNip = input.nim_nip?.trim() || null

  const { error } = await supabase
    .from('profiles')
    .update({
      full_name: fullName,
      nim_nip: nimNip,
    })
    .eq('id', userId)
  if (error) throw error

  // Sinkronkan metadata sesi Supabase Auth agar nama terbaru tetap konsisten
  await supabase.auth.updateUser({
    data: {
      full_name: fullName,
      nim_nip: nimNip,
    },
  })
}

export async function updatePassword(newPassword: string): Promise<void> {
  ensureConfigured()
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw error
}
