# 🎯 FINAL WEBHOOK SOLUTION - PHP Webhooks

## ❌ **Problem with Supabase Edge Functions**

Supabase Edge Functions require:
1. Authorization headers (API keys)
2. Complex WPForms configuration  
3. Additional authentication setup

**Result:** Not working reliably with WPForms

---

## ✅ **RECOMMENDED SOLUTION: PHP Webhooks**

Use the updated PHP webhook files - they're simpler, faster, and work perfectly with WPForms.

---

## 📝 **Step-by-Step Setup**

### **STEP 1: Upload PHP Files to Your Web Server**

Upload these 2 files to your WordPress hosting server (use FTP, cPanel File Manager, or your hosting control panel):

#### **Files to Upload:**
1. **`final-wpforms-webhook.php`** → For "Get a Callback" form
2. **`viewing-booking-webhook.php`** → For "Booked a Viewing" form

#### **Where to Upload:**
- Upload to your website's root directory (usually `public_html` or `www`)
- OR upload to the same directory where your current webhooks are located

**Example paths after upload:**
- `https://yourdomain.com/final-wpforms-webhook.php`
- `https://yourdomain.com/viewing-booking-webhook.php`

---

### **STEP 2: Configure WPForms**

#### **For "Get a Callback" Form:**

1. Go to WordPress Admin → WPForms → Select your "Get a Callback" form
2. Go to Settings → Webhooks
3. Click "Add New Webhook"
4. Configure as follows:

**Webhook URL:**
```
https://yourdomain.com/final-wpforms-webhook.php
```
(Replace `yourdomain.com` with your actual domain)

**Request Method:** POST

**Request Format:** Form (x-www-form-urlencoded) OR Raw JSON

**Request Body Mapping:**
- Map `field_1` to first_name
- Map `field_2` to last_name
- Map `field_3` to email
- Map `field_4` to phone
- Map `field_5` to message
- Map `field_6` to room_grade
- Map `field_7` to duration

**OR if using Raw JSON:**
```json
{
  "field_1": "{field_id=\"1\"}",
  "field_2": "{field_id=\"2\"}",
  "field_3": "{field_id=\"3\"}",
  "field_4": "{field_id=\"4\"}",
  "field_5": "{field_id=\"5\"}",
  "field_6": "{field_id=\"6\"}",
  "field_7": "{field_id=\"7\"}"
}
```

5. Save webhook

---

#### **For "Booked a Viewing" Form:**

1. Go to WordPress Admin → WPForms → Select your "Booked a Viewing" form
2. Go to Settings → Webhooks
3. Click "Add New Webhook"
4. Configure as follows:

**Webhook URL:**
```
https://yourdomain.com/viewing-booking-webhook.php
```
(Replace `yourdomain.com` with your actual domain)

**Request Method:** POST

**Request Format:** Form (x-www-form-urlencoded) OR Raw JSON

**Request Body Mapping:**
- Map `field_1` to first_name
- Map `field_2` to last_name
- Map `field_3` to email
- Map `field_4` to phone
- Map `field_5` to booking_datetime
- Map `field_6` to room_grade
- Map `field_7` to duration

**OR if using Raw JSON:**
```json
{
  "field_1": "{field_id=\"1\"}",
  "field_2": "{field_id=\"2\"}",
  "field_3": "{field_id=\"3\"}",
  "field_4": "{field_id=\"4\"}",
  "field_5": "{field_id=\"5\"}",
  "field_6": "{field_id=\"6\"}",
  "field_7": "{field_id=\"7\"}"
}
```

5. Save webhook

---

### **STEP 3: Test the Webhooks**

1. Submit a test form for "Get a Callback"
2. Check if the lead appears in ISKA RMS → Leads → Get a Callback
3. Verify the lead has `academic_year: '2025/2026'`
4. Submit a test form for "Booked a Viewing"
5. Check if the lead appears in ISKA RMS → Leads → Booked a Viewing
6. Verify the lead has `academic_year: '2025/2026'`

---

## 🔧 **What's Fixed in the Updated PHP Files**

### **Before (Old Code):**
```php
$leadData = [
    'first_name' => $firstName,
    'last_name' => $lastName,
    // ... other fields
    'academic_year' => '2025/2026' // ❌ Hardcoded
];
```

### **After (New Code):**
```php
// ✅ Fetch current academic year from database
$yearCh = curl_init();
curl_setopt($yearCh, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/academic_years?is_current=eq.true&select=name');
// ... fetch and parse ...
$academicYear = $yearData[0]['name'] ?? '2025/2026'; // Fallback

$leadData = [
    'first_name' => $firstName,
    'last_name' => $lastName,
    // ... other fields  
    'academic_year' => $academicYear // ✅ Dynamic from database
];
```

---

## 🐛 **Debugging**

If webhooks aren't working:

### **Check Debug Logs:**
The webhooks create log files on your server:
- `final-webhook-debug.log` (for Get a Callback)
- `viewing-booking-webhook-debug.log` (for Booked a Viewing)

**How to access:**
1. Connect to your server via FTP/cPanel
2. Look for these log files in the same directory as the webhook files
3. Open them to see detailed request/response data

### **Common Issues:**

**Issue 1: Leads not appearing**
- Check if webhook is actually being triggered (check WPForms logs)
- Check debug log files for errors
- Verify your Supabase credentials in the PHP files are correct

**Issue 2: Leads appear then disappear**
- Make sure you're viewing the correct academic year in the frontend
- Check if `academic_year` field is being set correctly in the database

**Issue 3: 404 error when submitting form**
- Verify the webhook files were uploaded correctly
- Check the URL in WPForms matches the actual file location

---

## ✅ **Expected Results**

After setup:
- ✅ New "Get a Callback" leads appear with `academic_year: '2025/2026'`
- ✅ New "Booked a Viewing" leads appear with `academic_year: '2025/2026'`
- ✅ Leads stay visible when filtering by academic year
- ✅ Counters work correctly
- ✅ All leads are properly filtered and displayed

---

## 📊 **Verification Query**

Run this in your Supabase SQL editor to verify:

```sql
SELECT 
  first_name, 
  last_name, 
  academic_year, 
  created_at,
  CASE 
    WHEN notes LIKE '%Viewing booking requested for:%' THEN 'VIEWING'
    ELSE 'CALLBACK'
  END as lead_type
FROM leads
WHERE source_id = '770e8400-e29b-41d4-a716-446655440001' -- Websites source
ORDER BY created_at DESC
LIMIT 20;
```

All new leads should have `academic_year: '2025/2026'`

---

## 🎯 **Files Summary**

**Files in your project (LOCAL):**
- `final-wpforms-webhook.php` ← Upload this
- `viewing-booking-webhook.php` ← Upload this

**After upload (ON WEB SERVER):**
- `https://yourdomain.com/final-wpforms-webhook.php`
- `https://yourdomain.com/viewing-booking-webhook.php`

---

## 💡 **Why PHP Webhooks are Better**

1. ✅ **No authentication required** - WPForms can call them directly
2. ✅ **Simpler configuration** - No headers needed
3. ✅ **Better debugging** - Log files on your server
4. ✅ **Faster** - Direct database access
5. ✅ **More reliable** - No edge function timeouts
6. ✅ **Field mapping flexibility** - Handles different WPForms formats

---

**Created:** January 9, 2025  
**Status:** Ready to deploy  
**Action Required:** Upload PHP files and configure WPForms

