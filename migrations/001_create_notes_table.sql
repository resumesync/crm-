-- ================================================
-- NOTES FEATURE DATABASE MIGRATION
-- ================================================
-- Run this script in your Supabase SQL Editor
-- This will create the notes table and all necessary
-- policies, indexes, and triggers
-- ================================================

-- Step 1: Create notes table
-- ================================================
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_by UUID REFERENCES auth.users(id) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Step 2: Enable Row Level Security
-- ================================================
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;

-- Step 3: Create RLS Policies
-- ================================================

-- Policy: Users can view notes for leads in their organizations
CREATE POLICY "Users can view notes for leads in their organizations"
  ON notes FOR SELECT
  USING (
    lead_id IN (
      SELECT id FROM leads
      WHERE organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Policy: Users can create notes for leads in their organizations
CREATE POLICY "Users can create notes for leads in their organizations"
  ON notes FOR INSERT
  WITH CHECK (
    lead_id IN (
      SELECT id FROM leads
      WHERE organization_id IN (
        SELECT organization_id FROM organization_members
        WHERE user_id = auth.uid()
      )
    )
  );

-- Policy: Users can update their own notes
CREATE POLICY "Users can update their own notes"
  ON notes FOR UPDATE
  USING (created_by = auth.uid());

-- Policy: Users can delete their own notes
CREATE POLICY "Users can delete their own notes"
  ON notes FOR DELETE
  USING (created_by = auth.uid());

-- Step 4: Create Performance Indexes
-- ================================================
CREATE INDEX IF NOT EXISTS idx_notes_lead_id ON notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_notes_created_at ON notes(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notes_created_by ON notes(created_by);

-- Step 5: Create Trigger for Auto-updating updated_at
-- ================================================
-- Note: This assumes update_updated_at_column() function already exists
-- from the main schema. If not, create it first:

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_notes_updated_at
  BEFORE UPDATE ON notes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ================================================
-- VERIFICATION QUERIES
-- ================================================
-- Run these to verify the migration was successful:

-- Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'notes'
) AS notes_table_exists;

-- Check RLS is enabled
SELECT relname, relrowsecurity 
FROM pg_class 
WHERE relname = 'notes';

-- List all policies on notes table
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'notes';

-- Check indexes
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename = 'notes';

-- ================================================
-- MIGRATION COMPLETE!
-- ================================================
-- You can now use the notes feature in your CRM
-- ================================================
