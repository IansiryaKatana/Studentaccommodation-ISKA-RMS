-- Add reservation_id column to cleaning_tasks table with foreign key and cascade delete
-- This ensures cleaning tasks are automatically deleted when reservations are deleted

-- Add the reservation_id column
ALTER TABLE cleaning_tasks 
ADD COLUMN reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE;

-- Add an index for performance
CREATE INDEX IF NOT EXISTS idx_cleaning_tasks_reservation_id ON cleaning_tasks(reservation_id);

-- Add a comment to document the purpose
COMMENT ON COLUMN cleaning_tasks.reservation_id IS 'Foreign key to reservations table. When a reservation is deleted, associated cleaning tasks are automatically deleted via CASCADE.';

