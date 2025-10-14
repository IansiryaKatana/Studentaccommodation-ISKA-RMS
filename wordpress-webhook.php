<?php
// WordPress Webhook Handler for ISKA RMS
// This file handles POST requests from Elementor forms

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle CORS preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

// Supabase configuration
$SUPABASE_URL = 'https://vwgczfdedacpymnxzxcp.supabase.co';
$SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3Z2N6ZmRlZGFjcHltbnh6eGNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxMTYzMzksImV4cCI6MjA2OTY5MjMzOX0.-Be0-yqpi5dYGlZF7-5hDWasoyqXzI3VpFlhdnNB7ew';

try {
    // Get the raw POST data
    $rawData = file_get_contents('php://input');
    $formData = json_decode($rawData, true);
    
    // If JSON decode failed, try to get from $_POST
    if (!$formData) {
        $formData = $_POST;
    }
    
    // Remove honeypot field if it exists (it's used for spam protection)
    if (isset($formData['honeypot'])) {
        unset($formData['honeypot']);
    }
    
    // Also check for other common honeypot field names
    $honeypotFields = ['honeypot', 'website', 'url', 'email_confirm', 'phone_confirm'];
    foreach ($honeypotFields as $field) {
        if (isset($formData[$field])) {
            unset($formData[$field]);
        }
    }
    
    // Log the received data for debugging
    error_log('WordPress webhook received data: ' . print_r($formData, true));
    error_log('Raw POST data: ' . $rawData);
    error_log('POST array: ' . print_r($_POST, true));
    error_log('Request method: ' . $_SERVER['REQUEST_METHOD']);
    error_log('Content type: ' . $_SERVER['CONTENT_TYPE']);
    
    // Validate required fields
    if (empty($formData['first_name']) || empty($formData['last_name'])) {
        http_response_code(400);
        echo json_encode([
            'success' => false,
            'message' => 'First name and last name are required'
        ]);
        exit();
    }
    
    // Validate UUID function
    function isValidUUID($uuid) {
        return preg_match('/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i', $uuid);
    }
    
    // Map text values to UUIDs (if needed)
    $roomGradeId = isset($formData['room_grade']) ? $formData['room_grade'] : null;
    $durationId = isset($formData['duration']) ? $formData['duration'] : null;
    
    // If the values are text (not UUIDs), look them up in the database
    if ($roomGradeId && !isValidUUID($roomGradeId)) {
        error_log('Room grade is text, looking up UUID for: ' . $roomGradeId);
        
        // Look up room grade by name
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/lead_room_grades?select=id&name=eq.' . urlencode($roomGradeId));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . $SUPABASE_ANON_KEY,
            'Authorization: Bearer ' . $SUPABASE_ANON_KEY
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $result = json_decode($response, true);
            if (!empty($result) && isset($result[0]['id'])) {
                $roomGradeId = $result[0]['id'];
                error_log('Found room grade UUID: ' . $roomGradeId);
            } else {
                error_log('Room grade not found in database: ' . $roomGradeId);
                $roomGradeId = null;
            }
        } else {
            error_log('Error looking up room grade: ' . $response);
            $roomGradeId = null;
        }
    }
    
    if ($durationId && !isValidUUID($durationId)) {
        error_log('Duration is text, looking up UUID for: ' . $durationId);
        
        // Look up duration by name
        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/lead_duration_types?select=id&name=eq.' . urlencode($durationId));
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'apikey: ' . $SUPABASE_ANON_KEY,
            'Authorization: Bearer ' . $SUPABASE_ANON_KEY
        ]);
        
        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        
        if ($httpCode === 200) {
            $result = json_decode($response, true);
            if (!empty($result) && isset($result[0]['id'])) {
                $durationId = $result[0]['id'];
                error_log('Found duration UUID: ' . $durationId);
            } else {
                error_log('Duration not found in database: ' . $durationId);
                $durationId = null;
            }
        } else {
            error_log('Error looking up duration: ' . $response);
            $durationId = null;
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
    
    error_log('Academic year to use: ' . $academicYear);

    // Create lead data
    $leadData = [
        'first_name' => $formData['first_name'],
        'last_name' => $formData['last_name'],
        'email' => isset($formData['email']) ? $formData['email'] : null,
        'phone' => isset($formData['phone']) ? $formData['phone'] : null,
        'source_id' => '770e8400-e29b-41d4-a716-446655440001', // Websites source ID
        'status' => 'new',
        'notes' => isset($formData['message']) ? $formData['message'] : null,
        'room_grade_preference_id' => $roomGradeId,
        'duration_type_preference_id' => $durationId,
        'academic_year' => $academicYear // Use current academic year from database
        // Removed budget and estimated_revenue - these will be filled by staff later
    ];
    
    // Remove null values
    $leadData = array_filter($leadData, function($value) {
        return $value !== null;
    });
    
    // Insert into Supabase
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/leads');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($leadData));
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'apikey: ' . $SUPABASE_ANON_KEY,
        'Authorization: Bearer ' . $SUPABASE_ANON_KEY,
        'Prefer: return=representation'
    ]);
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $error = curl_error($ch);
    curl_close($ch);
    
    if ($error) {
        throw new Exception('cURL error: ' . $error);
    }
    
    if ($httpCode !== 200 && $httpCode !== 201) {
        error_log('Supabase error response: ' . $response);
        throw new Exception('Supabase error: ' . $response);
    }
    
    $result = json_decode($response, true);
    
    // Log success
    error_log('Lead created successfully: ' . print_r($result, true));
    
    // Return success response
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Lead created successfully',
        'leadId' => $result[0]['id'] ?? null,
        'data' => $result[0] ?? null
    ]);
    
} catch (Exception $e) {
    error_log('Webhook error: ' . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error',
        'error' => $e->getMessage()
    ]);
}
?>
