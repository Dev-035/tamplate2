<?php
// Set response headers for JSON API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Database configuration
$db_host = 'localhost';
$db_name = 'template';
$db_user = 'root';
$db_pass = '';

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'success' => false,
        'error' => 'Only POST method is allowed'
    ]);
    exit;
}

// Get JSON input
$input = json_decode(file_get_contents('php://input'), true);

// Validate input data
if (!isset($input['name']) || !isset($input['link'])) {
    echo json_encode([
        'success' => false,
        'error' => 'Template name and link are required'
    ]);
    exit;
}

$template_name = trim($input['name']);
$template_link = trim($input['link']);

// Basic validation
if (empty($template_name) || empty($template_link)) {
    echo json_encode([
        'success' => false,
        'error' => 'Template name and link cannot be empty'
    ]);
    exit;
}

// Validate URL format
if (!filter_var($template_link, FILTER_VALIDATE_URL)) {
    echo json_encode([
        'success' => false,
        'error' => 'Please enter a valid URL'
    ]);
    exit;
}

try {
    // Connect to database
    $connection = new PDO(
        "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4",
        $db_user,
        $db_pass
    );
    
    // Set error mode to exceptions
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Check if template with same name already exists
    $check_query = "SELECT COUNT(*) FROM templates WHERE name = :name";
    $check_stmt = $connection->prepare($check_query);
    $check_stmt->bindParam(':name', $template_name);
    $check_stmt->execute();
    
    if ($check_stmt->fetchColumn() > 0) {
        echo json_encode([
            'success' => false,
            'error' => 'A template with this name already exists'
        ]);
        exit;
    }
    
    // Insert new template
    $insert_query = "INSERT INTO templates (name, link) VALUES (:name, :link)";
    $insert_stmt = $connection->prepare($insert_query);
    $insert_stmt->bindParam(':name', $template_name);
    $insert_stmt->bindParam(':link', $template_link);
    
    if ($insert_stmt->execute()) {
        echo json_encode([
            'success' => true,
            'message' => 'Template added successfully',
            'template_id' => $connection->lastInsertId()
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'error' => 'Failed to add template to database'
        ]);
    }
    
} catch (PDOException $error) {
    echo json_encode([
        'success' => false,
        'error' => 'Database error: ' . $error->getMessage()
    ]);
}
?>