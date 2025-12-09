<?php
/**
 * Update Reservation Status API
 * Handles approval, activation, and rejection of reservations
 */

session_start();
header('Content-Type: application/json');
require_once '../config/db_connect.php';

// Check if user is admin
if (!isset($_SESSION['user_id']) || $_SESSION['role'] !== 'admin') {
    echo json_encode(['error' => 'Unauthorized']);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['error' => 'Invalid request method']);
    exit();
}

$reservation_id = filter_input(INPUT_POST, 'reservation_id', FILTER_VALIDATE_INT);
$action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_STRING);

if (!$reservation_id || !$action) {
    echo json_encode(['error' => 'Missing required fields']);
    exit();
}

try {
    if (USE_JSON_STORAGE) {
        // JSON Storage Mode
        
        // Get current reservation details
        $reservation = $jsonDB->find('reservations.json', 'reservation_id', $reservation_id);
        
        if (!$reservation) {
            echo json_encode(['error' => 'Reservation not found']);
            exit();
        }
        
        switch ($action) {
            case 'approve':
                // Update reservation status to approved
                $jsonDB->update('reservations.json', $reservation_id, ['status' => 'approved']);
                $message = 'Reservation approved successfully';
                break;
                
            case 'activate':
                // Update reservation status to active and locker status to occupied
                $jsonDB->update('reservations.json', $reservation_id, ['status' => 'active']);
                $jsonDB->update('lockers.json', $reservation['locker_id'], ['status' => 'occupied']);
                $message = 'Reservation activated successfully';
                break;
                
            case 'reject':
                // Update reservation status to rejected
                $jsonDB->update('reservations.json', $reservation_id, ['status' => 'rejected']);
                $message = 'Reservation rejected';
                break;
                
            default:
                echo json_encode(['error' => 'Invalid action']);
                exit();
        }
        
        echo json_encode(['success' => true, 'message' => $message]);
        
    } else {
        // MySQL Mode
        $pdo->beginTransaction();
        
        // Get current reservation details
        $stmt = $pdo->prepare("SELECT locker_id, status FROM reservations WHERE reservation_id = ?");
        $stmt->execute([$reservation_id]);
        $reservation = $stmt->fetch();
        
        if (!$reservation) {
            echo json_encode(['error' => 'Reservation not found']);
            exit();
        }
        
        switch ($action) {
            case 'approve':
                // Update reservation status to approved
                $stmt = $pdo->prepare("UPDATE reservations SET status = 'approved' WHERE reservation_id = ?");
                $stmt->execute([$reservation_id]);
                $message = 'Reservation approved successfully';
                break;
                
            case 'activate':
                // Update reservation status to active and locker status to occupied
                $stmt = $pdo->prepare("UPDATE reservations SET status = 'active' WHERE reservation_id = ?");
                $stmt->execute([$reservation_id]);
                
                $stmt = $pdo->prepare("UPDATE lockers SET status = 'occupied' WHERE locker_id = ?");
                $stmt->execute([$reservation['locker_id']]);
                $message = 'Reservation activated successfully';
                break;
                
            case 'reject':
                // Update reservation status to rejected
                $stmt = $pdo->prepare("UPDATE reservations SET status = 'rejected' WHERE reservation_id = ?");
                $stmt->execute([$reservation_id]);
                $message = 'Reservation rejected';
                break;
                
            default:
                $pdo->rollBack();
                echo json_encode(['error' => 'Invalid action']);
                exit();
        }
        
        $pdo->commit();
        echo json_encode(['success' => true, 'message' => $message]);
    }
    
} catch (Exception $e) {
    if (!USE_JSON_STORAGE && isset($pdo)) {
        $pdo->rollBack();
    }
    error_log("Update reservation status error: " . $e->getMessage());
    echo json_encode(['error' => 'Failed to update reservation status']);
}
