-- RLS Policies for family_groups
CREATE POLICY family_groups_select ON family_groups
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY family_groups_insert ON family_groups
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY family_groups_update ON family_groups
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY family_groups_delete ON family_groups
  FOR DELETE USING (church_id = get_current_church_id());

-- RLS Policies for family_members
CREATE POLICY family_members_select ON family_members
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY family_members_insert ON family_members
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY family_members_update ON family_members
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY family_members_delete ON family_members
  FOR DELETE USING (church_id = get_current_church_id());

-- RLS Policies for member_timeline
CREATE POLICY member_timeline_select ON member_timeline
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY member_timeline_insert ON member_timeline
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_timeline_update ON member_timeline
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_timeline_delete ON member_timeline
  FOR DELETE USING (church_id = get_current_church_id());

-- RLS Policies for member_roles
CREATE POLICY member_roles_select ON member_roles
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY member_roles_insert ON member_roles
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_roles_update ON member_roles
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_roles_delete ON member_roles
  FOR DELETE USING (church_id = get_current_church_id());

-- RLS Policies for member_attendances
CREATE POLICY member_attendances_select ON member_attendances
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY member_attendances_insert ON member_attendances
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_attendances_update ON member_attendances
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY member_attendances_delete ON member_attendances
  FOR DELETE USING (church_id = get_current_church_id());

-- RLS Policies for events
CREATE POLICY events_select ON events
  FOR SELECT USING (church_id = get_current_church_id());

CREATE POLICY events_insert ON events
  FOR INSERT WITH CHECK (church_id = get_current_church_id());

CREATE POLICY events_update ON events
  FOR UPDATE USING (church_id = get_current_church_id()) WITH CHECK (church_id = get_current_church_id());

CREATE POLICY events_delete ON events
  FOR DELETE USING (church_id = get_current_church_id());

-- Grant permissions for all related tables
GRANT SELECT, INSERT, UPDATE, DELETE ON family_groups TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON family_members TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON member_timeline TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON member_roles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON member_attendances TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON events TO authenticated;