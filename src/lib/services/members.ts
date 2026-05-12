import { supabase } from '@/lib/supabase';
import { Member } from '@/types/member';
import { handleSupabaseError } from '@/lib/errors';

export interface FetchMembersParams {
  search?: string;
  status?: boolean | 'all';
  departmentId?: string;
  page?: number;
  pageSize?: number;
}

export interface FetchMembersResponse {
  members: Member[];
  total: number;
}

export async function fetchMembers(params: FetchMembersParams = {}): Promise<FetchMembersResponse> {
  const { search, status, departmentId, page = 1, pageSize = 50 } = params;

  let query = supabase
    .from('members')
    .select(`
      *,
      member_roles(role, is_active),
      departments(name)
    `, { count: 'exact' })
    .is('deleted_at', null);

  if (search?.trim()) {
    query = query.ilike('name', `%${search.trim()}%`);
  }

  if (status !== 'all' && status !== undefined) {
    query = query.eq('status', status);
  }

  if (departmentId) {
    query = query.eq('department_id', departmentId);
  }

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const { data, error, count } = await query
    .order('name')
    .range(from, to);

  if (error) throw handleSupabaseError(error);

  return {
    members: data || [],
    total: count ?? 0,
  };
}

export async function fetchMember(id: string): Promise<Member> {
  const { data, error } = await supabase
    .from('members')
    .select(`
      *,
      member_roles(id, role, is_active, start_date, end_date, department_id, granted_by),
      member_timeline(*),
      family_members(
        id, relationship, is_primary_contact, notes,
        family_groups(id, name)
      ),
      member_attendances(
        id, event_id, status, check_in_time, check_out_time, created_at,
        events(title, start_date, event_type)
      ),
      departments(name)
    `)
    .eq('id', id)
    .is('deleted_at', null)
    .single();

  if (error) throw handleSupabaseError(error);
  return data;
}

export async function createMember(data: Partial<Member>): Promise<Member> {
  const { data: member, error } = await supabase
    .from('members')
    .insert([data])
    .select()
    .single();

  if (error) throw handleSupabaseError(error);
  return member;
}

export async function updateMember(id: string, data: Partial<Member>): Promise<Member> {
  const { data: member, error } = await supabase
    .from('members')
    .update(data)
    .eq('id', id)
    .select()
    .single();

  if (error) throw handleSupabaseError(error);
  return member;
}

export async function softDeleteMember(id: string): Promise<void> {
  const { error } = await supabase
    .from('members')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id);

  if (error) throw handleSupabaseError(error);
}
