-- Fix rebooking_records table to work with new student booking system
-- Add student_booking_id column and update foreign key references

-- Add student_booking_id column
ALTER TABLE rebooking_records ADD COLUMN IF NOT EXISTS student_booking_id UUID REFERENCES student_bookings(id) ON DELETE SET NULL;

-- Create index for the new column
CREATE INDEX IF NOT EXISTS idx_rebooking_records_student_booking_id ON rebooking_records(student_booking_id);

-- Note: We keep new_student_id for backward compatibility, but it should reference students(id)
-- The new student_booking_id field should be used for the new system
