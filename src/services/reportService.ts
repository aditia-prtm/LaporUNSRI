import { supabase } from '../lib/supabaseClient';
 
export async function getReports() {
  const { data, error } = await supabase
    .from('reports')
    .select('*, categories(name), profiles(full_name)')
    .order('created_at', { ascending: false });
 
  if (error) throw error;
  return data;
}
 
export async function createReport(payload: {
  title: string;
  description: string;
  faculty: string;
  building: string;
  room?: string;
  category_id: string;
  user_id: string;
  photo_url?: string;
}) {
  const { data, error } = await supabase
    .from('reports')
    .insert(payload)
    .select()
    .single();
 
  if (error) throw error;
  return data;
}
