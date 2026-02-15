<?php
// Set response headers for JSON API
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Database configuration
$db_host = 'localhost';
$db_name = 'template';
$db_user = 'root';
$db_pass = '';

try {
    // Connect to database
    $connection = new PDO(
        "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4",
        $db_user,
        $db_pass
    );
    
    // Set error mode to exceptions for better error handling
    $connection->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Fetch all templates from database
    $query = "SELECT id, name, link FROM templates ORDER BY id ASC";
    $statement = $connection->query($query);
    $templates = $statement->fetchAll(PDO::FETCH_ASSOC);
    
    // Add screenshot URLs for each template
    foreach ($templates as &$template) {
        // Remove query parameters from URL to get clean base URL
        $clean_url = preg_replace('/\?.*$/', '', $template['link']);
        
        // Generate screenshot URL using WordPress mshots service
        $template['image_url'] = 'https://s0.wp.com/mshots/v1/' . $clean_url . '?w=600';
    }
    
    // Return success response with template data
    echo json_encode([
        'success' => true,
        'data' => $templates
    ]);
    
} catch (PDOException $error) {
    // Return error response if something goes wrong
    echo json_encode([
        'success' => false,
        'error' => $error->getMessage()
    ]);
}
?>