-- Create studio_occupancy table for tracking studio availability per academic year
-- This table is used by the rebooking system and studio management

CREATE TABLE IF NOT EXISTS studio_occupancy (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  academic_year VARCHAR(50) NOT NULL,
  student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'reserved', 'maintenance')),
  check_in_date DATE,
  check_out_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one occupancy record per studio per academic year
  UNIQUE(studio_id, academic_year)
);

-- Disable RLS for this table (following the pattern of other data tables)
ALTER TABLE studio_occupancy DISABLE ROW LEVEL SECURITY;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_studio_occupancy_studio_id ON studio_occupancy(studio_id);
CREATE INDEX IF NOT EXISTS idx_studio_occupancy_academic_year ON studio_occupancy(academic_year);
CREATE INDEX IF NOT EXISTS idx_studio_occupancy_student_id ON studio_occupancy(student_id);
CREATE INDEX IF NOT EXISTS idx_studio_occupancy_status ON studio_occupancy(status);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_studio_occupancy_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_studio_occupancy_updated_at
  BEFORE UPDATE ON studio_occupancy
  FOR EACH ROW
  EXECUTE FUNCTION update_studio_occupancy_updated_at();
