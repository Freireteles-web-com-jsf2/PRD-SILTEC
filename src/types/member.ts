export type GenderType = 'male' | 'female' | 'other' | 'prefer_not_to_say';
export type MaritalStatusType = 'single' | 'married' | 'divorced' | 'widowed' | 'separated';

export type FamilyRelationshipType =
  | 'husband' | 'wife' | 'son' | 'daughter'
  | 'father' | 'mother' | 'brother' | 'sister'
  | 'grandfather' | 'grandmother' | 'grandson' | 'granddaughter'
  | 'uncle' | 'aunt' | 'nephew' | 'niece'
  | 'cousin' | 'father_in_law' | 'mother_in_law'
  | 'brother_in_law' | 'sister_in_law' | 'son_in_law' | 'daughter_in_law'
  | 'stepfather' | 'stepmother' | 'stepson' | 'stepdaughter'
  | 'other';

export type TimelineEventType = 'role_change' | 'department_change' | 'status_change' | 'observation';

export type MemberRoleType = 'member' | 'leader' | 'treasurer' | 'admin' | 'super_admin';

export type AttendanceStatusType = 'present' | 'absent' | 'justified';

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
  member_attendances?: MemberAttendance[];
  departments?: Department;
}

export interface FamilyGroup {
  id: string;
  church_id?: string;
  name: string;
  leader_id: string | null;
  description: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  created_by: string | null;
  updated_by: string | null;
}

export interface MemberTimeline {
  id: string;
  church_id?: string;
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
  id?: string;
  church_id?: string;
  family_group_id?: string;
  member_id?: string;
  relationship: FamilyRelationshipType;
  is_primary_contact: boolean;
  notes: string | null;
  family_groups: FamilyGroupSummary | null;
}

export interface MemberRole {
  id: string;
  church_id?: string;
  member_id?: string;
  role: MemberRoleType;
  department_id: string | null;
  is_active: boolean;
  start_date: string;
  end_date: string | null;
  granted_by: string | null;
  granted_at: string | null;
  revoked_at: string | null;
  revocation_reason: string | null;
}

export interface MemberAttendance {
  id: string;
  church_id?: string;
  member_id: string;
  event_id: string | null;
  status: AttendanceStatusType;
  check_in_time: string | null;
  check_out_time: string | null;
  notes: string | null;
  justification: string | null;
  recorded_by: string | null;
  created_at: string;
}

export interface Department {
  id: string;
  church_id?: string;
  name: string;
  description: string | null;
  leader_id: string | null;
  status: boolean;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

export interface ChurchEvent {
  id: string;
  church_id?: string;
  title: string;
  description: string | null;
  event_type: string;
  start_date: string;
  end_date: string | null;
  location: string | null;
  status: string;
}
