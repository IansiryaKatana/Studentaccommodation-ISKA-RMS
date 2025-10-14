-- Add performance indexes for Studios module optimization
-- This migration adds critical indexes to improve query performance

-- Indexes for reservations table (most critical for performance)
CREATE INDEX IF NOT EXISTS idx_reservations_academic_year_created_at ON reservations(academic_year, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reservations_studio_id_academic_year ON reservations(studio_id, academic_year);
CREATE INDEX IF NOT EXISTS idx_reservations_status_academic_year ON reservations(status, academic_year);
CREATE INDEX IF NOT EXISTS idx_reservations_type_academic_year ON reservations(type, academic_year);

-- Indexes for studio_occupancy table
CREATE INDEX IF NOT EXISTS idx_studio_occupancy_academic_year ON studio_occupancy(academic_year);
CREATE INDEX IF NOT EXISTS idx_studio_occupancy_studio_id_academic_year ON studio_occupancy(studio_id, academic_year);
CREATE INDEX IF NOT EXISTS idx_studio_occupancy_status_academic_year ON studio_occupancy(status, academic_year);

-- Indexes for studios table
CREATE INDEX IF NOT EXISTS idx_studios_room_grade_id ON studios(room_grade_id);
CREATE INDEX IF NOT EXISTS idx_studios_status ON studios(status);

-- Indexes for students table (for academic year filtering)
CREATE INDEX IF NOT EXISTS idx_students_academic_year ON students(academic_year);
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);

-- Indexes for tourist_profiles table (if user_id column exists)
-- CREATE INDEX IF NOT EXISTS idx_tourist_profiles_user_id ON tourist_profiles(user_id);

-- Indexes for invoices table (for academic year filtering)
CREATE INDEX IF NOT EXISTS idx_invoices_academic_year ON invoices(academic_year);
CREATE INDEX IF NOT EXISTS idx_invoices_student_id_academic_year ON invoices(student_id, academic_year);
CREATE INDEX IF NOT EXISTS idx_invoices_reservation_id ON invoices(reservation_id);

-- Indexes for payments table (for academic year filtering)
CREATE INDEX IF NOT EXISTS idx_payments_academic_year ON payments(academic_year);
CREATE INDEX IF NOT EXISTS idx_payments_invoice_id ON payments(invoice_id);

-- Indexes for leads table (for academic year filtering)
CREATE INDEX IF NOT EXISTS idx_leads_academic_year ON leads(academic_year);

-- Indexes for expenses table (for academic year filtering)
CREATE INDEX IF NOT EXISTS idx_expenses_academic_year ON expenses(academic_year);

-- Indexes for maintenance_requests table (for academic year filtering)
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_academic_year ON maintenance_requests(academic_year);
CREATE INDEX IF NOT EXISTS idx_maintenance_requests_studio_id ON maintenance_requests(studio_id);

-- Indexes for cleaning_tasks table (for academic year filtering)
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_academic_year ON cleaning_tasks(academic_year);
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_studio_id ON cleaning_tasks(studio_id);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_reservations_studio_status_academic_year ON reservations(studio_id, status, academic_year);
CREATE INDEX IF NOT EXISTS idx_reservations_check_in_date_academic_year ON reservations(check_in_date, academic_year);
CREATE INDEX IF NOT EXISTS idx_reservations_check_out_date_academic_year ON reservations(check_out_date, academic_year);

-- Comments for documentation
COMMENT ON INDEX idx_reservations_academic_year_created_at IS 'Optimizes recent reservations queries by academic year';
COMMENT ON INDEX idx_reservations_studio_id_academic_year IS 'Optimizes studio-specific reservation queries by academic year';
COMMENT ON INDEX idx_studio_occupancy_academic_year IS 'Optimizes studio occupancy queries by academic year';
COMMENT ON INDEX idx_students_academic_year IS 'Optimizes student queries by academic year';
COMMENT ON INDEX idx_invoices_academic_year IS 'Optimizes invoice queries by academic year';
COMMENT ON INDEX idx_payments_academic_year IS 'Optimizes payment queries by academic year';
