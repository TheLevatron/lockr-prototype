<?php
/**
 * Get Reservations API
 * Returns reservations for admin dashboard
 */

session_start();
header('Content-Type: application/json');
require_once '../config/db_connect.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

$status = filter_input(INPUT_GET, 'status', FILTER_SANITIZE_STRING);

if (!$status || !in_array($status, ['pending', 'approved', 'active', 'rejected'])) {
    echo json_encode(['error' => 'Invalid status']);
    exit();
}

try {
    $stmt = $pdo->prepare("
        SELECT 
            r.reservation_id,
            r.referral_number,
            r.referral_slip_path,
            r.status,
            r.created_at,
            u.user_id,
            u.student_id,
            u.first_name,
            u.last_name,
            l.locker_id,
            l.locker_number,
            l.floor_number
        FROM reservations r
        JOIN users u ON r.user_id = u.user_id
        JOIN lockers l ON r.locker_id = l.locker_id
        WHERE r.status = ?
        ORDER BY r.created_at DESC
    ");
    $stmt->execute([$status]);
    $reservations = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'reservations' => $reservations]);
} catch (PDOException $e) {
    error_log("Get reservations error: " . $e->getMessage());
    echo json_encode(['error' => 'Failed to fetch reservations']);
}
