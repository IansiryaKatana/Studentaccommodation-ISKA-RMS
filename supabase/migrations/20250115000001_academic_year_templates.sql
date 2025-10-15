-- Migration: Create Academic Year Templates System
-- This creates templates for installment plans, room grades, and pricing matrix per academic year

-- Step 1: Create academic_year_installment_plans table
CREATE TABLE IF NOT EXISTS academic_year_installment_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  installment_plan_id UUID NOT NULL REFERENCES installment_plans(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  due_dates JSONB NOT NULL DEFAULT '[]'::jsonb,
  deposit_amount DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(installment_plan_id, academic_year)
);

-- Step 2: Create academic_year_room_grades table
CREATE TABLE IF NOT EXISTS academic_year_room_grades (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_grade_id UUID NOT NULL REFERENCES room_grades(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  weekly_rate DECIMAL(10,2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_grade_id, academic_year)
);

-- Step 3: Create academic_year_pricing_matrix table
CREATE TABLE IF NOT EXISTS academic_year_pricing_matrix (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_grade_id UUID NOT NULL REFERENCES room_grades(id) ON DELETE CASCADE,
  duration_id UUID NOT NULL REFERENCES durations(id) ON DELETE CASCADE,
  academic_year TEXT NOT NULL,
  weekly_rate_override DECIMAL(10,2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_grade_id, duration_id, academic_year)
);

-- Step 4: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_academic_year_installment_plans_academic_year ON academic_year_installment_plans(academic_year);
CREATE INDEX IF NOT EXISTS idx_academic_year_installment_plans_installment_plan_id ON academic_year_installment_plans(installment_plan_id);
CREATE INDEX IF NOT EXISTS idx_academic_year_installment_plans_active ON academic_year_installment_plans(is_active);

CREATE INDEX IF NOT EXISTS idx_academic_year_room_grades_academic_year ON academic_year_room_grades(academic_year);
CREATE INDEX IF NOT EXISTS idx_academic_year_room_grades_room_grade_id ON academic_year_room_grades(room_grade_id);
CREATE INDEX IF NOT EXISTS idx_academic_year_room_grades_active ON academic_year_room_grades(is_active);

CREATE INDEX IF NOT EXISTS idx_academic_year_pricing_matrix_academic_year ON academic_year_pricing_matrix(academic_year);
CREATE INDEX IF NOT EXISTS idx_academic_year_pricing_matrix_room_grade_id ON academic_year_pricing_matrix(room_grade_id);
CREATE INDEX IF NOT EXISTS idx_academic_year_pricing_matrix_duration_id ON academic_year_pricing_matrix(duration_id);
CREATE INDEX IF NOT EXISTS idx_academic_year_pricing_matrix_active ON academic_year_pricing_matrix(is_active);

-- Step 5: Add comments for documentation
COMMENT ON TABLE academic_year_installment_plans IS 'Academic year specific installment plan configurations with due dates and deposit amounts';
COMMENT ON TABLE academic_year_room_grades IS 'Academic year specific room grade pricing';
COMMENT ON TABLE academic_year_pricing_matrix IS 'Academic year specific pricing overrides for room grade and duration combinations';

COMMENT ON COLUMN academic_year_installment_plans.due_dates IS 'JSONB array of due dates for installments (e.g., ["2026-10-01", "2027-01-01"])';
COMMENT ON COLUMN academic_year_installment_plans.deposit_amount IS 'Deposit amount for this installment plan in this academic year';

COMMENT ON COLUMN academic_year_room_grades.weekly_rate IS 'Weekly rate for this room grade in this academic year';

COMMENT ON COLUMN academic_year_pricing_matrix.weekly_rate_override IS 'Override weekly rate for specific room grade and duration combination in this academic year';

-- Step 6: Disable RLS (following your system pattern)
ALTER TABLE academic_year_installment_plans DISABLE ROW LEVEL SECURITY;
ALTER TABLE academic_year_room_grades DISABLE ROW LEVEL SECURITY;
ALTER TABLE academic_year_pricing_matrix DISABLE ROW LEVEL SECURITY;
