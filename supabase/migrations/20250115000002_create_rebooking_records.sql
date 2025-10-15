-- Create rebooking_records table
CREATE TABLE IF NOT EXISTS rebooking_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  new_student_id UUID REFERENCES students(id) ON DELETE SET NULL,
  current_academic_year TEXT NOT NULL,
  new_academic_year TEXT NOT NULL,
  studio_id UUID NOT NULL REFERENCES studios(id) ON DELETE CASCADE,
  duration_id UUID NOT NULL REFERENCES durations(id) ON DELETE CASCADE,
  installment_plan_id UUID REFERENCES installment_plans(id) ON DELETE SET NULL,
  deposit_amount DECIMAL(10,2) NOT NULL,
  deposit_paid BOOLEAN DEFAULT false,
  stripe_payment_intent_id TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_rebooking_records_original_student_id ON rebooking_records(original_student_id);
CREATE INDEX IF NOT EXISTS idx_rebooking_records_new_student_id ON rebooking_records(new_student_id);
CREATE INDEX IF NOT EXISTS idx_rebooking_records_current_academic_year ON rebooking_records(current_academic_year);
CREATE INDEX IF NOT EXISTS idx_rebooking_records_new_academic_year ON rebooking_records(new_academic_year);
CREATE INDEX IF NOT EXISTS idx_rebooking_records_studio_id ON rebooking_records(studio_id);
CREATE INDEX IF NOT EXISTS idx_rebooking_records_status ON rebooking_records(status);

-- Disable RLS for this table (following the pattern of other data tables)
ALTER TABLE rebooking_records DISABLE ROW LEVEL SECURITY;

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_rebooking_records_updated_at 
    BEFORE UPDATE ON rebooking_records 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
