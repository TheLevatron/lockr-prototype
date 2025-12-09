# Project Context: LockR (Locker Management System)

## Project Overview
LockR is a locally hosted web application designed to digitize the manual locker reservation process for schools (specifically iACADEMY). [cite_start]It replaces paper-based grids with a centralized system for real-time booking and management[cite: 1047, 1049].

## Tech Stack
- [cite_start]**Backend:** PHP (Native or Framework like Laravel/CodeIgniter - assume Native for local hosting simplicity unless specified otherwise), MySQL[cite: 1311].
- [cite_start]**Frontend:** HTML5, CSS3, JavaScript[cite: 1311].
- [cite_start]**Development Env:** Visual Studio Code, XAMPP/WAMP (Windows 11)[cite: 1422].

## User Roles
1. [cite_start]**Student:** View floors, check locker status (Available, Reserved, Occupied), reserve lockers, upload payment receipts, receive verification [cite: 1396-1399].
2. [cite_start]**Administrator:** Manage academic years, approve/reject reservations, add/delete/update lockers, view dashboards [cite: 1391-1395].

## Database Schema Requirements
- **Users:** Store student/admin details (ID, email, password, role).
- [cite_start]**Lockers:** ID, floor number, status (Available, Reserved, Occupied, Unavailable), branchID[cite: 1481].
- **Reservations:** Links User to Locker, includes `referral_slip` (image path), `payment_status`, `validity_date`.
- **AcademicYears:** Start date, End date, Status (Active/Inactive).

## UI/UX Flow (Based on Mockups)
- [cite_start]**Student:** Login (Google/Email) -> Home (Floor Selection) -> Locker Grid -> Reservation Modal -> Rules Acceptance -> Receipt Upload -> Verified Screen [cite: 1916-1919].
- [cite_start]**Admin:** Splash -> Login -> New Academic Year Setup -> Main Dashboard (Tabs: For Endorsement, For Approval) -> Locker Management (Add/Update/Delete) [cite: 1919-1920].