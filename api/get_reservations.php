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
    if (USE_JSON_STORAGE) {
        // JSON Storage Mode - manually join data from multiple files
        $reservations = $jsonDB->findAll('reservations.json', 'status', $status);
        
        // Enrich with user and locker data
        $enriched = [];
        foreach ($reservations as $reservation) {
            $user = $jsonDB->find('users.json', 'user_id', $reservation['user_id']);
            $locker = $jsonDB->find('lockers.json', 'locker_id', $reservation['locker_id']);
            
            $enriched[] = [
                'reservation_id' => $reservation['reservation_id'],
                'referral_number' => $reservation['referral_number'],
                'referral_slip_path' => $reservation['referral_slip_path'],
                'status' => $reservation['status'],
                'created_at' => $reservation['created_at'],
                'user_id' => $user['user_id'] ?? null,
                'student_id' => $user['student_id'] ?? null,
                'first_name' => $user['first_name'] ?? null,
                'last_name' => $user['last_name'] ?? null,
                'locker_id' => $locker['locker_id'] ?? null,
                'locker_number' => $locker['locker_number'] ?? null,
                'floor_number' => $locker['floor_number'] ?? null
            ];
        }
        
        // Sort by created_at descending
        usort($enriched, function($a, $b) {
            return strcmp($b['created_at'], $a['created_at']);
        });
        
        echo json_encode(['success' => true, 'reservations' => $enriched]);
    } else {
        // MySQL Mode
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
    }
} catch (Exception $e) {
    error_log("Get reservations error: " . $e->getMessage());
    echo json_encode(['error' => 'Failed to fetch reservations']);
}
