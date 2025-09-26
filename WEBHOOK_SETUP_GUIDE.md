# WPForms to ISKA RMS Webhook Setup Guide

## 🎯 **What Works - Proven Formula**

This guide documents the exact working setup for WPForms webhooks that successfully integrate with ISKA RMS.

## ✅ **Working Webhook Template**

### **File Structure**
```
webhook-name.php (upload to server root)
```

### **Complete Working Webhook Code**
```php
<?php
// [WEBHOOK NAME] webhook for WPForms
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Supabase configuration
$SUPABASE_URL = 'https://vwgczfdedacpymnxzxcp.supabase.co';
$SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z2N6ZmRlZGFjcHltbnh6eGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTYzMzksImV4cCI6MjA2OTY5MjMzOX0.-Be0-yqpi5dYGlZF7-5hDWasoyqX3VpFlhdnNB7ew';
$SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z2N6ZmRlZGFjcHltbnh6eGNwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDExNjMzOSwiZXhwIjoyMDY5NjkyMzM5fQ.g9TbsejTxHLPzmo7Up21GGn0KIAQ-JaX0adg7nxFVuQ';

// Log file for debugging
$logFile = 'webhook-debug.log';

try {
    // Get the raw POST data
    $rawData = file_get_contents('php://input');
    $formData = json_decode($rawData, true);

    // Log everything
    $logEntry = "=== WEBHOOK DEBUG - " . date('Y-m-d H:i:s') . " ===\n";
    $logEntry .= "Raw POST Data: " . $rawData . "\n";
    $logEntry .= "Decoded Form Data: " . print_r($formData, true) . "\n";
    $logEntry .= "POST Array: " . print_r($_POST, true) . "\n";

    // If JSON decode failed, try to get from $_POST
    if (!$formData) {
        $formData = $_POST;
    }

    // Check if we have any data at all
    if (empty($formData) && empty($_POST)) {
        $logEntry .= "ERROR: No form data received\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'No form data received']);
        exit();
    }

    // Extract the data - CRITICAL: This exact pattern works
    $extractedData = [];
    
    if (isset($formData['wpforms']['fields'])) {
        // Standard WPForms structure
        $fields = $formData['wpforms']['fields'];
        foreach ($fields as $fieldId => $value) {
            $extractedData['field_' . $fieldId] = $value;
        }
    } elseif (isset($formData['fields'])) {
        // Alternative WPForms structure
        $fields = $formData['fields'];
        foreach ($fields as $fieldId => $value) {
            $extractedData['field_' . $fieldId] = $value;
        }
    } elseif (is_array($formData)) {
        // Direct field mapping
        $extractedData = $formData;
    } else {
        // Fallback to $_POST
        $extractedData = $_POST;
    }

    $logEntry .= "Extracted Data: " . print_r($extractedData, true) . "\n";

    // Validate required fields
    if (empty($extractedData['first_name']) && empty($extractedData['field_1'])) {
        $logEntry .= "ERROR: First name is required\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'First name is required']);
        exit();
    }

    if (empty($extractedData['last_name']) && empty($extractedData['field_2'])) {
        $logEntry .= "ERROR: Last name is required\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Last name is required']);
        exit();
    }

    // Get the field values (try both formats)
    $firstName = $extractedData['first_name'] ?? $extractedData['field_1'] ?? '';
    $lastName = $extractedData['last_name'] ?? $extractedData['field_2'] ?? '';
    $email = $extractedData['email'] ?? $extractedData['field_3'] ?? '';
    $phone = $extractedData['phone'] ?? $extractedData['field_4'] ?? '';
    $message = $extractedData['message'] ?? $extractedData['field_5'] ?? '';
    $roomGrade = $extractedData['room_grade'] ?? $extractedData['field_6'] ?? '';
    $duration = $extractedData['duration'] ?? $extractedData['field_7'] ?? '';

    $logEntry .= "Field Values:\n";
    $logEntry .= "First Name: $firstName\n";
    $logEntry .= "Last Name: $lastName\n";
    $logEntry .= "Email: $email\n";
    $logEntry .= "Phone: $phone\n";
    $logEntry .= "Message: $message\n";
    $logEntry .= "Room Grade: $roomGrade\n";
    $logEntry .= "Duration: $duration\n";

    // Look up room grade and duration IDs
    $roomGradeId = null;
    $durationId = null;

    if (!empty($roomGrade)) {
        $logEntry .= "Looking up room grade: $roomGrade\n";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/lead_room_grades?select=id&name=eq.' . urlencode($roomGrade));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . $SUPABASE_SERVICE_ROLE_KEY,
            'Authorization: Bearer ' . $SUPABASE_SERVICE_ROLE_KEY
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $logEntry .= "Room grade lookup - HTTP Code: $httpCode, Response: $response\n";

        if ($httpCode === 200) {
            $result = json_decode($response, true);
            if (!empty($result) && isset($result[0]['id'])) {
                $roomGradeId = $result[0]['id'];
                $logEntry .= "Found room grade ID: $roomGradeId\n";
            }
        }
    }

    if (!empty($duration)) {
        $logEntry .= "Looking up duration: $duration\n";

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/lead_duration_types?select=id&name=eq.' . urlencode($duration));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . $SUPABASE_SERVICE_ROLE_KEY,
            'Authorization: Bearer ' . $SUPABASE_SERVICE_ROLE_KEY
        ]);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        $logEntry .= "Duration lookup - HTTP Code: $httpCode, Response: $response\n";

        if ($httpCode === 200) {
            $result = json_decode($response, true);
            if (!empty($result) && isset($result[0]['id'])) {
                $durationId = $result[0]['id'];
                $logEntry .= "Found duration ID: $durationId\n";
            }
        }
    }

    // Create lead data
    $leadData = [
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => !empty($email) ? $email : null,
        'phone' => !empty($phone) ? $phone : null,
        'source_id' => '770e8400-e29b-41d4-a716-446655440001', // Websites source ID
        'status' => 'new',
        'notes' => !empty($message) ? $message : null,
        'room_grade_preference_id' => $roomGradeId,
        'duration_type_preference_id' => $durationId
    ];

    // Remove null values
    $leadData = array_filter($leadData, function($value) {
        return $value !== null;
    });

    $logEntry .= "Lead data to insert: " . json_encode($leadData) . "\n";

    // Insert into Supabase leads table
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/leads');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($leadData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'apikey: ' . $SUPABASE_SERVICE_ROLE_KEY,
        'Authorization: Bearer ' . $SUPABASE_SERVICE_ROLE_KEY,
        'Prefer: return=representation'
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curlError = curl_error($ch);
    curl_close($ch);

    $logEntry .= "Supabase insert - HTTP Code: $httpCode, Response: $response, cURL Error: $curlError\n";

    if ($curlError) {
        $logEntry .= "ERROR: cURL error during lead insertion: $curlError\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        throw new Exception('cURL error: ' . $curlError);
    }

    if ($httpCode === 201) {
        $result = json_decode($response, true);
        $logEntry .= "SUCCESS: Lead created with ID: " . $result[0]['id'] . "\n";
        
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        
        http_response_code(200);
        echo json_encode([
            'success' => true, 
            'message' => 'Lead created successfully', 
            'leadId' => $result[0]['id'], 
            'data' => $result[0]
        ]);
    } else {
        $logEntry .= "ERROR: Supabase error during lead insertion (HTTP $httpCode): $response\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        throw new Exception('Supabase error: ' . $response);
    }

} catch (Exception $e) {
    $logEntry .= "EXCEPTION: " . $e->getMessage() . "\n";
    $logEntry .= "==========================================\n\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'message' => 'Internal server error', 
        'error' => $e->getMessage()
    ]);
}
?>
```

