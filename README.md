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
- **Backend:** PHP 7.4+
- **Storage:** JSON files (Prototype) / MySQL (Production)
- **Frontend:** HTML5, CSS3, JavaScript
- **Server:** PHP Built-in Server (Prototype) / Apache (Production)

## 🚀 Quick Start (No Installation Required!)

### Prototype Mode - No Database, No XAMPP!

Perfect for quick testing, development, and demonstrations.

#### Requirements:
- PHP 7.4+ installed on your system
- That's it! No MySQL, no Apache, no XAMPP needed.

#### Steps:

1. **Download/Clone the Repository**
   ```bash
   git clone https://github.com/TheLevatron/lockr-prototype.git
   cd lockr-prototype
   ```

2. **Start the Server**
   
   **Windows:**
   - Double-click `START_SERVER.bat`
   
   **Mac/Linux:**
   ```bash
   chmod +x start_server.sh
   ./start_server.sh
   ```
   
   **Or manually:**
   ```bash
   php -S localhost:8000
   ```

3. **Access the Application**
   - Open your browser to: **http://localhost:8000**
   - Login with test credentials below

4. **Done!** ✨

### Test Credentials (Prototype Mode)
- **Admin:** `admin1@iacademy.edu.ph` / `password123`
- **Student:** `student1@iacademy.edu.ph` / `password123`

### About Prototype Mode
- **Data Storage:** All data is stored in JSON files in the `/data` directory
- **Persistence:** Changes persist between server restarts
- **Reset Data:** To reset to defaults, delete the JSON files and restart (they'll be regenerated)
- **Purpose:** This mode is for development, testing, and demonstrations only
- **File Uploads:** File uploads work with PHP's built-in server

---

## 📦 Full Installation (Production Mode)

For production use with MySQL database and Apache, follow these steps:

### Prerequisites
- PHP 7.4 or higher
- MySQL 5.7+ or MariaDB
- Apache web server
- XAMPP/WAMP/MAMP (recommended for local development)

### Quick Setup Guide

#### Step 1: Clone or Download the Repository
```bash
git clone https://github.com/TheLevatron/lockr-prototype.git
```

Or download as ZIP and extract it.

#### Step 2: Move to Web Server Directory

**For XAMPP (Windows):**
- Move the `lockr-prototype` folder to `C:\xampp\htdocs\`

**For XAMPP (Mac/Linux):**
- Move to `/Applications/XAMPP/htdocs/` or `/opt/lampp/htdocs/`

**For WAMP (Windows):**
- Move to `C:\wamp64\www\`

**For MAMP (Mac):**
- Move to `/Applications/MAMP/htdocs/`

#### Step 3: Start Your Web Server
- Open XAMPP/WAMP/MAMP Control Panel
- Start **Apache** and **MySQL** services

#### Step 4: Create Database Using phpMyAdmin

1. Open your browser and go to: **http://localhost/phpmyadmin**
2. Click on **"New"** in the left sidebar
3. Enter database name: `lockr_db`
4. Select **utf8mb4_unicode_ci** as collation
5. Click **"Create"**

#### Step 5: Import Database Schema

1. Click on the `lockr_db` database you just created
2. Click on the **"Import"** tab at the top
3. Click **"Choose File"**
4. Navigate to your project folder: `lockr-prototype/database/`
5. Select **`schema.sql`**
6. Click **"Go"** at the bottom
7. Wait for success message: "Import has been successfully finished"

#### Step 6: Import Sample Data

1. Stay in the **"Import"** tab
2. Click **"Choose File"** again
3. Select **`sample_data.sql`** from the `database/` folder
4. Click **"Go"**
5. Wait for success message

#### Step 7: Switch to Production Mode

1. Open `config/db_connect.php` in a text editor
2. Change line 13 from:
   ```php
   define('USE_JSON_STORAGE', true);
   ```
   to:
   ```php
   define('USE_JSON_STORAGE', false);
   ```
3. If you have a custom MySQL password, update line 19:
   ```php
   define('DB_PASS', 'your_password_here');
   ```
4. Save the file

#### Step 8: Access the Application

Open your browser and navigate to:
```
http://localhost/lockr-prototype
```

You should see the login page! 🎉

### Test Login Credentials (Production Mode)

#### Admin Account
- **Email:** `admin1@iacademy.edu.ph`
- **Password:** `password123`

#### Student Accounts
- **Email:** `student1@iacademy.edu.ph` (or student2, student3, student4, student5)
- **Password:** `password123`

---

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

### "Database connection failed" error
- ✅ Make sure MySQL is running in XAMPP/WAMP/MAMP Control Panel
- ✅ Verify the database `lockr_db` was created in phpMyAdmin
- ✅ Check if you need to set a password in `config/db_connect.php`

### "Page not found" error
- ✅ Ensure the folder is in the correct htdocs or www directory
- ✅ Check the URL: `http://localhost/lockr-prototype` (not lockr-prototype.com)
- ✅ Make sure Apache is running

### File upload not working
- ✅ Check that `uploads/referral_slips/` folder exists
- ✅ On Mac/Linux, you may need to set permissions:
  ```bash
  chmod -R 755 uploads
  ```

### Can't login
- ✅ Ensure you imported both `schema.sql` AND `sample_data.sql`
- ✅ Use the exact test credentials listed above
- ✅ Try clearing your browser cache

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
