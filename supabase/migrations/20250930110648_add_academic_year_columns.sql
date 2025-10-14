-- Add academic_year columns to core tables that exist
-- This migration adds academic year support for complete data isolation

-- Core booking/financial tables (these definitely exist)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE payments ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE student_installments ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
ALTER TABLE reservations ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);

-- Lead management tables (check if they exist first)
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'leads') THEN
        ALTER TABLE leads ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'callback_bookings') THEN
        ALTER TABLE callback_bookings ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'viewing_bookings') THEN
        ALTER TABLE viewing_bookings ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cleaning_tasks') THEN
        ALTER TABLE cleaning_tasks ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'maintenance_requests') THEN
        ALTER TABLE maintenance_requests ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'expenses') THEN
        ALTER TABLE expenses ADD COLUMN IF NOT EXISTS academic_year VARCHAR(50);
    END IF;
END $$;

-- Update existing data to 2025/2026 for tables that exist
UPDATE invoices SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE payments SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE student_installments SET academic_year = '2025/2026' WHERE academic_year IS NULL;
UPDATE reservations SET academic_year = '2025/2026' WHERE academic_year IS NULL;

-- Update other tables if they exist
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'leads') THEN
        UPDATE leads SET academic_year = '2025/2026' WHERE academic_year IS NULL;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'callback_bookings') THEN
        UPDATE callback_bookings SET academic_year = '2025/2026' WHERE academic_year IS NULL;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'viewing_bookings') THEN
        UPDATE viewing_bookings SET academic_year = '2025/2026' WHERE academic_year IS NULL;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'cleaning_tasks') THEN
        UPDATE cleaning_tasks SET academic_year = '2025/2026' WHERE academic_year IS NULL;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'maintenance_requests') THEN
        UPDATE maintenance_requests SET academic_year = '2025/2026' WHERE academic_year IS NULL;
    END IF;
    
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'expenses') THEN
        UPDATE expenses SET academic_year = '2025/2026' WHERE academic_year IS NULL;
    END IF;
END $$;
