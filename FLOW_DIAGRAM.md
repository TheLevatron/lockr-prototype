# LockR Platform - Application Flow Diagram

## Student User Flow

```
┌─────────────┐
│  Browser    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        LOGIN SCREEN                              │
│  - Email/Password input                                          │
│  - Google Login (placeholder)                                    │
│  - Test credentials shown                                        │
└──────┬──────────────────────────────────────────────────────────┘
       │ (auth/login_handler.php validates)
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    STUDENT HOME (Floor Selection)                │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
│  │ Floor 6  │  │ Floor 7  │  │ Floor 9  │  │ Floor 10 │       │
│  └────┬─────┘  └──────────┘  └──────────┘  └──────────┘       │
└───────┼─────────────────────────────────────────────────────────┘
        │
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                      LOCKER GRID DISPLAY                         │
│  Legend: [Green=Available] [Red=Occupied] [Yellow=Reserved]     │
│                                                                  │
│  Grid Layout (4x5):                                             │
│  ┌────┬────┬────┬────┐                                         │
│  │ 01 │ 02 │ 03 │ 04 │  <- Click available locker              │
│  ├────┼────┼────┼────┤                                         │
│  │ 05 │ 06 │ 07 │ 08 │                                         │
│  └────┴────┴────┴────┘                                         │
└───────┼─────────────────────────────────────────────────────────┘
        │ (Click green locker)
        ▼
┌─────────────────────────────────────────────────────────────────┐
│              MODAL 1: Reservation Confirmation                   │
│  "Do you want to reserve locker 6-001?"                         │
│  [Cancel] [Confirm]                                             │
└───────┼─────────────────────────────────────────────────────────┘
        │ (Click Confirm)
        ▼
┌─────────────────────────────────────────────────────────────────┐
│              MODAL 2: Rules and Regulations                      │
│  - General Rules (scrollable)                                    │
│  - Prohibited Items                                              │
│  - Maintenance Guidelines                                        │
│  [✓] I agree to rules                                           │
│  [Cancel] [Continue]                                            │
└───────┼─────────────────────────────────────────────────────────┘
        │ (Check agree + Click Continue)
        ▼
┌─────────────────────────────────────────────────────────────────┐
│              MODAL 3: Upload Payment Receipt                     │
│  Referral Number: [_____________]                               │
│  📁 Click to upload receipt/referral slip                       │
│  [Preview of uploaded image]                                     │
│  [Cancel] [Submit Reservation]                                  │
└───────┼─────────────────────────────────────────────────────────┘
        │ (api/reserve_locker.php processes)
        ▼
┌─────────────────────────────────────────────────────────────────┐
│              MODAL 4: Success Confirmation                       │
│            ✓ Reservation Submitted!                             │
│  "Your reservation is pending approval"                          │
│  [Return to Home]                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Admin User Flow

```
┌─────────────┐
│  Browser    │
└──────┬──────┘
       │
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                        LOGIN SCREEN                              │
│  (Same as student, but redirects to admin dashboard)            │
└──────┬──────────────────────────────────────────────────────────┘
       │ (auth/login_handler.php validates admin role)
       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    ADMIN DASHBOARD                               │
│  ┌──────────────────────┬──────────────────────┐               │
│  │  For Endorsement     │   For Approval       │               │
│  │  (Pending)           │   (Approved)         │               │
│  └──────────────────────┴──────────────────────┘               │
│                                                                  │
│  Table View:                                                     │
│  ┌─────┬──────┬─────┬──────┬───────┬──────────┐               │
│  │Lock │Ref # │Stud │Name  │Floor  │Actions   │               │
│  ├─────┼──────┼─────┼──────┼───────┼──────────┤               │
│  │6-001│R-001 │2021-│Juan  │6      │[View]    │               │
│  │     │      │0001 │Cruz  │       │[Approve] │               │
│  │     │      │     │      │       │[Reject]  │               │
│  └─────┴──────┴─────┴──────┴───────┴──────────┘               │
│                                                                  │
│  [Manage Lockers] button                                        │
└───────┼─────────────────────────────────────────────────────────┘
        │
        ├─(View Receipt)──────────────────────────────────┐
        │                                                   │
        ▼                                                   ▼
┌──────────────────┐                            ┌─────────────────┐
│  Receipt Modal   │                            │ Approve Action  │
│  Shows uploaded  │                            │ - Updates DB    │
│  image           │                            │ - Status→       │
│  [Close]         │                            │   approved      │
└──────────────────┘                            └─────────────────┘
        │
        └─(Click Manage Lockers)
        ▼
┌─────────────────────────────────────────────────────────────────┐
│                  LOCKER MANAGEMENT                               │
│  Select Floor: [▼ Floor 6]  [+ Add New Locker]                 │
│                                                                  │
│  Locker Grid:                                                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │ 6-001    │  │ 6-002    │  │ 6-003    │  <- Click to edit   │
│  │ Floor: 6 │  │ Floor: 6 │  │ Floor: 6 │                     │
│  │ Pos:(1,1)│  │ Pos:(2,1)│  │ Pos:(3,1)│                     │
│  │[Available]  │[Occupied]│  │[Available]│                     │
│  │ [Delete] │  │ [Delete] │  │ [Delete] │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
└───────┼─────────────────────────────────────────────────────────┘
        │
        ├─(Add New)────────────┐        ├─(Click locker)────────┐
        │                       │        │                        │
        ▼                       ▼        ▼                        ▼