## 🔧 **WPForms Configuration (What Works)**

### **Webhook Settings**
- **Webhook Name**: `[Your Form Name]`
- **Request URL**: `https://yourdomain.com/webhook-name.php`
- **Request Method**: `POST`
- **Request Format**: `JSON`
- **Secret**: `[Generate a random string]`

### **Request Body Mapping (CRITICAL)**
```
first_name → First Name
last_name → Last Name
email → Email
phone → Phone
message → Message (optional)
room_grade → Choose Room Grade
duration → Choose Stay Duration
```

### **Form Field Setup**
- **Use CSS Classes**: Add CSS classes to form fields for identification
- **Field Types**: 
  - Text fields for name, email, phone
  - Select dropdowns for room grade and duration
  - Textarea for message (optional)

## 🎯 **Key Success Factors**

### **1. Data Extraction Pattern (CRITICAL)**
```php
// This exact pattern works - DO NOT CHANGE
$extractedData = [];

if (isset($formData['wpforms']['fields'])) {
    $fields = $formData['wpforms']['fields'];
    foreach ($fields as $fieldId => $value) {
        $extractedData['field_' . $fieldId] = $value;
    }
} elseif (isset($formData['fields'])) {
    $fields = $formData['fields'];
    foreach ($fields as $fieldId => $value) {
        $extractedData['field_' . $fieldId] = $value;
    }
} elseif (is_array($formData)) {
    $extractedData = $formData;
} else {
    $extractedData = $_POST;
}
```

