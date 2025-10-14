-- Add academic_year columns to all required tables
-- This migration adds academic year support for complete data isolation

-- Core booking/financial tables
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE student_installments ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);

-- Lead management tables
ALTER TABLE leads ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE callback_bookings ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE viewing_bookings ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);

-- Operations tables
ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE expenses ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);

-- Create studio_occupancy table for per-year studio tracking
CREATE TABLE IF NOT EXISTS studio_occupancy (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    studio_id UUID REFERENCES studios(id) ON DELETE CASCADE,
    academic_year VARCHAR(50) NOT NULL,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    status VARCHAR(20) DEFAULT 'occupied',
    check_in_date DATE,
    check_out_date DATE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(studio_id, academic_year)
);

-- Create rebooking_records table for tracking student rebookings
CREATE TABLE IF NOT EXISTS rebooking_records (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    original_student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    new_student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    current_academic_year VARCHAR(50) NOT NULL,
    new_academic_year VARCHAR(50) NOT NULL,
    studio_id UUID REFERENCES studios(id),
    duration_id UUID REFERENCES durations(id),
    installment_plan_id UUID REFERENCES installment_plans(id),
    deposit_amount DECIMAL(10,2) DEFAULT 99.00,
    deposit_paid BOOLEAN DEFAULT FALSE,
    stripe_payment_intent_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_invoices_academic_year ON invoices(academic_year);
CREATE INDEX IF NOT EXISTS idx_payments_academic_year ON payments(academic_year);
CREATE INDEX IF NOT EXISTS idx_student_installments_academic_year ON student_installments(academic_year);
CREATE INDEX IF NOT EXISTS idx_reservations_academic_year ON reservations(academic_year);
CREATE INDEX IF NOT EXISTS idx_leads_academic_year ON leads(academic_year);
CREATE INDEX IF NOT EXISTS idx_callback_bookings_academic_year ON callback_bookings(academic_year);
CREATE INDEX IF NOT EXISTS idx_viewing_bookings_academic_year ON viewing_bookings(academic_year);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_academic_year ON cleaning_tasks(academic_year);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_academic_year ON maintenance_requests(academic_year);
CREATE INDEX IF NOT EXISTS idx_expenses_academic_year ON expenses(academic_year);
CREATE INDEX IF NOT EXISTS idx_studio_occupancy_academic_year ON studio_occupancy(academic_year);
CREATE INDEX IF NOT EXISTS idx_rebooking_records_academic_year ON rebooking_records(academic_year);

-- Migrate existing data to 2025/2026 academic year
UPDATE invoices SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE payments SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE student_installments SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE reservations SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE leads SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE callback_bookings SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE viewing_bookings SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE cleaning_tasks SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE maintenance_requests SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE expenses SET academic_year = '2025/2026' WHERE academic_year IS NULL;

-- Create studio occupancy records for existing students
INSERT INTO studio_occupancy (studio_id, academic_year, student_id, status)
SELECT 
    s.studio_id,
    COALESCE(s.academic_year, '2025/2026') as academic_year,
    s.id as student_id,
    'occupied' as status
FROM students s
WHERE s.studio_id IS NOT NULL
ON CONFLICT (studio_id, academic_year) DO NOTHING;

-- Add comments for documentation
COMMENT ON COLUMN invoices.academic_year IS 'Academic year this invoice belongs to (e.g., 2024/2025, 2025/2026)';
COMMENT ON COLUMN payments.academic_year IS 'Academic year this payment belongs to';
COMMENT ON COLUMN student_installments.academic_year IS 'Academic year this installment plan belongs to';
COMMENT ON COLUMN reservations.academic_year IS 'Academic year this reservation belongs to';
COMMENT ON COLUMN leads.academic_year IS 'Academic year this lead belongs to';
COMMENT ON COLUMN callback_bookings.academic_year IS 'Academic year this callback booking belongs to';
COMMENT ON COLUMN viewing_bookings.academic_year IS 'Academic year this viewing booking belongs to';
COMMENT ON COLUMN cleaning_tasks.academic_year IS 'Academic year this cleaning task belongs to';
COMMENT ON COLUMN maintenance_requests.academic_year IS 'Academic year this maintenance request belongs to';
COMMENT ON COLUMN expenses.academic_year IS 'Academic year this expense belongs to';

COMMENT ON TABLE studio_occupancy IS 'Tracks studio occupancy per academic year - allows same studio to be occupied by different students in different years';
COMMENT ON TABLE rebooking_records IS 'Tracks when students rebook for the next academic year with deposit payments';
