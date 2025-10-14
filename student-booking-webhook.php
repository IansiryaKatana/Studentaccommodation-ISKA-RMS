<?php
// Student Booking Webhook for WPForms
// This webhook replicates the exact functionality of the AddStudentBooking component
// It creates student bookings with all the same functions: invoices, reservations, studio updates, etc.

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
$logFile = 'student-booking-webhook-debug.log';

try {
    // Get the raw POST data
    $rawData = file_get_contents('php://input');
    $formData = json_decode($rawData, true);

    // Log everything
    $logEntry = "=== STUDENT BOOKING WEBHOOK DEBUG - " . date('Y-m-d H:i:s') . " ===\n";
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

    // Extract the data - handle different WPForms formats
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

    // Extract field values using CSS classes and field IDs
    $firstName = $extractedData['first_name'] ?? $extractedData['field_1'] ?? $extractedData['student-first-name'] ?? '';
    $lastName = $extractedData['last_name'] ?? $extractedData['field_2'] ?? $extractedData['student-last-name'] ?? '';
    $email = $extractedData['email'] ?? $extractedData['field_3'] ?? $extractedData['student-email'] ?? '';
    $mobile = $extractedData['mobile'] ?? $extractedData['field_4'] ?? $extractedData['student-mobile'] ?? '';
    $birthday = $extractedData['birthday'] ?? $extractedData['field_5'] ?? $extractedData['student-birthday'] ?? '';
    $ethnicity = $extractedData['ethnicity'] ?? $extractedData['field_6'] ?? $extractedData['student-ethnicity'] ?? '';
    $gender = $extractedData['gender'] ?? $extractedData['field_7'] ?? $extractedData['student-gender'] ?? '';
    $ucasId = $extractedData['ucas_id'] ?? $extractedData['field_8'] ?? $extractedData['student-ucas-id'] ?? '';
    $country = $extractedData['country'] ?? $extractedData['field_9'] ?? $extractedData['student-country'] ?? '';
    $addressLine1 = $extractedData['address_line1'] ?? $extractedData['field_10'] ?? $extractedData['student-address-line1'] ?? '';
    $postCode = $extractedData['post_code'] ?? $extractedData['field_11'] ?? $extractedData['student-post-code'] ?? '';
    $town = $extractedData['town'] ?? $extractedData['field_12'] ?? $extractedData['student-town'] ?? '';
    $academicYear = $extractedData['academic_year'] ?? $extractedData['field_13'] ?? $extractedData['student-academic-year'] ?? '';
    $yearOfStudy = $extractedData['year_of_study'] ?? $extractedData['field_14'] ?? $extractedData['student-year-of-study'] ?? '';
    $fieldOfStudy = $extractedData['field_of_study'] ?? $extractedData['field_15'] ?? $extractedData['student-field-of-study'] ?? '';
    $guarantorName = $extractedData['guarantor_name'] ?? $extractedData['field_16'] ?? $extractedData['student-guarantor-name'] ?? '';
    $guarantorEmail = $extractedData['guarantor_email'] ?? $extractedData['field_17'] ?? $extractedData['student-guarantor-email'] ?? '';
    $guarantorPhone = $extractedData['guarantor_phone'] ?? $extractedData['field_18'] ?? $extractedData['student-guarantor-phone'] ?? '';
    $guarantorRelationship = $extractedData['guarantor_relationship'] ?? $extractedData['field_19'] ?? $extractedData['student-guarantor-relationship'] ?? '';
    $wantsInstallments = $extractedData['wants_installments'] ?? $extractedData['field_20'] ?? $extractedData['student-wants-installments'] ?? '';
    $installmentPlanId = $extractedData['installment_plan_id'] ?? $extractedData['field_21'] ?? $extractedData['student-installment-plan-id'] ?? '';
    $depositPaid = $extractedData['deposit_paid'] ?? $extractedData['field_22'] ?? $extractedData['student-deposit-paid'] ?? '';
    $studioId = $extractedData['studio_id'] ?? $extractedData['field_23'] ?? $extractedData['student-studio-id'] ?? '';
    $totalRevenue = $extractedData['total_revenue'] ?? $extractedData['field_24'] ?? $extractedData['student-total-revenue'] ?? '';
    $checkInDate = $extractedData['check_in_date'] ?? $extractedData['field_25'] ?? $extractedData['student-check-in-date'] ?? '';
    $checkOutDate = $extractedData['check_out_date'] ?? $extractedData['field_26'] ?? $extractedData['student-check-out-date'] ?? '';
    $durationName = $extractedData['duration_name'] ?? $extractedData['field_27'] ?? $extractedData['student-duration-name'] ?? '';
    $durationType = $extractedData['duration_type'] ?? $extractedData['field_28'] ?? $extractedData['student-duration-type'] ?? '';

    $logEntry .= "Field Values:\n";
    $logEntry .= "First Name: $firstName\n";
    $logEntry .= "Last Name: $lastName\n";
    $logEntry .= "Email: $email\n";
    $logEntry .= "Mobile: $mobile\n";
    $logEntry .= "Birthday: $birthday\n";
    $logEntry .= "Ethnicity: $ethnicity\n";
    $logEntry .= "Gender: $gender\n";
    $logEntry .= "UCAS ID: $ucasId\n";
    $logEntry .= "Country: $country\n";
    $logEntry .= "Address Line 1: $addressLine1\n";
    $logEntry .= "Post Code: $postCode\n";
    $logEntry .= "Town: $town\n";
    $logEntry .= "Academic Year: $academicYear\n";
    $logEntry .= "Year of Study: $yearOfStudy\n";
    $logEntry .= "Field of Study: $fieldOfStudy\n";
    $logEntry .= "Guarantor Name: $guarantorName\n";
    $logEntry .= "Guarantor Email: $guarantorEmail\n";
    $logEntry .= "Guarantor Phone: $guarantorPhone\n";
    $logEntry .= "Guarantor Relationship: $guarantorRelationship\n";
    $logEntry .= "Wants Installments: $wantsInstallments\n";
    $logEntry .= "Installment Plan ID: $installmentPlanId\n";
    $logEntry .= "Deposit Paid: $depositPaid\n";
    $logEntry .= "Studio ID: $studioId\n";
    $logEntry .= "Total Revenue: $totalRevenue\n";
    $logEntry .= "Check-in Date: $checkInDate\n";
    $logEntry .= "Check-out Date: $checkOutDate\n";
    $logEntry .= "Duration Name: $durationName\n";
    $logEntry .= "Duration Type: $durationType\n";

    // Validate required fields
    $requiredFields = [
        'firstName' => $firstName,
        'lastName' => $lastName,
        'email' => $email,
        'mobile' => $mobile,
        'birthday' => $birthday,
        'ethnicity' => $ethnicity,
        'gender' => $gender,
        'country' => $country,
        'addressLine1' => $addressLine1,
        'postCode' => $postCode,
        'town' => $town,
        'academicYear' => $academicYear,
        'yearOfStudy' => $yearOfStudy,
        'fieldOfStudy' => $fieldOfStudy,
        'studioId' => $studioId,
        'totalRevenue' => $totalRevenue,
        'checkInDate' => $checkInDate,
        'checkOutDate' => $checkOutDate,
        'durationName' => $durationName,
        'durationType' => $durationType
    ];

    $missingFields = [];
    foreach ($requiredFields as $fieldName => $fieldValue) {
        if (empty($fieldValue)) {
            $missingFields[] = $fieldName;
        }
    }

    if (!empty($missingFields)) {
        $logEntry .= "ERROR: Missing required fields: " . implode(', ', $missingFields) . "\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => 'Missing required fields: ' . implode(', ', $missingFields)
        ]);
        exit();
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $logEntry .= "ERROR: Invalid email format\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        
        http_response_code(400);
        echo json_encode([
            'success' => false, 
            'message' => 'Invalid email format'
        ]);
        exit();
    }

    // Convert boolean fields
    $wantsInstallmentsBool = in_array(strtolower($wantsInstallments), ['yes', 'true', '1', 'on']);
    $depositPaidBool = in_array(strtolower($depositPaid), ['yes', 'true', '1', 'on']);

    // Convert numeric fields
    $totalRevenueFloat = floatval($totalRevenue);
    $yearOfStudyInt = intval($yearOfStudy);

    // Format dates
    $birthdayFormatted = !empty($birthday) ? date('Y-m-d', strtotime($birthday)) : null;
    $checkInFormatted = !empty($checkInDate) ? date('Y-m-d', strtotime($checkInDate)) : null;
    $checkOutFormatted = !empty($checkOutDate) ? date('Y-m-d', strtotime($checkOutDate)) : null;

    $logEntry .= "Processed Values:\n";
    $logEntry .= "Wants Installments: " . ($wantsInstallmentsBool ? 'true' : 'false') . "\n";
    $logEntry .= "Deposit Paid: " . ($depositPaidBool ? 'true' : 'false') . "\n";
    $logEntry .= "Total Revenue: $totalRevenueFloat\n";
    $logEntry .= "Year of Study: $yearOfStudyInt\n";
    $logEntry .= "Birthday Formatted: $birthdayFormatted\n";
    $logEntry .= "Check-in Formatted: $checkInFormatted\n";
    $logEntry .= "Check-out Formatted: $checkOutFormatted\n";

    // Check if student already exists with this email
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/students?select=id&email=eq.' . urlencode($email));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'apikey: ' . $SUPABASE_SERVICE_ROLE_KEY,
        'Authorization: Bearer ' . $SUPABASE_SERVICE_ROLE_KEY
    ]);

    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);

    if ($httpCode === 200) {
        $result = json_decode($response, true);
        if (!empty($result)) {
            $logEntry .= "ERROR: Student with email $email already exists\n";
            file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
            
            http_response_code(400);
            echo json_encode([
                'success' => false, 
                'message' => 'A student with this email already exists'
            ]);
            exit();
        }
    }

    // Create student profile data (exactly like AddStudentBooking component)
    $studentData = [
        'first_name' => $firstName,
        'last_name' => $lastName,
        'email' => $email,
        'phone' => $mobile,
        'birthday' => $birthdayFormatted,
        'ethnicity' => $ethnicity,
        'gender' => $gender,
        'ucas_id' => !empty($ucasId) ? $ucasId : null,
        'country' => $country,
        'address_line1' => $addressLine1,
        'post_code' => $postCode,
        'town' => $town,
        'academic_year' => $academicYear,
        'year_of_study' => $yearOfStudyInt,
        'field_of_study' => $fieldOfStudy,
        'guarantor_name' => !empty($guarantorName) ? $guarantorName : null,
        'guarantor_email' => !empty($guarantorEmail) ? $guarantorEmail : null,
        'guarantor_phone' => !empty($guarantorPhone) ? $guarantorPhone : null,
        'guarantor_relationship' => !empty($guarantorRelationship) ? $guarantorRelationship : null,
        'wants_installments' => $wantsInstallmentsBool,
        'installment_plan_id' => !empty($installmentPlanId) ? $installmentPlanId : null,
        'deposit_paid' => $depositPaidBool,
        'studio_id' => $studioId,
        'total_amount' => $totalRevenueFloat,
        'check_in_date' => $checkInFormatted,
        'duration_name' => $durationName,
        'duration_type' => $durationType,
        // Initialize file upload reference fields
        'passport_file_url' => null,
        'visa_file_url' => null,
        'utility_bill_file_url' => null,
        'guarantor_id_file_url' => null,
        'bank_statement_file_url' => null,
        'proof_of_income_file_url' => null
    ];

    // Remove null values
    $studentData = array_filter($studentData, function($value) {
        return $value !== null;
    });

    $logEntry .= "Student data to insert: " . json_encode($studentData) . "\n";

    // Insert student into Supabase
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/students');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($studentData));
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

    $logEntry .= "Student insert - HTTP Code: $httpCode, Response: $response, cURL Error: $curlError\n";

    if ($curlError) {
        $logEntry .= "ERROR: cURL error during student insertion: $curlError\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        throw new Exception('cURL error: ' . $curlError);
    }

    if ($httpCode !== 201) {
        $logEntry .= "ERROR: Supabase error during student insertion (HTTP $httpCode): $response\n";
        file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
        throw new Exception('Supabase error: ' . $response);
    }

    $studentResult = json_decode($response, true);
    $student = $studentResult[0];
    $studentId = $student['id'];

    $logEntry .= "SUCCESS: Student created with ID: $studentId\n";

    // Create reservation record for the student booking (exactly like AddStudentBooking)
    $reservation = null;
    if ($studioId && $checkInFormatted && $checkOutFormatted) {
        try {
            $reservationData = [
                'reservation_number' => 'STU-' . time(),
                'type' => 'student',
                'student_id' => $studentId,
                'studio_id' => $studioId,
                'duration_id' => $durationType,
                'check_in_date' => $checkInFormatted,
                'check_out_date' => $checkOutFormatted,
                'status' => 'confirmed',
                'total_amount' => $totalRevenueFloat,
                'deposit_amount' => 99,
                'balance_due' => $totalRevenueFloat - 99,
                'notes' => "Student booking for $firstName $lastName",
                'created_by' => '423b2f89-ed35-4537-866e-d4fe702e577c', // Admin user ID
                'academic_year' => $academicYear
            ];

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/reservations');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($reservationData));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'apikey: ' . $SUPABASE_SERVICE_ROLE_KEY,
                'Authorization: Bearer ' . $SUPABASE_SERVICE_ROLE_KEY,
                'Prefer: return=representation'
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 201) {
                $reservationResult = json_decode($response, true);
                $reservation = $reservationResult[0];
                $logEntry .= "SUCCESS: Reservation created with ID: " . $reservation['id'] . "\n";
            } else {
                $logEntry .= "WARNING: Reservation creation failed (HTTP $httpCode): $response\n";
            }
        } catch (Exception $e) {
            $logEntry .= "WARNING: Error creating reservation: " . $e->getMessage() . "\n";
        }
    }

    // Update studio status to occupied (exactly like AddStudentBooking)
    if ($studioId) {
        try {
            $studioUpdateData = [
                'status' => 'occupied',
                'updated_at' => date('Y-m-d H:i:s')
            ];

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $SUPABASE_URL . '/rest/v1/studios?id=eq.' . $studioId);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'PATCH');
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($studioUpdateData));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'apikey: ' . $SUPABASE_SERVICE_ROLE_KEY,
                'Authorization: Bearer ' . $SUPABASE_SERVICE_ROLE_KEY
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200 || $httpCode === 204) {
                $logEntry .= "SUCCESS: Studio status updated to occupied\n";
            } else {
                $logEntry .= "WARNING: Studio status update failed (HTTP $httpCode): $response\n";
            }
        } catch (Exception $e) {
            $logEntry .= "WARNING: Error updating studio status: " . $e->getMessage() . "\n";
        }
    }

    // Create invoices and installments using the create-student-invoices edge function
    // This replicates the exact same invoice creation logic as AddStudentBooking
    if ($totalRevenueFloat > 0) {
        try {
            $invoiceData = [
                'studentId' => $studentId,
                'totalAmount' => $totalRevenueFloat,
                'depositAmount' => 99, // Default deposit amount
                'installmentPlanId' => !empty($installmentPlanId) ? $installmentPlanId : null,
                'createdBy' => '423b2f89-ed35-4537-866e-d4fe702e577c',
                'depositPaid' => $depositPaidBool
            ];

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $SUPABASE_URL . '/functions/v1/create-student-invoices');
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_POST, true);
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($invoiceData));
            curl_setopt($ch, CURLOPT_HTTPHEADER, [
                'Content-Type: application/json',
                'Authorization: Bearer ' . $SUPABASE_SERVICE_ROLE_KEY,
                'apikey: ' . $SUPABASE_SERVICE_ROLE_KEY
            ]);

            $response = curl_exec($ch);
            $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            if ($httpCode === 200) {
                $invoiceResult = json_decode($response, true);
                $logEntry .= "SUCCESS: Invoices created - Deposit: " . ($invoiceResult['depositInvoice']['id'] ?? 'N/A') . 
                           ", Main: " . ($invoiceResult['mainInvoice']['id'] ?? 'N/A') . 
                           ", Installments: " . count($invoiceResult['installmentInvoices'] ?? []) . "\n";
            } else {
                $logEntry .= "WARNING: Invoice creation failed (HTTP $httpCode): $response\n";
            }
        } catch (Exception $e) {
            $logEntry .= "WARNING: Error creating invoices: " . $e->getMessage() . "\n";
        }
    }

    $logEntry .= "SUCCESS: Student booking webhook completed successfully\n";
    $logEntry .= "==========================================\n\n";
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);

    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Student booking created successfully',
        'studentId' => $studentId,
        'reservationId' => $reservation ? $reservation['id'] : null,
        'data' => [
            'student' => $student,
            'reservation' => $reservation
        ]
    ]);

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

