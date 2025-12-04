# LockR Data Model

This document describes the data model for the LockR locker reservation system, aligned with the thesis document Section 3.3.8 (Entity Relationship Diagram) and Section 3.3.9 (Data Dictionary).

## Entity Relationship Diagram

\`\`\`
┌─────────────────┐         ┌─────────────────┐
│     Location    │         │    FloorPlan    │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │◄────────│ id (PK)         │
│ name            │         │ locationId (FK) │
│ branchId        │         │ floorNumber     │
│ address         │         │ floorName       │
│ description     │         │ createdAt       │
│ createdAt       │         │ updatedAt       │
│ updatedAt       │         └─────────────────┘
└─────────────────┘                 │
        │                           │
        │                           │
        ▼                           ▼
┌─────────────────┐         ┌─────────────────┐
│     Locker      │         │       User      │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ lockerNumber    │         │ email           │
│ locationId (FK) │         │ password        │
│ floorNumber     │         │ firstName       │
│ status          │         │ lastName        │
│ size            │         │ role            │
│ accessible      │         │ courseStrand    │
│ createdAt       │         │ department      │
│ updatedAt       │         │ createdAt       │
└─────────────────┘         │ updatedAt       │
        │                   └─────────────────┘
        │                           │
        │                           │
        │     ┌─────────────────┐   │
        └────►│   Reservation   │◄──┘
              ├─────────────────┤
              │ id (PK)         │
              │ referralSlipNo  │
              │ userId (FK)     │
              │ lockerId (FK)   │
              │ status          │
              │ reservationTime │
              │ agreementDate   │
              │ term            │
              │ agreement       │
              │ duplicate       │
              │ receiptUrl      │
              │ approvedBy (FK) │
              │ createdAt       │
              │ updatedAt       │
              └─────────────────┘

┌─────────────────┐         ┌─────────────────┐
│     Policy      │         │MaintenanceTicket│
├─────────────────┤         ├─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ title           │         │ lockerId (FK)   │
│ content         │         │ description     │
│ isActive        │         │ status          │
│ createdAt       │         │ reportedBy (FK) │
│ updatedAt       │         │ resolvedBy (FK) │
└─────────────────┘         │ createdAt       │
                            │ updatedAt       │
                            └─────────────────┘
\`\`\`

## Entities

### User
Represents students and administrators (OSAS staff).

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| email | string | School email address |
| password | string | Bcrypt-hashed password |
| firstName | string | User's first name |
| lastName | string | User's last name |
| role | enum | 'student' or 'admin' |
| courseStrand | string? | Student's course/strand |
| department | string? | Admin's department (e.g., OSAS) |
| createdAt | Date | Record creation timestamp |
| updatedAt | Date | Last update timestamp |

### Location
Represents a building or campus location with lockers.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| name | string | Location name |
| branchId | string? | Branch identifier |
| address | string? | Physical address |
| description | string? | Additional description |
| createdAt | Date | Record creation timestamp |
| updatedAt | Date | Last update timestamp |

### FloorPlan
Represents a floor within a location.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| locationId | string (FK) | Reference to Location |
| floorNumber | number | Floor number |
| floorName | string | Display name (e.g., "2nd Floor") |
| createdAt | Date | Record creation timestamp |
| updatedAt | Date | Last update timestamp |

### Locker
Represents an individual locker.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| lockerNumber | string | Unique locker identifier |
| locationId | string (FK) | Reference to Location |
| floorNumber | number | Floor where locker is located |
| status | enum | 'available', 'reserved', 'occupied', 'unavailable' |
| size | enum? | 'small', 'medium', 'large' |
| accessible | boolean? | ADA/accessibility flag |
| createdAt | Date | Record creation timestamp |
| updatedAt | Date | Last update timestamp |

### Reservation
Represents a locker reservation request and its status.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| referralSlipNo | string | Unique referral slip number |
| userId | string (FK) | Reference to User (student) |
| lockerId | string (FK) | Reference to Locker |
| status | enum | Reservation workflow status |
| reservationTimeStart | Date | Reservation start date |
| reservationTimeEnd | Date | Reservation end date |
| agreementDateStart | Date? | Agreement effective date |
| agreementDateEnd | Date? | Agreement expiry date |
| term | string? | Academic term |
| agreement | boolean | Policy acceptance flag |
| duplicate | boolean? | Duplicate key provided flag |
| receiptUrl | string? | Payment receipt file path |
| paymentAdviceSlipUrl | string? | Generated payment advice |
| approvedBy | string? (FK) | Reference to User (admin) |
| createdAt | Date | Record creation timestamp |
| updatedAt | Date | Last update timestamp |

### Reservation Status Values
| Status | Description |
|--------|-------------|
| pending | Initial state, awaiting payment |
| for_endorsement | Receipt submitted, awaiting OSAS review |
| for_approval | Endorsed, awaiting final approval |
| approved | Reservation confirmed |
| cancelled | Reservation cancelled |
| expired | Reservation period ended |

### Policy
Represents locker usage rules and regulations.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| title | string | Policy title |
| content | string | Policy text content |
| isActive | boolean | Whether policy is active |
| createdAt | Date | Record creation timestamp |
| updatedAt | Date | Last update timestamp |

### MaintenanceTicket
Represents locker maintenance requests.

| Field | Type | Description |
|-------|------|-------------|
| id | string (UUID) | Primary key |
| lockerId | string (FK) | Reference to Locker |
| description | string | Issue description |
| status | enum | 'open', 'in_progress', 'resolved' |
| reportedBy | string (FK) | Reference to User |
| resolvedBy | string? (FK) | Reference to User (admin) |
| createdAt | Date | Record creation timestamp |
| updatedAt | Date | Last update timestamp |

## Thesis Alignment

This data model is based on the thesis Section 3.3.9 Data Dictionary:

- **Table 3.3.9.1**: Student entity → User (role: student)
- **Table 3.3.9.2**: Login → User authentication fields
- **Table 3.3.9.3**: lockrReservationSystem → Reservation
- **Table 3.3.9.4**: locker → Locker
- **Table 3.3.9.5**: floorPlan → FloorPlan
- **Table 3.3.9.6**: OSAS → User (role: admin)

The status workflow (pending → for_endorsement → for_approval → approved) matches the thesis Activity Diagram (Section 3.3.4) and Sequence Diagrams (Sections 3.3.5-3.3.7).
