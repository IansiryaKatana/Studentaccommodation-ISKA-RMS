-- =====================================================
-- STUDENT STUDIO TRACKING & STATUS UPDATES
-- =====================================================
-- This migration creates triggers to automatically update studio status
-- when students are assigned to or removed from studios
-- =====================================================

-- Function to update studio status when student is assigned/removed
CREATE OR REPLACE FUNCTION update_studio_status_from_students()
RETURNS TRIGGER AS $$
DECLARE
  v_old_studio_id UUID;
  v_new_studio_id UUID;
  v_has_other_students BOOLEAN;
  v_has_reservations BOOLEAN;
BEGIN
  -- Determine which studio IDs to check
  IF (TG_OP = 'DELETE') THEN
    v_old_studio_id := OLD.studio_id;
    v_new_studio_id := NULL;
  ELSIF (TG_OP = 'UPDATE') THEN
    v_old_studio_id := OLD.studio_id;
    v_new_studio_id := NEW.studio_id;
  ELSE -- INSERT
    v_old_studio_id := NULL;
    v_new_studio_id := NEW.studio_id;
  END IF;

  -- Handle old studio (student moved out or deleted)
  IF v_old_studio_id IS NOT NULL AND (v_old_studio_id != v_new_studio_id OR v_new_studio_id IS NULL) THEN
    -- Check if studio still has other students
    SELECT EXISTS (
      SELECT 1
      FROM students
      WHERE studio_id = v_old_studio_id
        AND id != COALESCE(OLD.id, '00000000-0000-0000-0000-000000000000'::UUID)
      LIMIT 1
    ) INTO v_has_other_students;
    
    -- Check if studio has active reservations
    SELECT EXISTS (
      SELECT 1
      FROM reservations
      WHERE studio_id = v_old_studio_id
        AND status IN ('pending', 'confirmed', 'checked_in')
      LIMIT 1
    ) INTO v_has_reservations;
    
    -- If no students and no reservations, mark as vacant
    IF NOT v_has_other_students AND NOT v_has_reservations THEN
      UPDATE studios
      SET status = 'vacant'
      WHERE id = v_old_studio_id
        AND status = 'occupied';
      
      RAISE NOTICE 'Studio % status updated to vacant (no students or reservations)', v_old_studio_id;
    END IF;
  END IF;

  -- Handle new studio (student assigned)
  IF v_new_studio_id IS NOT NULL THEN
    -- Mark studio as occupied
    UPDATE studios
    SET status = 'occupied'
    WHERE id = v_new_studio_id
      AND status = 'vacant';
    
    RAISE NOTICE 'Studio % status updated to occupied (student assigned)', v_new_studio_id;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Function to update studio status based on reservations (from previous migration)
CREATE OR REPLACE FUNCTION update_studio_status_from_reservations()
RETURNS TRIGGER AS $$
DECLARE
  v_studio_id UUID;
  v_has_active_reservation BOOLEAN;
  v_has_students BOOLEAN;
  v_current_status TEXT;
BEGIN
  -- Determine which studio_id to check
  IF (TG_OP = 'DELETE') THEN
    v_studio_id := OLD.studio_id;
  ELSE
    v_studio_id := NEW.studio_id;
  END IF;

  -- Skip if studio_id is null
  IF v_studio_id IS NULL THEN
    RETURN COALESCE(NEW, OLD);
  END IF;

  -- Get current studio status
  SELECT status INTO v_current_status
  FROM studios
  WHERE id = v_studio_id;

  -- Check if studio has any active reservations
  SELECT EXISTS (
    SELECT 1
    FROM reservations
    WHERE studio_id = v_studio_id
      AND status IN ('pending', 'confirmed', 'checked_in')
    LIMIT 1
  ) INTO v_has_active_reservation;
  
  -- Check if studio has assigned students
  SELECT EXISTS (
    SELECT 1
    FROM students
    WHERE studio_id = v_studio_id
    LIMIT 1
  ) INTO v_has_students;

  -- Update studio status based on reservations AND students
  IF v_has_active_reservation OR v_has_students THEN
    -- Studio is occupied (has reservation or students)
    IF v_current_status = 'vacant' THEN
      UPDATE studios
      SET status = 'occupied'
      WHERE id = v_studio_id;
      
      RAISE NOTICE 'Studio % status updated to occupied', v_studio_id;
    END IF;
  ELSE
    -- Studio is vacant (no reservations and no students)
    IF v_current_status = 'occupied' THEN
      UPDATE studios
      SET status = 'vacant'
      WHERE id = v_studio_id;
      
      RAISE NOTICE 'Studio % status updated to vacant', v_studio_id;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_update_studio_status_on_student_insert ON students;
