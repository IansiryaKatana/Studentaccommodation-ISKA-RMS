-- Migration: Create student_bookings table and migrate data
-- This implements Option 1: Single Student Record with Academic Year Separation
-- Date: 2025-01-15
-- Purpose: Eliminate student data duplication while maintaining academic year separation

-- Step 1: Create student_bookings table
CREATE TABLE IF NOT EXISTS student_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  studio_id UUID REFERENCES studios(id),
  duration_id UUID REFERENCES durations(id),
  check_in_date DATE,
  check_out_date DATE,
  total_amount DECIMAL(10,2),
  weekly_rate DECIMAL(10,2),
  status TEXT DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  deposit_paid BOOLEAN DEFAULT false,
  wants_installments BOOLEAN DEFAULT false,
  installment_plan_id UUID REFERENCES installment_plans(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure unique student per academic year
  UNIQUE(student_id, academic_year)
);

-- Step 2: Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_student_bookings_student_id ON student_bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_student_bookings_academic_year ON student_bookings(academic_year);
CREATE INDEX IF NOT EXISTS idx_student_bookings_studio_id ON student_bookings(studio_id);
CREATE INDEX IF NOT EXISTS idx_student_bookings_status ON student_bookings(status);

-- Step 3: Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_student_bookings_updated_at 
  BEFORE UPDATE ON student_bookings 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 4: Add student_booking_id to invoices table
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS student_booking_id UUID REFERENCES student_bookings(id);
CREATE INDEX IF NOT EXISTS idx_invoices_student_booking_id ON invoices(student_booking_id);

-- Step 5: Add student_booking_id to student_installments table
ALTER TABLE student_installments ADD COLUMN IF NOT EXISTS student_booking_id UUID REFERENCES student_bookings(id);
CREATE INDEX IF NOT EXISTS idx_student_installments_student_booking_id ON student_installments(student_booking_id);

-- Step 6: Migrate existing students data to student_bookings
INSERT INTO student_bookings (
  student_id, academic_year, studio_id, duration_id,
  check_in_date, check_out_date, total_amount, weekly_rate,
  status, deposit_paid, wants_installments, installment_plan_id,
  created_at, updated_at
)
SELECT 
  id as student_id,
  COALESCE(academic_year, '2025/2026') as academic_year,
  studio_id,
  duration_id,
  check_in_date,
  check_out_date,
  total_amount,
  weekly_rate,
  COALESCE(status, 'confirmed') as status,
  COALESCE(deposit_paid, false) as deposit_paid,
  COALESCE(wants_installments, false) as wants_installments,
  installment_plan_id,
  created_at,
  updated_at
FROM students
WHERE academic_year IS NOT NULL
ON CONFLICT (student_id, academic_year) DO NOTHING;

-- Step 7: Update invoices to link to student_bookings
UPDATE invoices 
SET student_booking_id = sb.id
FROM student_bookings sb
WHERE invoices.student_id = sb.student_id 
  AND invoices.academic_year = sb.academic_year
  AND invoices.student_booking_id IS NULL;

-- Step 8: Update student_installments to link to student_bookings
UPDATE student_installments 
SET student_booking_id = sb.id
FROM student_bookings sb
WHERE student_installments.student_id = sb.student_id 
  AND student_installments.student_booking_id IS NULL;

-- Step 9: Create view for easy querying of current student bookings
CREATE OR REPLACE VIEW current_student_bookings AS
SELECT 
  sb.*,
  s.first_name,
  s.last_name,
  s.email,
  s.phone,
  s.user_id,
  st.studio_number,
  st.room_grade_id,
  rg.name as room_grade_name,
  d.name as duration_name,
  d.weeks as duration_weeks
FROM student_bookings sb
JOIN students s ON sb.student_id = s.id
LEFT JOIN studios st ON sb.studio_id = st.id
LEFT JOIN room_grades rg ON st.room_grade_id = rg.id
LEFT JOIN durations d ON sb.duration_id = d.id
ORDER BY sb.academic_year DESC, s.last_name, s.first_name;

-- Step 10: Create view for student booking history
CREATE OR REPLACE VIEW student_booking_history AS
SELECT 
  s.id as student_id,
  s.user_id,
  s.first_name,
  s.last_name,
  s.email,
  COUNT(sb.id) as total_bookings,
  ARRAY_AGG(sb.academic_year ORDER BY sb.academic_year DESC) as academic_years,
  MAX(sb.created_at) as last_booking_date
FROM students s
LEFT JOIN student_bookings sb ON s.id = sb.student_id
GROUP BY s.id, s.user_id, s.first_name, s.last_name, s.email
ORDER BY s.last_name, s.first_name;

-- Step 11: Add comments for documentation
COMMENT ON TABLE student_bookings IS 'Academic year bookings for students - separates booking data from personal data';
COMMENT ON COLUMN student_bookings.student_id IS 'References students.id - personal data stored once';
COMMENT ON COLUMN student_bookings.academic_year IS 'Academic year for this booking (e.g., 2025/2026)';
COMMENT ON COLUMN student_bookings.studio_id IS 'Studio assigned for this academic year';
COMMENT ON COLUMN student_bookings.duration_id IS 'Duration/contract length for this academic year';

COMMENT ON VIEW current_student_bookings IS 'Current student bookings with all related data joined';
COMMENT ON VIEW student_booking_history IS 'Student booking history across all academic years';
