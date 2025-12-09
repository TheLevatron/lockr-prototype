#!/bin/bash

# LockR Setup Script
# Automates database setup process

echo "================================"
echo "LockR Database Setup Script"
echo "================================"
echo ""

# Check if MySQL is accessible
command -v mysql >/dev/null 2>&1 || { echo "MySQL is not installed or not in PATH. Aborting."; exit 1; }

# Prompt for MySQL credentials
echo "Please enter your MySQL root password:"
read -s MYSQL_PASSWORD

# Database name
DB_NAME="lockr_db"

echo ""
echo "Creating database: $DB_NAME"

# Create database
mysql -u root -p"$MYSQL_PASSWORD" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Database created successfully"
else
    echo "✗ Failed to create database. Please check your password and try again."
    exit 1
fi

# Import schema
echo "Importing database schema..."
mysql -u root -p"$MYSQL_PASSWORD" $DB_NAME < database/schema.sql 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Schema imported successfully"
else
    echo "✗ Failed to import schema"
    exit 1
fi

# Import sample data
echo "Importing sample data..."
mysql -u root -p"$MYSQL_PASSWORD" $DB_NAME < database/sample_data.sql 2>/dev/null

if [ $? -eq 0 ]; then
    echo "✓ Sample data imported successfully"
else
    echo "✗ Failed to import sample data"
    exit 1
fi

echo ""
echo "================================"
echo "Setup completed successfully!"
echo "================================"
echo ""
echo "Test Credentials:"
echo "Admin: admin1@iacademy.edu.ph / password123"
echo "Student: student1@iacademy.edu.ph / password123"
echo ""
echo "Access the application at: http://localhost/lockr-prototype"
