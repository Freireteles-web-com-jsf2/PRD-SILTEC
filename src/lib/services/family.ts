import { supabase } from '@/lib/supabase';
import { FamilyGroup, FamilyMember, FamilyRelationshipType } from '@/types/member';
import { handleSupabaseError } from '@/lib/errors';

export async function fetchFamilyGroups(): Promise<FamilyGroup[]> {
  const { data, error } = await supabase
    .from('family_groups')
    .select('*')
    .is('deleted_at', null)
    .order('name');

  if (error) throw handleSupabaseError(error);
  return data || [];
}

export async function createFamilyGroup(name: string): Promise<FamilyGroup> {
  const { data, error } = await supabase
    .from('family_groups')
    .insert([{ name }])
    .select()
    .single();

  if (error) throw handleSupabaseError(error);
  return data;
}

export async function linkFamilyMember(params: {
  family_group_id: string;
  member_id: string;
  relationship: FamilyRelationshipType;
  is_primary_contact?: boolean;
}): Promise<FamilyMember> {
  const { data, error } = await supabase
    .from('family_members')
    .insert([{
      family_group_id: params.family_group_id,
      member_id: params.member_id,
      relationship: params.relationship,
      is_primary_contact: params.is_primary_contact ?? false,
    }])
    .select()
    .single();

  if (error) throw handleSupabaseError(error);
  return data;
}

export async function updateFamilyMemberLink(
  id: string,
  data: Partial<{ family_group_id: string; relationship: FamilyRelationshipType; is_primary_contact: boolean }>
): Promise<void> {
  const { error } = await supabase
    .from('family_members')
    .update(data)
    .eq('id', id);

  if (error) throw handleSupabaseError(error);
}

export async function getFamilyMemberByMemberId(memberId: string): Promise<FamilyMember | null> {
  const { data, error } = await supabase
    .from('family_members')
    .select('*')
    .eq('member_id', memberId)
    .maybeSingle();

  if (error) throw handleSupabaseError(error);
  return data;
}