DROP TRIGGER IF EXISTS trigger_update_studio_status_on_student_update ON students;
DROP TRIGGER IF EXISTS trigger_update_studio_status_on_student_delete ON students;

DROP TRIGGER IF EXISTS trigger_update_studio_status_on_reservation_insert ON reservations;
DROP TRIGGER IF EXISTS trigger_update_studio_status_on_reservation_update ON reservations;
DROP TRIGGER IF EXISTS trigger_update_studio_status_on_reservation_delete ON reservations;

-- Create triggers for STUDENTS table
CREATE TRIGGER trigger_update_studio_status_on_student_insert
AFTER INSERT ON students
FOR EACH ROW
WHEN (NEW.studio_id IS NOT NULL)
EXECUTE FUNCTION update_studio_status_from_students();

CREATE TRIGGER trigger_update_studio_status_on_student_update
AFTER UPDATE OF studio_id ON students
FOR EACH ROW
WHEN (OLD.studio_id IS DISTINCT FROM NEW.studio_id)
EXECUTE FUNCTION update_studio_status_from_students();

CREATE TRIGGER trigger_update_studio_status_on_student_delete
AFTER DELETE ON students
FOR EACH ROW
WHEN (OLD.studio_id IS NOT NULL)
EXECUTE FUNCTION update_studio_status_from_students();

-- Create triggers for RESERVATIONS table
CREATE TRIGGER trigger_update_studio_status_on_reservation_insert
AFTER INSERT ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_studio_status_from_reservations();

CREATE TRIGGER trigger_update_studio_status_on_reservation_update
AFTER UPDATE OF status, studio_id ON reservations
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status OR OLD.studio_id IS DISTINCT FROM NEW.studio_id)
EXECUTE FUNCTION update_studio_status_from_reservations();

CREATE TRIGGER trigger_update_studio_status_on_reservation_delete
AFTER DELETE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_studio_status_from_reservations();

-- =====================================================
-- FIX EXISTING STUDIO STATUSES BASED ON STUDENTS + RESERVATIONS
-- =====================================================

-- Update studios that have students but are marked as vacant
UPDATE studios
SET status = 'occupied'
WHERE status = 'vacant'
  AND EXISTS (
    SELECT 1
    FROM students
    WHERE students.studio_id = studios.id
  );

-- Update studios that are occupied but have no students or reservations
UPDATE studios
SET status = 'vacant'
WHERE status = 'occupied'
  AND NOT EXISTS (
    SELECT 1
    FROM students
    WHERE students.studio_id = studios.id
  )
  AND NOT EXISTS (
    SELECT 1
    FROM reservations
    WHERE reservations.studio_id = studios.id
      AND reservations.status IN ('pending', 'confirmed', 'checked_in')
  );

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON FUNCTION update_studio_status_from_students() IS 'Automatically updates studio status when students are assigned/removed. Studios with students are marked as occupied.';

COMMENT ON FUNCTION update_studio_status_from_reservations() IS 'Automatically updates studio status based on reservations AND students. Studios with active reservations or assigned students are marked as occupied.';

