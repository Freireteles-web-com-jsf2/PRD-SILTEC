export type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type MaritalStatusType = 'single' | 'married' | 'divorced' | 'widowed' | 'separated';

export interface Member {
  id: string;
  church_id?: string;
  name: string;
  birth_date: string | null;
  gender: GenderType | null;
  marital_status: MaritalStatusType | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  address_city: string | null;
  address_state: string | null;
  baptism_date: string | null;
  conversion_date: string | null;
  department_id: string | null;
  status: boolean;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
  member_roles?: MemberRole[];
  member_timeline?: MemberTimeline[];
  family_members?: FamilyMember[];
}

export interface FamilyGroup {
  id: string;
  church_id: string;
  name: string;
  leader_id: string | null;
  created_at: string;
  updated_at: string;
}

export type TimelineEventType = 'role_change' | 'department_change' | 'status_change' | 'observation';

export interface MemberTimeline {
  id: string;
  church_id: string;
  member_id: string;
  event_type: TimelineEventType;
  old_value: string | null;
  new_value: string | null;
  description: string | null;
  effective_date: string | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface FamilyGroupSummary {
  id: string;
  name: string;
}

export interface FamilyMember {
  relationship: string;
  is_primary_contact: boolean;
  family_groups: FamilyGroupSummary | null;
}

export interface MemberRole {
  id: string;
  role: string;
  is_active: boolean;
  start_date: string;
}
