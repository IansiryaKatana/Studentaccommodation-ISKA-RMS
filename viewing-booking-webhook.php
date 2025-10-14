<?php
// Viewing Booking webhook for "Booked a Viewing" WPForms
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
$logFile = 'viewing-booking-webhook-debug.log';

try {
    // Get the raw POST data
    $rawData = file_get_contents('php://input');
    $formData = json_decode($rawData, true);

    // Log everything - EXACT SAME AS WORKING WEBHOOK
    $logEntry = "=== VIEWING BOOKING WEBHOOK DEBUG - " . date('Y-m-d H:i:s') . " ===\n";
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

    // Extract the data - EXACT SAME AS WORKING WEBHOOK
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

    // Note: booking_datetime is required for viewing bookings, but let's make it optional for now to match callback pattern
    // if (empty($extractedData['booking_datetime']) && empty($extractedData['field_6'])) {
    //     $logEntry .= "ERROR: Booking datetime is required\n";
    //     file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
    //     
    //     http_response_code(400);
    //     echo json_encode(['success' => false, 'message' => 'Booking datetime is required']);
    //     exit();
    // }

    // Get the field values (try both formats) - SAME AS WORKING CALLBACK WEBHOOK
    $firstName = $extractedData['first_name'] ?? $extractedData['field_1'] ?? '';
    $lastName = $extractedData['last_name'] ?? $extractedData['field_2'] ?? '';
    $email = $extractedData['email'] ?? $extractedData['field_3'] ?? '';
    $phone = $extractedData['phone'] ?? $extractedData['field_4'] ?? '';
    $roomGrade = $extractedData['room_grade'] ?? $extractedData['field_5'] ?? '';
    $bookingDateTimeRaw = $extractedData['booking_datetime'] ?? $extractedData['field_6'] ?? '';
    $duration = $extractedData['duration'] ?? $extractedData['field_7'] ?? '';
    
    // Handle date/time field - WPForms sends it as an array with date and time
    $bookingDateTime = '';
    if (is_array($bookingDateTimeRaw)) {
        // WPForms Date/Time field sends: ['date' => '2024-01-15', 'time' => '14:30']
        if (isset($bookingDateTimeRaw['date']) && isset($bookingDateTimeRaw['time'])) {
            $bookingDateTime = $bookingDateTimeRaw['date'] . ' ' . $bookingDateTimeRaw['time'];
        } elseif (isset($bookingDateTimeRaw[0]) && isset($bookingDateTimeRaw[1])) {
            // Alternative array format: [0 => '2024-01-15', 1 => '14:30']
            $bookingDateTime = $bookingDateTimeRaw[0] . ' ' . $bookingDateTimeRaw[1];
        } else {
            // Join all array elements
            $bookingDateTime = implode(' ', $bookingDateTimeRaw);
        }
    } else {
        $bookingDateTime = $bookingDateTimeRaw;
    }

    $logEntry .= "Field Values:\n";
    $logEntry .= "First Name: $firstName\n";
    $logEntry .= "Last Name: $lastName\n";
    $logEntry .= "Email: $email\n";
    $logEntry .= "Phone: $phone\n";
    $logEntry .= "Room Grade: $roomGrade\n";
    $logEntry .= "Booking DateTime Raw: " . print_r($bookingDateTimeRaw, true) . "\n";
    $logEntry .= "Booking DateTime Processed: $bookingDateTime\n";
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

    // Get current academic year from database
    $academicYear = '2025/2026'; // Fallback default
    $yearCh = curl_init();
    curl_setopt($yearCh, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/academic_years?is_current=eq.true&select=name');
    curl_setopt($yearCh, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($yearCh, CURLOPT_HTTPHEADER, [
        'apikey: ' . $SUPABASE_SERVICE_ROLE_KEY,
        'Authorization: Bearer ' . $SUPABASE_SERVICE_ROLE_KEY
    ]);
    
    $yearResponse = curl_exec($yearCh);
    $yearHttpCode = curl_getinfo($yearCh, CURLINFO_HTTP_CODE);
    curl_close($yearCh);
    
    if ($yearHttpCode === 200 && $yearResponse) {
        $yearData = json_decode($yearResponse, true);
        if (!empty($yearData) && isset($yearData[0]['name'])) {
            $academicYear = $yearData[0]['name'];
        }
    }
    
    $logEntry .= "Academic year to use: " . $academicYear . "\n";

    // Create lead data - SAME AS WORKING WEBHOOK (temporarily using leads table)
    $leadData = [
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => !empty($email) ? $email : null,
        'phone' => !empty($phone) ? $phone : null,
        'source_id' => '770e8400-e29b-41d4-a716-446655440001', // Websites source ID
        'status' => 'new', // Same as working webhook
        'notes' => !empty($bookingDateTime) ? "Viewing booking requested for: " . $bookingDateTime : null,
        'room_grade_preference_id' => $roomGradeId,
        'duration_type_preference_id' => $durationId,
        'academic_year' => $academicYear // Use current academic year from database
    ];

    // Remove null values
    $leadData = array_filter($leadData, function($value) {
        return $value !== null;
    });

    $logEntry .= "Lead data to insert: " . json_encode($leadData) . "\n";

    // Insert into Supabase leads table (SAME AS WORKING WEBHOOK)
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
        $logEntry .= "ERROR: cURL error during booking insertion: $curlError\n";
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
            'message' => 'Viewing booking lead created successfully', 
            'leadId' => $result[0]['id'], 
            'data' => $result[0]
        ]);
    } else {
        $logEntry .= "ERROR: Supabase error during booking insertion (HTTP $httpCode): $response\n";
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
