-- LockR Database Schema
-- Database: lockr_db
-- Created for LockR Digital Platform for School Locker Management

-- Drop existing tables if they exist (for clean reinstall)
DROP TABLE IF EXISTS reservations;
DROP TABLE IF EXISTS lockers;
DROP TABLE IF EXISTS academic_years;
DROP TABLE IF EXISTS users;

-- Users table - stores student and admin accounts
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    role ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_student_id (student_id),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Academic years table - manages school year cycles
CREATE TABLE academic_years (
    year_id INT AUTO_INCREMENT PRIMARY KEY,
    year_name VARCHAR(20) NOT NULL UNIQUE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Lockers table - stores all locker information
CREATE TABLE lockers (
    locker_id INT AUTO_INCREMENT PRIMARY KEY,
    locker_number VARCHAR(20) UNIQUE NOT NULL,
    floor_number INT NOT NULL,
    grid_position_x INT NOT NULL,
    grid_position_y INT NOT NULL,
    status ENUM('available', 'occupied', 'disabled') NOT NULL DEFAULT 'available',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_floor (floor_number),
    INDEX idx_status (status),
    INDEX idx_floor_status (floor_number, status),
    CONSTRAINT chk_floor CHECK (floor_number IN (6, 7, 9, 10))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Reservations table - manages locker reservations and their status
CREATE TABLE reservations (
    reservation_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    locker_id INT NOT NULL,
    referral_slip_path VARCHAR(255),
    referral_number VARCHAR(100),
    status ENUM('pending', 'approved', 'active', 'rejected') NOT NULL DEFAULT 'pending',
    validity_date DATE,
    academic_year_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    FOREIGN KEY (locker_id) REFERENCES lockers(locker_id) ON DELETE CASCADE,
    FOREIGN KEY (academic_year_id) REFERENCES academic_years(year_id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_locker (locker_id),
    INDEX idx_status (status),
    INDEX idx_academic_year (academic_year_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
