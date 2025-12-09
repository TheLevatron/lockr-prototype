<?php
/**
 * Database Connection Configuration
 * LockR Digital Platform - PROTOTYPE MODE
 * 
 * This prototype version uses JSON file storage instead of MySQL
 * for easier development without requiring XAMPP/database setup.
 * 
 * Toggle between JSON (prototype) and MySQL (production) modes using USE_JSON_STORAGE
 */

// Toggle between JSON (prototype) and MySQL (production)
define('USE_JSON_STORAGE', true);

if (USE_JSON_STORAGE) {
    // ===== JSON STORAGE MODE (Prototype) =====
    require_once __DIR__ . '/json_db.php';
    
    // Initialize JSON database handler
    $jsonDB = new JsonDB(__DIR__ . '/../data/');
    
} else {
    // ===== MYSQL MODE (Production) =====
    // Database configuration
    define('DB_HOST', 'localhost');
    define('DB_NAME', 'lockr_db');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_CHARSET', 'utf8mb4');

    try {
        // Create PDO instance with error handling
        $dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;
        
        $options = [
            PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES   => false,
        ];
        
        $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
        
    } catch (PDOException $e) {
        // Log error and show user-friendly message
        error_log("Database Connection Error: " . $e->getMessage());
        die("Database connection failed. Please contact the administrator.");
    }
}
