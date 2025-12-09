<?php
/**
 * Reserve Locker API
 * Handles locker reservation with file upload
 */

session_start();
header('Content-Type: application/json');
require_once '../config/db_connect.php';

// Check if user is logged in
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'student') {
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit();
}

$locker_id = filter_input(INPUT_POST, 'locker_id', FILTER_VALIDATE_INT);
$referral_number = filter_input(INPUT_POST, 'referral_number', FILTER_SANITIZE_STRING);
$user_id = $_SESSION['user_id'];

if (!$locker_id || !$referral_number) {
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

try {
    // Check if locker is available
    $stmt = $pdo->prepare("SELECT status FROM lockers WHERE locker_id = ?");
    $stmt->execute([$locker_id]);
    $locker = $stmt->fetch();
    
    if (!$locker || $locker['status'] !== 'available') {
        echo json_encode(['error' => 'Locker is not available']);
        exit();
    }
    
    // Check if user already has an active reservation
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM reservations WHERE user_id = ? AND status IN ('pending', 'approved', 'active')");
    $stmt->execute([$user_id]);
    if ($stmt->fetchColumn() > 0) {
        echo json_encode(['error' => 'You already have an active reservation']);
        exit();
    }
    
    // Handle file upload
    $referral_slip_path = null;
    if (isset($_FILES['referral_slip']) && $_FILES['referral_slip']['error'] === UPLOAD_ERR_OK) {
        $allowed_types = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];
        $max_size = 5 * 1024 * 1024; // 5MB
        
        $file_type = $_FILES['referral_slip']['type'];
        $file_size = $_FILES['referral_slip']['size'];
        
        if (!in_array($file_type, $allowed_types)) {
            echo json_encode(['error' => 'Invalid file type. Only images are allowed.']);
            exit();
        }
        
        if ($file_size > $max_size) {
            echo json_encode(['error' => 'File size exceeds 5MB limit.']);
            exit();
        }
        
        // Generate unique filename
        $extension = pathinfo($_FILES['referral_slip']['name'], PATHINFO_EXTENSION);
        $filename = 'referral_' . $user_id . '_' . time() . '.' . $extension;
        $upload_path = '../uploads/referral_slips/' . $filename;
        
        if (move_uploaded_file($_FILES['referral_slip']['tmp_name'], $upload_path)) {
            $referral_slip_path = 'uploads/referral_slips/' . $filename;
        } else {
            echo json_encode(['error' => 'Failed to upload file']);
            exit();
        }
    }
    
    // Get active academic year
    $stmt = $pdo->prepare("SELECT year_id FROM academic_years WHERE is_active = 1 LIMIT 1");
    $stmt->execute();
    $academic_year = $stmt->fetch();
    $academic_year_id = $academic_year ? $academic_year['year_id'] : null;
    
    // Calculate validity date (end of academic year)
    $validity_date = null;
    if ($academic_year_id) {
        $stmt = $pdo->prepare("SELECT end_date FROM academic_years WHERE year_id = ?");
        $stmt->execute([$academic_year_id]);
        $year = $stmt->fetch();
        $validity_date = $year['end_date'];
    }
    
    // Insert reservation
    $stmt = $pdo->prepare("INSERT INTO reservations (user_id, locker_id, referral_slip_path, referral_number, status, validity_date, academic_year_id) VALUES (?, ?, ?, ?, 'pending', ?, ?)");
    $stmt->execute([$user_id, $locker_id, $referral_slip_path, $referral_number, $validity_date, $academic_year_id]);
    
    echo json_encode(['success' => true, 'message' => 'Reservation submitted successfully']);
    
} catch (PDOException $e) {
    error_log("Reserve locker error: " . $e->getMessage());
    echo json_encode(['error' => 'Failed to create reservation']);
}
