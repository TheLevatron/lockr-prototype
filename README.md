# LockR - Digital Platform for School Locker Management

A web-based locker management system for iACADEMY that digitizes the manual locker reservation process.

## Features

### Student Features
- Login with email and password
- View available lockers by floor (6, 7, 9, 10)
- Visual grid display with color-coded status (Available/Occupied/Reserved)
- Reserve available lockers
- Upload payment receipt/referral slip
- Accept rules and regulations
- Track reservation status

### Admin Features
- Manage pending reservations (approve/reject)
- Activate approved reservations
- View uploaded payment receipts
- Add, edit, and delete lockers
- Manage locker status and positions

## Tech Stack
- **Backend:** PHP 7.4+ with PDO
- **Database:** MySQL 5.7+ / MariaDB
- **Frontend:** HTML5, CSS3, JavaScript
- **Server:** Apache (XAMPP/WAMP recommended)

## Installation

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7+ or MariaDB
- Apache web server
- XAMPP/WAMP (recommended for local development)

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/TheLevatron/lockr-prototype.git
   cd lockr-prototype
   ```

2. **Configure Web Server**
   - If using XAMPP, copy the project to `C:\xampp\htdocs\lockr-prototype`
   - If using WAMP, copy to `C:\wamp64\www\lockr-prototype`
   - Or configure Apache DocumentRoot to point to the project directory

3. **Create Database**
   - Open phpMyAdmin (http://localhost/phpmyadmin)
   - Create a new database named `lockr_db`
   - Import the schema:
     ```sql
     source database/schema.sql
     ```
   - Import sample data:
     ```sql
     source database/sample_data.sql
     ```

   **OR** run these commands in MySQL:
   ```bash
   mysql -u root -p
   CREATE DATABASE lockr_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE lockr_db;
   source database/schema.sql;
   source database/sample_data.sql;
   ```

4. **Configure Database Connection**
   - Open `config/db_connect.php`
   - Update the database credentials if needed:
     ```php
     define('DB_HOST', 'localhost');
     define('DB_NAME', 'lockr_db');
     define('DB_USER', 'root');
     define('DB_PASS', ''); // Your MySQL password
     ```

5. **Set Permissions**
   - Ensure the `uploads/referral_slips/` directory is writable:
     ```bash
     chmod 755 uploads/referral_slips
     ```

6. **Access the Application**
   - Open your browser and navigate to: `http://localhost/lockr-prototype`
   - Or if using a virtual host: `http://lockr.local`

## Test Credentials

### Admin Account
- Email: `admin1@iacademy.edu.ph`
- Password: `password123`

### Student Accounts
- Email: `student1@iacademy.edu.ph` to `student5@iacademy.edu.ph`
- Password: `password123`

## Project Structure

```
/lockr-prototype
├── index.php                    # Root redirect
├── login.php                    # Login page
├── student_home.php             # Floor selection (student)
├── locker_grid.php              # Locker grid display
├── admin_dashboard.php          # Admin reservation management
├── admin_manage_lockers.php     # Admin locker CRUD
├── /config
│   └── db_connect.php          # Database configuration
├── /database
│   ├── schema.sql              # Database schema
│   └── sample_data.sql         # Test data
├── /auth
│   ├── login_handler.php       # Process login
│   ├── logout.php              # Logout handler
│   └── session_check.php       # Session validation
├── /api
│   ├── reserve_locker.php      # Reserve locker endpoint
│   ├── get_lockers.php         # Fetch lockers by floor
│   ├── get_reservations.php    # Fetch reservations
│   ├── manage_lockers.php      # Locker CRUD operations
│   └── update_reservation_status.php  # Update reservation
├── /includes
│   ├── header.php              # Common header
│   └── footer.php              # Common footer
├── /assets
│   ├── /css
│   │   └── style.css          # Main stylesheet
│   └── /js
│       └── main.js            # JavaScript functions
└── /uploads
    └── /referral_slips        # Uploaded receipts
        └── .htaccess          # Security rules
```

## Usage Guide

### For Students

1. **Login**
   - Navigate to the login page
   - Enter your email and password
   - Click "Login"

2. **Select Floor**
   - Choose a floor (6, 7, 9, or 10)

3. **View Locker Grid**
   - Green = Available
   - Red = Occupied/Disabled
   - Yellow = Reserved (pending approval)

4. **Reserve a Locker**
   - Click an available (green) locker
   - Confirm reservation
   - Read and accept rules and regulations
   - Enter referral number
   - Upload payment receipt image
   - Submit reservation

5. **Wait for Approval**
   - Admin will review and approve/reject
   - Once approved, admin will activate the locker

### For Administrators

1. **Login**
   - Use admin credentials to login

2. **Manage Reservations**
   - View "For Endorsement" tab for pending reservations
   - Click "View Receipt" to see uploaded payment slip
   - Click "Approve" to approve or "Reject" to reject
   - Switch to "For Approval" tab for approved reservations
   - Click "Activate" to finalize and mark locker as occupied

3. **Manage Lockers**
   - Click "Manage Lockers" button
   - Select a floor from dropdown
   - Click "Add New Locker" to create a locker
   - Click on a locker card to edit details
   - Click "Delete" to remove a locker (only if not occupied)

## Color Scheme

- **Primary Red:** #800000 (maroon)
- **Dark Grey:** #333333
- **White:** #ffffff
- **Success Green:** #28a745
- **Warning Yellow:** #ffc107
- **Danger Red:** #dc3545

## Security Features

- Password hashing using PHP's `password_hash()`
- Prepared statements for all database queries (SQL injection prevention)
- Session management with periodic regeneration
- File upload validation (type and size)
- Input sanitization and validation
- CSRF protection ready
- .htaccess protection for uploads directory

## Database Schema

### Tables
1. **users** - Student and admin accounts
2. **lockers** - Locker information and status
3. **reservations** - Reservation records with status tracking
4. **academic_years** - Academic year management

See `database/schema.sql` for complete schema definition.

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge
- Mobile responsive

## Troubleshooting

### Database Connection Error
- Check if MySQL is running
- Verify database credentials in `config/db_connect.php`
- Ensure `lockr_db` database exists

### File Upload Not Working
- Check `uploads/referral_slips/` directory exists
- Verify directory has write permissions (755 or 777)
- Check PHP `upload_max_filesize` and `post_max_size` in php.ini

### Session Issues
- Ensure `session.save_path` is writable
- Check PHP error logs for session warnings

### Page Not Found (404)
- Verify Apache mod_rewrite is enabled (if using URL rewriting)
- Check DocumentRoot configuration
- Ensure all files are in the correct directory

## Future Enhancements

- Google OAuth integration
- Email notifications
- QR code generation for locker access
- Mobile app
- Report generation
- Academic year automatic switching
- Locker usage analytics

## License

This project is developed for iACADEMY as part of a thesis project.

## Support

For issues or questions, please contact the development team or create an issue in the repository.
