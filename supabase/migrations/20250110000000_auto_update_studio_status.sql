-- =====================================================
-- AUTO UPDATE STUDIO STATUS BASED ON RESERVATIONS
-- =====================================================
-- This migration creates triggers to automatically update studio status
-- when reservations are created, updated, or deleted
-- =====================================================

-- First, let's create a function to update studio status based on current reservations
CREATE OR REPLACE FUNCTION update_studio_status_from_reservations()
RETURNS TRIGGER AS $$
DECLARE
  v_studio_id UUID;
  v_has_active_reservation BOOLEAN;
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

  -- Check if studio has any active reservations (pending, confirmed, or checked_in)
  SELECT EXISTS (
    SELECT 1
    FROM reservations
    WHERE studio_id = v_studio_id
      AND status IN ('pending', 'confirmed', 'checked_in')
    LIMIT 1
  ) INTO v_has_active_reservation;

  -- Update studio status based on reservation status
  IF v_has_active_reservation THEN
    -- Studio has active reservation - should be marked as occupied
    -- But only update if current status is 'vacant' (don't override maintenance, cleaning, etc.)
    IF v_current_status = 'vacant' THEN
      UPDATE studios
      SET status = 'occupied',
          updated_at = NOW()
      WHERE id = v_studio_id;
      
      RAISE NOTICE 'Studio % status updated to occupied (has active reservation)', v_studio_id;
    END IF;
  ELSE
    -- Studio has NO active reservations - should be marked as vacant
    -- Only update if current status is 'occupied' (don't override maintenance, cleaning, dirty)
    IF v_current_status = 'occupied' THEN
      UPDATE studios
      SET status = 'vacant',
          updated_at = NOW()
      WHERE id = v_studio_id;
      
      RAISE NOTICE 'Studio % status updated to vacant (no active reservations)', v_studio_id;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_update_studio_status_on_reservation_insert ON reservations;
DROP TRIGGER IF EXISTS trigger_update_studio_status_on_reservation_update ON reservations;
DROP TRIGGER IF EXISTS trigger_update_studio_status_on_reservation_delete ON reservations;

-- Create trigger for INSERT (new reservation created)
CREATE TRIGGER trigger_update_studio_status_on_reservation_insert
AFTER INSERT ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_studio_status_from_reservations();

-- Create trigger for UPDATE (reservation status changed)
CREATE TRIGGER trigger_update_studio_status_on_reservation_update
AFTER UPDATE OF status, studio_id ON reservations
FOR EACH ROW
WHEN (OLD.status IS DISTINCT FROM NEW.status OR OLD.studio_id IS DISTINCT FROM NEW.studio_id)
EXECUTE FUNCTION update_studio_status_from_reservations();

-- Create trigger for DELETE (reservation deleted)
CREATE TRIGGER trigger_update_studio_status_on_reservation_delete
AFTER DELETE ON reservations
FOR EACH ROW
EXECUTE FUNCTION update_studio_status_from_reservations();

-- =====================================================
-- FIX EXISTING STUDIO STATUSES
-- =====================================================
-- Update all studios that are marked as 'occupied' but have no active reservations
-- to 'vacant' status

UPDATE studios
SET status = 'vacant',
    updated_at = NOW()
WHERE status = 'occupied'
  AND NOT EXISTS (
    SELECT 1
    FROM reservations
    WHERE reservations.studio_id = studios.id
      AND reservations.status IN ('pending', 'confirmed', 'checked_in')
  );

-- Update all studios that have active reservations but are marked as 'vacant'
-- to 'occupied' status (only if not in maintenance, cleaning, or dirty)

UPDATE studios
SET status = 'occupied',
    updated_at = NOW()
WHERE status = 'vacant'
  AND EXISTS (
    SELECT 1
    FROM reservations
    WHERE reservations.studio_id = studios.id
      AND reservations.status IN ('pending', 'confirmed', 'checked_in')
  );

-- =====================================================
-- COMMENTS
-- =====================================================
COMMENT ON FUNCTION update_studio_status_from_reservations() IS 'Automatically updates studio status based on current reservations. Studios with active reservations (pending/confirmed/checked_in) are marked as occupied, studios without are marked as vacant.';

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================
-- Run this to verify the fix worked:
-- SELECT 
--   s.studio_number,
--   s.status as current_status,
--   CASE 
--     WHEN EXISTS (
--       SELECT 1 FROM reservations r 
--       WHERE r.studio_id = s.id 
--       AND r.status IN ('pending', 'confirmed', 'checked_in')
--     ) THEN 'occupied'
--     ELSE 'vacant'
--   END as should_be_status,
--   COUNT(r.id) as active_reservations
-- FROM studios s
-- LEFT JOIN reservations r ON r.studio_id = s.id 
--   AND r.status IN ('pending', 'confirmed', 'checked_in')
-- GROUP BY s.id, s.studio_number, s.status
-- HAVING s.status != CASE 
--   WHEN EXISTS (
--     SELECT 1 FROM reservations r2 
--     WHERE r2.studio_id = s.id 
--     AND r2.status IN ('pending', 'confirmed', 'checked_in')
--   ) THEN 'occupied'
--   ELSE 'vacant'
-- END;

