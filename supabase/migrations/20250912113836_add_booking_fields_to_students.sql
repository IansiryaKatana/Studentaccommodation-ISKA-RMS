-- Add booking fields to students table
-- Migration: Add check_in_date, duration_name, duration_type fields

-- Add check_in_date column
ALTER TABLE students ADD COLUMN IF NOT EXISTS check_in_date DATE;

-- Add duration_name column
ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_name TEXT;

-- Add duration_type column
ALTER TABLE students ADD COLUMN IF NOT EXISTS duration_type TEXT;

-- Add comments for documentation
COMMENT ON COLUMN students.check_in_date IS 'Student check-in date from duration selection';
COMMENT ON COLUMN students.duration_name IS 'Duration name (e.g., "45 weeks", "51 weeks")';
COMMENT ON COLUMN students.duration_type IS 'Duration type (e.g., "student")';

-- Verify the changes
SELECT 'Booking fields added to students table successfully!' as status;
