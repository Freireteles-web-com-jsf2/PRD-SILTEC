-- RLS Policies for members table

-- Policy: Users can see only members from their church
CREATE POLICY members_select ON members
  FOR SELECT
  USING (church_id = get_current_church_id());

-- Policy: Users can insert members in their church
CREATE POLICY members_insert ON members
  FOR INSERT
  WITH CHECK (church_id = get_current_church_id());

-- Policy: Users can update only members from their church
CREATE POLICY members_update ON members
  FOR UPDATE
  USING (church_id = get_current_church_id())
  WITH CHECK (church_id = get_current_church_id());

-- Policy: Users can delete only members from their church (soft delete)
CREATE POLICY members_delete ON members
  FOR DELETE
  USING (church_id = get_current_church_id());

-- Grant permissions for members table
GRANT SELECT, INSERT, UPDATE, DELETE ON members TO authenticated;