<?php
/**
 * Get Lockers API
 * Returns locker data for a specific floor
 */

header('Content-Type: application/json');
require_once '../config/db_connect.php';

$floor = filter_input(INPUT_GET, 'floor', FILTER_VALIDATE_INT);

if (!$floor || !in_array($floor, [6, 7, 9, 10])) {
    echo json_encode(['error' => 'Invalid floor number']);
    exit();
}

try {
    $stmt = $pdo->prepare("SELECT locker_id, locker_number, floor_number, grid_position_x, grid_position_y, status FROM lockers WHERE floor_number = ? ORDER BY grid_position_y, grid_position_x");
    $stmt->execute([$floor]);
    $lockers = $stmt->fetchAll();
    
    echo json_encode(['success' => true, 'lockers' => $lockers]);
} catch (PDOException $e) {
    error_log("Get lockers error: " . $e->getMessage());
    echo json_encode(['error' => 'Failed to fetch lockers']);
}
