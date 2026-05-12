import { supabase } from '@/lib/supabase';
import { Department } from '@/types/member';
import { handleSupabaseError } from '@/lib/errors';

export async function fetchDepartments(): Promise<Department[]> {
  const { data, error } = await supabase
    .from('departments')
    .select('*')
    .is('deleted_at', null)
    .order('name');

  if (error) throw handleSupabaseError(error);
  return data || [];
}
