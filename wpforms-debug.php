<?php
// Debug version to see exactly what WPForms sends
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit();
}

try {
    // Get the raw POST data
    $rawData = file_get_contents('php://input');
    $formData = json_decode($rawData, true);

    // If JSON decode failed, try to get from $_POST
    if (!$formData) {
        $formData = $_POST;
    }

    // Return all the data we received for debugging
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Debug data received',
        'rawData' => $rawData,
        'formData' => $formData,
        'postData' => $_POST,
        'serverData' => [
            'REQUEST_METHOD' => $_SERVER['REQUEST_METHOD'],
            'CONTENT_TYPE' => $_SERVER['CONTENT_TYPE'] ?? 'not set',
            'HTTP_USER_AGENT' => $_SERVER['HTTP_USER_AGENT'] ?? 'not set'
        ]
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Debug error', 'error' => $e->getMessage()]);
}
?>
