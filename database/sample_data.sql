-- LockR Sample Data
-- Test data for development and testing

-- Insert sample admin users
-- Password for all users: password123 (hashed with PASSWORD_DEFAULT in PHP)
-- Note: These are bcrypt hashes of 'password123'
INSERT INTO users (student_id, email, password_hash, first_name, last_name, role) VALUES
('ADMIN001', 'admin1@iacademy.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'John', 'Administrator', 'admin'),
('ADMIN002', 'admin2@iacademy.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Maria', 'Santos', 'admin');

-- Insert sample student users
INSERT INTO users (student_id, email, password_hash, first_name, last_name, role) VALUES
('2021-0001', 'student1@iacademy.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Juan', 'Dela Cruz', 'student'),
('2021-0002', 'student2@iacademy.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Anna', 'Garcia', 'student'),
('2021-0003', 'student3@iacademy.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Carlos', 'Reyes', 'student'),
('2021-0004', 'student4@iacademy.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Sofia', 'Mendoza', 'student'),
('2021-0005', 'student5@iacademy.edu.ph', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Miguel', 'Torres', 'student');

-- Insert academic year
INSERT INTO academic_years (year_name, start_date, end_date, is_active) VALUES
('2025-2026', '2025-08-01', '2026-07-31', TRUE);

-- Insert lockers for Floor 6 (20 lockers in 4x5 grid)
INSERT INTO lockers (locker_number, floor_number, grid_position_x, grid_position_y, status) VALUES
('6-001', 6, 1, 1, 'available'),
('6-002', 6, 2, 1, 'available'),
('6-003', 6, 3, 1, 'available'),
('6-004', 6, 4, 1, 'available'),
('6-005', 6, 1, 2, 'available'),
('6-006', 6, 2, 2, 'available'),
('6-007', 6, 3, 2, 'available'),
('6-008', 6, 4, 2, 'available'),
('6-009', 6, 1, 3, 'available'),
('6-010', 6, 2, 3, 'available'),
('6-011', 6, 3, 3, 'available'),
('6-012', 6, 4, 3, 'available'),
('6-013', 6, 1, 4, 'available'),
('6-014', 6, 2, 4, 'available'),
('6-015', 6, 3, 4, 'available'),
('6-016', 6, 4, 4, 'available'),
('6-017', 6, 1, 5, 'available'),
('6-018', 6, 2, 5, 'available'),
('6-019', 6, 3, 5, 'available'),
('6-020', 6, 4, 5, 'available');

-- Insert lockers for Floor 7 (20 lockers in 4x5 grid)
INSERT INTO lockers (locker_number, floor_number, grid_position_x, grid_position_y, status) VALUES
('7-001', 7, 1, 1, 'available'),
('7-002', 7, 2, 1, 'available'),
('7-003', 7, 3, 1, 'available'),
('7-004', 7, 4, 1, 'available'),
('7-005', 7, 1, 2, 'available'),
('7-006', 7, 2, 2, 'available'),
('7-007', 7, 3, 2, 'available'),
('7-008', 7, 4, 2, 'available'),
('7-009', 7, 1, 3, 'available'),
('7-010', 7, 2, 3, 'available'),
('7-011', 7, 3, 3, 'available'),
('7-012', 7, 4, 3, 'available'),
('7-013', 7, 1, 4, 'available'),
('7-014', 7, 2, 4, 'available'),
('7-015', 7, 3, 4, 'available'),
('7-016', 7, 4, 4, 'available'),
('7-017', 7, 1, 5, 'available'),
('7-018', 7, 2, 5, 'available'),
('7-019', 7, 3, 5, 'available'),
('7-020', 7, 4, 5, 'available');

-- Insert lockers for Floor 9 (20 lockers in 4x5 grid)
INSERT INTO lockers (locker_number, floor_number, grid_position_x, grid_position_y, status) VALUES
('9-001', 9, 1, 1, 'available'),
('9-002', 9, 2, 1, 'available'),
('9-003', 9, 3, 1, 'available'),
('9-004', 9, 4, 1, 'available'),
('9-005', 9, 1, 2, 'available'),
('9-006', 9, 2, 2, 'available'),
('9-007', 9, 3, 2, 'available'),
('9-008', 9, 4, 2, 'available'),
('9-009', 9, 1, 3, 'available'),
('9-010', 9, 2, 3, 'available'),
('9-011', 9, 3, 3, 'available'),
('9-012', 9, 4, 3, 'available'),
('9-013', 9, 1, 4, 'available'),
('9-014', 9, 2, 4, 'available'),
('9-015', 9, 3, 4, 'available'),
('9-016', 9, 4, 4, 'available'),
('9-017', 9, 1, 5, 'available'),
('9-018', 9, 2, 5, 'available'),
('9-019', 9, 3, 5, 'available'),
('9-020', 9, 4, 5, 'available');

-- Insert lockers for Floor 10 (20 lockers in 4x5 grid)
INSERT INTO lockers (locker_number, floor_number, grid_position_x, grid_position_y, status) VALUES
('10-001', 10, 1, 1, 'available'),
('10-002', 10, 2, 1, 'available'),
('10-003', 10, 3, 1, 'available'),
('10-004', 10, 4, 1, 'available'),
('10-005', 10, 1, 2, 'available'),
('10-006', 10, 2, 2, 'available'),
('10-007', 10, 3, 2, 'available'),
('10-008', 10, 4, 2, 'available'),
('10-009', 10, 1, 3, 'available'),
('10-010', 10, 2, 3, 'available'),
('10-011', 10, 3, 3, 'available'),
('10-012', 10, 4, 3, 'available'),
('10-013', 10, 1, 4, 'available'),
('10-014', 10, 2, 4, 'available'),
('10-015', 10, 3, 4, 'available'),
('10-016', 10, 4, 4, 'available'),
('10-017', 10, 1, 5, 'available'),
('10-018', 10, 2, 5, 'available'),
('10-019', 10, 3, 5, 'available'),
('10-020', 10, 4, 5, 'available');

-- Insert sample reservations with different statuses
-- Pending reservation
INSERT INTO reservations (user_id, locker_id, referral_number, status, validity_date, academic_year_id) VALUES
(3, 1, 'REF-2025-001', 'pending', '2026-07-31', 1);

-- Approved reservation
INSERT INTO reservations (user_id, locker_id, referral_number, status, validity_date, academic_year_id) VALUES
(4, 21, 'REF-2025-002', 'approved', '2026-07-31', 1);

-- Active reservation (update locker to occupied)
INSERT INTO reservations (user_id, locker_id, referral_number, status, validity_date, academic_year_id) VALUES
(5, 41, 'REF-2025-003', 'active', '2026-07-31', 1);

UPDATE lockers SET status = 'occupied' WHERE locker_id = 41;
