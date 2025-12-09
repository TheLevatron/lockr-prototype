<?php
/**
 * Manage Lockers API
 * Handles CRUD operations for lockers
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

$action = filter_input(INPUT_POST, 'action', FILTER_SANITIZE_STRING);

try {
    switch ($action) {
        case 'add':
            $locker_number = filter_input(INPUT_POST, 'locker_number', FILTER_SANITIZE_STRING);
            $floor_number = filter_input(INPUT_POST, 'floor_number', FILTER_VALIDATE_INT);
            $grid_x = filter_input(INPUT_POST, 'grid_position_x', FILTER_VALIDATE_INT);
            $grid_y = filter_input(INPUT_POST, 'grid_position_y', FILTER_VALIDATE_INT);
            $status = filter_input(INPUT_POST, 'status', FILTER_SANITIZE_STRING);
            
            if (!$locker_number || !$floor_number || $grid_x === false || $grid_y === false) {
                echo json_encode(['error' => 'Missing required fields']);
                exit();
            }
            
            if (!in_array($floor_number, [6, 7, 9, 10])) {
                echo json_encode(['error' => 'Invalid floor number']);
                exit();
            }
            
            if (!in_array($status, ['available', 'occupied', 'disabled'])) {
                $status = 'available';
            }
            
            $stmt = $pdo->prepare("INSERT INTO lockers (locker_number, floor_number, grid_position_x, grid_position_y, status) VALUES (?, ?, ?, ?, ?)");
            $stmt->execute([$locker_number, $floor_number, $grid_x, $grid_y, $status]);
            
            echo json_encode(['success' => true, 'message' => 'Locker added successfully']);
            break;
            
        case 'update':
            $locker_id = filter_input(INPUT_POST, 'locker_id', FILTER_VALIDATE_INT);
            $locker_number = filter_input(INPUT_POST, 'locker_number', FILTER_SANITIZE_STRING);
            $floor_number = filter_input(INPUT_POST, 'floor_number', FILTER_VALIDATE_INT);
            $grid_x = filter_input(INPUT_POST, 'grid_position_x', FILTER_VALIDATE_INT);
            $grid_y = filter_input(INPUT_POST, 'grid_position_y', FILTER_VALIDATE_INT);
            $status = filter_input(INPUT_POST, 'status', FILTER_SANITIZE_STRING);
            
            if (!$locker_id || !$locker_number || !$floor_number || $grid_x === false || $grid_y === false) {
                echo json_encode(['error' => 'Missing required fields']);
                exit();
            }
            
            if (!in_array($floor_number, [6, 7, 9, 10])) {
                echo json_encode(['error' => 'Invalid floor number']);
                exit();
            }
            
            if (!in_array($status, ['available', 'occupied', 'disabled'])) {
                $status = 'available';
            }
            
            $stmt = $pdo->prepare("UPDATE lockers SET locker_number = ?, floor_number = ?, grid_position_x = ?, grid_position_y = ?, status = ? WHERE locker_id = ?");
            $stmt->execute([$locker_number, $floor_number, $grid_x, $grid_y, $status, $locker_id]);
            
            echo json_encode(['success' => true, 'message' => 'Locker updated successfully']);
            break;
            
        case 'delete':
            $locker_id = filter_input(INPUT_POST, 'locker_id', FILTER_VALIDATE_INT);
            
            if (!$locker_id) {
                echo json_encode(['error' => 'Missing locker ID']);
                exit();
            }
            
            // Check if locker is occupied
            $stmt = $pdo->prepare("SELECT status FROM lockers WHERE locker_id = ?");
            $stmt->execute([$locker_id]);
            $locker = $stmt->fetch();
            
            if ($locker['status'] === 'occupied') {
                echo json_encode(['error' => 'Cannot delete occupied locker']);
                exit();
            }
            
            $stmt = $pdo->prepare("DELETE FROM lockers WHERE locker_id = ?");
            $stmt->execute([$locker_id]);
            
            echo json_encode(['success' => true, 'message' => 'Locker deleted successfully']);
            break;
            
        default:
            echo json_encode(['error' => 'Invalid action']);
            exit();
    }
} catch (PDOException $e) {
    error_log("Manage lockers error: " . $e->getMessage());
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
