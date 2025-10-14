-- Fix academic year columns - direct approach
-- This migration ensures academic_year columns exist on core tables

-- Add academic_year columns to core tables
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE student_installments ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);

-- Update existing data to 2025/2026
UPDATE invoices SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE payments SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE student_installments SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE reservations SET academic_year = '2025/2026' WHERE academic_year IS NULL;
