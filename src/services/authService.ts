import { supabase } from '../lib/supabaseClient';
import { isSupabaseConfigured } from '../lib/supabaseClient';

export type UserRole = 'mahasiswa' | 'petugas' | 'admin'
export type UserProfile = { full_name: string; role: UserRole }

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase belum dikonfigurasi. Periksa URL dan publishable key di file .env.')
  }
}

export async function registerUser(
  email: string,
  password: string,
  fullName: string,
  role: 'mahasiswa' | 'petugas',
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
    .select('full_name, role')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data as UserProfile
}
