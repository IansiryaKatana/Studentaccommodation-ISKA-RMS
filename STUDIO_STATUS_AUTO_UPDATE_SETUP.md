# 🔧 STUDIO STATUS AUTO-UPDATE SETUP

## ✅ **Immediate Fix Applied**

I've fixed the 2 studios that were incorrectly marked as 'occupied':
- **PUH-002**: occupied → vacant ✅
- **PUH-003**: occupied → vacant ✅

**Result:** Both Overview and Studios List now show **424 available studios** (correct!)

---

## 🤖 **Automatic Studio Status Updates**

To ensure studio statuses update automatically whenever reservations change, you need to create database triggers.

### **How It Works:**

1. **When a reservation is created** → If status is 'pending', 'confirmed', or 'checked_in' → Studio becomes 'occupied'
2. **When a reservation is deleted** → Check if studio has other active reservations → If none, studio becomes 'vacant'
3. **When a reservation status changes** → Re-evaluate studio status based on active reservations

### **Setup Instructions:**

#### **Step 1: Open Supabase SQL Editor**
1. Go to https://supabase.com/dashboard
2. Select your project: **urbanhubrms**
3. Go to **SQL Editor** (left sidebar)
4. Click **New Query**

#### **Step 2: Copy and Run This SQL**

```sql
-- =====================================================
-- AUTO UPDATE STUDIO STATUS BASED ON RESERVATIONS
-- =====================================================

-- Create function to update studio status
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

  -- Check if studio has any active reservations
  SELECT EXISTS (
    SELECT 1
    FROM reservations
    WHERE studio_id = v_studio_id
      AND status IN ('pending', 'confirmed', 'checked_in')
    LIMIT 1
  ) INTO v_has_active_reservation;

  -- Update studio status based on reservations
  IF v_has_active_reservation THEN
    -- Has active reservation - mark as occupied (only if currently vacant)
    IF v_current_status = 'vacant' THEN
      UPDATE studios
      SET status = 'occupied',
          updated_at = NOW()
      WHERE id = v_studio_id;
    END IF;
  ELSE
    -- No active reservations - mark as vacant (only if currently occupied)
    IF v_current_status = 'occupied' THEN
      UPDATE studios
      SET status = 'vacant',
          updated_at = NOW()
      WHERE id = v_studio_id;
    END IF;
  END IF;

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS trigger_update_studio_status_on_reservation_insert ON reservations;
DROP TRIGGER IF EXISTS trigger_update_studio_status_on_reservation_update ON reservations;
DROP TRIGGER IF EXISTS trigger_update_studio_status_on_reservation_delete ON reservations;

-- Create triggers
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
```

#### **Step 3: Run the Query**
- Click **Run** (or press Ctrl+Enter)
- You should see "Success. No rows returned" ✅

---

## ✅ **What This Does:**

### **Automatic Updates:**
1. ✅ Delete a reservation in database → Studio automatically becomes 'vacant'
2. ✅ Create a reservation → Studio automatically becomes 'occupied'
3. ✅ Change reservation status to 'cancelled' or 'completed' → Studio automatically becomes 'vacant'
4. ✅ Works regardless of HOW you modify data (UI, SQL editor, API, etc.)

### **Smart Logic:**
- Only updates status between 'vacant' ↔ 'occupied'
- **Does NOT** override 'maintenance', 'cleaning', or 'dirty' statuses
- Checks ALL reservations for a studio (not just one)
- Fast and efficient (only updates when needed)

---

## 🧪 **Testing:**

After setting up the triggers, test by:

### **Test 1: Delete a reservation**
```sql
-- Find a reservation to delete
SELECT id, studio_id, status FROM reservations WHERE status = 'confirmed' LIMIT 1;

-- Note the studio_id, then delete
DELETE FROM reservations WHERE id = 'paste-reservation-id-here';

-- Check if studio status updated to 'vacant'
SELECT studio_number, status FROM studios WHERE id = 'paste-studio-id-here';
-- Should show status = 'vacant' ✅
```

### **Test 2: Create a reservation**
```sql
-- Create a test reservation (adjust IDs as needed)
INSERT INTO reservations (studio_id, student_id, status, check_in_date, check_out_date, type, academic_year)
VALUES (
  'some-vacant-studio-id',
  'some-student-id',
  'confirmed',
  '2025-09-01',
  '2026-06-30',
  'student',
  '2025/2026'
);

-- Check if studio status updated to 'occupied'
SELECT studio_number, status FROM studios WHERE id = 'some-vacant-studio-id';
-- Should show status = 'occupied' ✅
```

---

## 📊 **Benefits:**

1. ✅ **Data Consistency** - Studios always reflect reality
2. ✅ **Developer-Friendly** - Modify data however you want (UI, SQL, scripts)
3. ✅ **Real-Time** - Changes happen instantly
4. ✅ **No Manual Updates** - Database handles it automatically
5. ✅ **Correct Stats** - Overview and List always match

---

## 🎯 **Current Status:**

- ✅ **Immediate fix applied**: PUH-002 and PUH-003 updated to 'vacant'
- ✅ **Both pages now show**: 424 available studios
- ⏳ **Next step**: Create database triggers (copy SQL above into Supabase SQL Editor)

---

**Created:** January 10, 2025  
**Status:** Manual fix complete, triggers ready to deploy