┌──────────────┐      ┌────────────────────────┐      ┌──────────────┐
│ Add Modal    │      │ Form Fields:           │      │ Edit Modal   │
│ - Number     │      │ - Locker Number        │      │ - Update     │
│ - Floor      │      │ - Floor (6/7/9/10)     │      │   details    │
│ - Grid X/Y   │      │ - Grid X               │      │ - Change     │
│ - Status     │      │ - Grid Y               │      │   status     │
│ [Save]       │      │ - Status               │      │ [Save]       │
└──────────────┘      │ [Cancel] [Save]        │      └──────────────┘
                      └────────────────────────┘
```

## API Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend (Browser)                           │
│  - HTML/CSS/JavaScript                                           │
│  - AJAX requests                                                 │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                     API Endpoints                                │
│                                                                  │
│  /api/get_lockers.php        ← Fetch lockers by floor          │
│  /api/reserve_locker.php     ← Create reservation + upload     │
│  /api/get_reservations.php   ← Fetch by status                 │
│  /api/update_reservation_status.php ← Approve/Activate/Reject  │
│  /api/manage_lockers.php     ← Add/Edit/Delete                 │
│                                                                  │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Database Layer (PDO)                           │
│  /config/db_connect.php                                         │
│  - Prepared statements                                           │
│  - Error handling                                                │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL Database                                │
│                                                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  ┌─────────────┐│
│  │  users   │  │ lockers  │  │ reservations │  │ academic_   ││
│  │          │  │          │  │              │  │ years       ││
│  │ - user_id│  │- locker_│  │- reservation_│  │ - year_id   ││
│  │ - email  │  │  id      │  │  id          │  │ - year_name ││
│  │ - role   │  │- number  │  │- user_id  ◄──┼──┼─┐           ││
│  └──────────┘  │- floor   │  │- locker_id◄──┼──┼─┤           ││
│                │- status  │  │- status      │  │ │           ││
│                └──────────┘  │- referral_   │  │ │           ││
│                              │  slip_path   │  │ │           ││
│                              └──────────────┘  └─┴───────────┘│
└─────────────────────────────────────────────────────────────────┘
```

## Security Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   Security Layers                                │
│                                                                  │
│  1. Input Validation                                             │
│     ↓ filter_input(), FILTER_SANITIZE_*, FILTER_VALIDATE_*     │
│                                                                  │
│  2. Authentication                                               │
│     ↓ password_verify() with bcrypt hashes                      │
│                                                                  │
│  3. Session Security                                             │
│     ↓ session_regenerate_id() every 5 minutes                   │
│                                                                  │
│  4. SQL Injection Prevention                                     │
│     ↓ PDO prepared statements with placeholders                 │
│                                                                  │
│  5. File Upload Validation                                       │
│     ↓ Type check (images only), size limit (5MB)               │
│                                                                  │
│  6. XSS Prevention                                               │
│     ↓ htmlspecialchars() on all output                          │
│                                                                  │
│  7. Error Handling                                               │
│     ↓ Generic messages, detailed logs                           │
│                                                                  │
│  8. File Protection                                              │
│     ↓ .htaccess rules for uploads                               │
└─────────────────────────────────────────────────────────────────┘
```

## Color Coding System

```
┌─────────────────────────────────────────────────────────────────┐
│                    Locker Status Colors                          │
│                                                                  │
│  ┌──────────────┐                                               │
│  │   AVAILABLE  │  ← Green (#28a745)                           │
│  │              │    Student can reserve                        │
│  └──────────────┘                                               │
│                                                                  │
│  ┌──────────────┐                                               │
│  │   OCCUPIED   │  ← Red (#dc3545)                             │
│  │              │    Already in use, cannot reserve             │
│  └──────────────┘                                               │
│                                                                  │
│  ┌──────────────┐                                               │
│  │   RESERVED   │  ← Yellow (#ffc107)                          │
│  │              │    Pending or approved, not yet active        │
│  └──────────────┘                                               │
│                                                                  │
│  ┌──────────────┐                                               │
│  │   DISABLED   │  ← Red (#dc3545)                             │
│  │              │    Out of service, cannot reserve             │
│  └──────────────┘                                               │
└─────────────────────────────────────────────────────────────────┘
```

## Reservation State Machine

```
           ┌─────────┐
           │ Student │
           │ Submits │
           └────┬────┘
                │
                ▼
        ┌───────────────┐
        │   PENDING     │  ← Waiting for admin review
        └───────┬───────┘
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
  ┌──────────┐    ┌──────────┐
  │ APPROVED │    │ REJECTED │  ← Admin rejects
  └────┬─────┘    └──────────┘
       │
       │ Admin activates
       ▼
  ┌──────────┐
  │  ACTIVE  │  ← Locker becomes OCCUPIED
  └──────────┘
```

This diagram shows the complete flow of the LockR platform from login to locker management.