### **2. Field Value Extraction (CRITICAL)**
```php
// Always try both formats
$firstName = $extractedData['first_name'] ?? $extractedData['field_1'] ?? '';
$lastName = $extractedData['last_name'] ?? $extractedData['field_2'] ?? '';
$email = $extractedData['email'] ?? $extractedData['field_3'] ?? '';
$phone = $extractedData['phone'] ?? $extractedData['field_4'] ?? '';
$message = $extractedData['message'] ?? $extractedData['field_5'] ?? '';
$roomGrade = $extractedData['room_grade'] ?? $extractedData['field_6'] ?? '';
$duration = $extractedData['duration'] ?? $extractedData['field_7'] ?? '';
```

### **3. Supabase Configuration (CRITICAL)**
```php
// Use SERVICE_ROLE_KEY for all operations
$SUPABASE_SERVICE_ROLE_KEY = 'your-service-role-key';

// Headers for all requests
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    'Content-Type: application/json',
    'apikey: ' . $SUPABASE_SERVICE_ROLE_KEY,
    'Authorization: Bearer ' . $SUPABASE_SERVICE_ROLE_KEY,
    'Prefer: return=representation'
]);
```

### **4. Lead Data Structure (CRITICAL)**
```php
$leadData = [
    'first_name' => $firstName,
    'last_name' => $lastName,
    'email' => !empty($email) ? $email : null,
    'phone' => !empty($phone) ? $phone : null,
    'source_id' => '770e8400-e29b-41d4-a716-446655440001', // Websites source
    'status' => 'new',
    'notes' => !empty($message) ? $message : null,
    'room_grade_preference_id' => $roomGradeId,
    'duration_type_preference_id' => $durationId
];
```

## 🚀 **Quick Setup Steps**

### **1. Create Webhook File**
1. Copy the template above
2. Change webhook name in comments
3. Upload to server root directory

### **2. Configure WPForms**
1. Go to form settings → Webhooks
2. Add new webhook
3. Set URL to your webhook file
4. Configure Request Body mapping exactly as shown above

### **3. Test**
1. Submit test form
2. Check log file for debugging info
3. Verify lead appears in ISKA RMS

## 🔍 **Debugging**

### **Log Files**
- Webhook creates `webhook-debug.log` in same directory
- Check this file for detailed debugging information

### **Common Issues**
1. **Wrong field mapping** - Use exact Request Body mapping shown above
2. **Wrong API key** - Must use SERVICE_ROLE_KEY, not ANON_KEY
3. **Wrong table** - Always insert into `leads` table initially
4. **Missing validation** - Always validate first_name and last_name

### **Testing Commands**
```bash
# Test webhook directly
curl -X POST https://yourdomain.com/webhook-name.php \
  -H "Content-Type: application/json" \
  -d '{"first_name":"Test","last_name":"User","email":"test@example.com"}'
```

## 📋 **Checklist for New Webhooks**

- [ ] Copy exact template code
- [ ] Update webhook name in comments
- [ ] Upload to server root
- [ ] Configure WPForms with exact Request Body mapping
- [ ] Test with sample data
- [ ] Check log file for errors
- [ ] Verify lead appears in ISKA RMS
- [ ] Test with real form submission

## 🎯 **What NOT to Change**

### **DO NOT MODIFY:**
- Data extraction pattern
- Field value extraction logic
- Supabase API key usage
- Lead data structure
- Request Body mapping format
- Logging pattern

### **DO NOT:**
- Use different table names initially
- Change the field mapping format
- Use ANON_KEY instead of SERVICE_ROLE_KEY
- Skip the dual format field extraction
- Remove the logging

## ✅ **Success Indicators**

- Webhook returns HTTP 200
- Lead appears in ISKA RMS leads list
- Log file shows "SUCCESS: Lead created with ID"
- No errors in server logs
- Form submission completes without errors

---

**This template has been tested and proven to work. Follow it exactly for guaranteed success!** 🚀
