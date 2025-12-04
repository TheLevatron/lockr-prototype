# LockR - A Digital Platform for Management of School Lockers

A web-based locker reservation application derived from the requirements and domain model presented in the thesis "LockR: A Digital Platform for Management of School Lockers" (iACADEMY).

## Overview

LockR is a centralized web application designed to digitize the locker reservation and management workflow. The system allows students to view locker availability in real-time, reserve slots through an intuitive interface, and automatically generate digital referral slips. Administrators (OSAS staff) can manage lockers, approve reservations, and track locker usage through a user-friendly dashboard.

## Features

### Student Features
- **Registration/Login**: Create an account and securely log in
- **Browse Lockers**: View available lockers by location and floor
- **Reserve Lockers**: Select and reserve available lockers for a term
- **View Reservations**: Track reservation status and referral slip numbers
- **Submit Payment Receipts**: Upload payment confirmation for approval

### Admin Features (OSAS)
- **Manage Locations**: Create and configure building locations
- **Manage Lockers**: Add, edit, and delete lockers
- **Process Reservations**: Endorse and approve student reservations
- **Dashboard**: View all reservations and their statuses

## Tech Stack

- **Frontend**: React + Vite (TypeScript), TailwindCSS
- **Backend**: Node.js + Express (TypeScript)
- **Data Store**: In-memory with pluggable persistence interface
- **State Management**: React Query for data fetching/caching
- **Forms**: React Hook Form

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/TheLevatron/lockr-prototype.git
cd lockr-prototype
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment (optional):
\`\`\`bash
cp server/.env.example server/.env
\`\`\`

### Running the Application

**Development Mode** (runs both client and server):
\`\`\`bash
npm run dev
\`\`\`

This starts:
- Backend API on http://localhost:3001
- Frontend on http://localhost:5173

**Production Build**:
\`\`\`bash
npm run build
npm start
\`\`\`

### Demo Accounts

The system is seeded with demo accounts:

| Role | Email | Password |
|------|-------|----------|
| Student | student@iacademy.edu.ph | student123 |
| Admin | admin@iacademy.edu.ph | admin123 |

## Thesis Alignment

This implementation aligns with the thesis document as follows:

| Feature | Thesis Reference | Implementation |
|---------|------------------|----------------|
| Student Login | Section 1.1, 3.3.1 | JWT-based authentication with email/password |
| Locker Grid View | Section 3.4.1.5 | Visual grid showing locker availability by color |
| Status Colors | Section 3.3.9.4 | Green (Available), Yellow (Reserved), Red (Occupied), Gray (Unavailable) |
| Referral Slip | Section 3.3.9.3 | Auto-generated unique referral slip number |
| Reservation Flow | Section 3.3.4, 3.3.5 | Pending → For Endorsement → For Approval → Approved |
| Rules & Regulations | Section 3.4.1.7 | Policy acceptance modal before reservation |
| Admin Dashboard | Section 3.4.3 | Reservation management with endorsement/approval workflow |
| Floor Selection | Section 3.4.1.4 | Location and floor-based locker browsing |
| Data Model | Section 3.3.8, 3.3.9 | Student, Locker, FloorPlan, Reservation entities |

## API Endpoints

### Authentication
- \`POST /api/auth/register\` - Register new user
- \`POST /api/auth/login\` - User login
- \`GET /api/auth/me\` - Get current user

### Lockers
- \`GET /api/lockers\` - List all lockers
- \`GET /api/lockers/availability\` - Get available lockers (with filters)
- \`GET /api/lockers/location/:id\` - Get lockers by location
- \`POST /api/lockers\` - Create locker (admin)
- \`PUT /api/lockers/:id\` - Update locker (admin)
- \`DELETE /api/lockers/:id\` - Delete locker (admin)

### Reservations
- \`GET /api/reservations\` - List reservations
- \`POST /api/reservations\` - Create reservation
- \`PUT /api/reservations/:id/agreement\` - Accept agreement
- \`PUT /api/reservations/:id/submit\` - Submit for endorsement
- \`PUT /api/reservations/:id/endorse\` - Endorse (admin)
- \`PUT /api/reservations/:id/approve\` - Approve (admin)
- \`PUT /api/reservations/:id/cancel\` - Cancel reservation
- \`PUT /api/reservations/:id/extend\` - Extend reservation

### Locations
- \`GET /api/locations\` - List locations
- \`GET /api/locations/:id/floors\` - Get floor plans
- \`POST /api/locations\` - Create location (admin)
- \`POST /api/locations/:id/floors\` - Create floor plan (admin)

### Policies
- \`GET /api/policies\` - List policies

## Project Structure

\`\`\`
lockr-prototype/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React context (Auth)
│   │   ├── hooks/         # Custom React hooks
│   │   ├── lib/           # Utilities (API client)
│   │   ├── pages/         # Page components
│   │   └── types/         # TypeScript types
│   └── ...
├── server/                 # Express backend
│   ├── src/
│   │   ├── data/          # Data store and seed
│   │   ├── middleware/    # Express middleware
│   │   ├── routes/        # API routes
│   │   ├── services/      # Business logic
│   │   └── types/         # TypeScript types
│   └── ...
├── docs/                   # Documentation
└── package.json           # Root package.json
\`\`\`

## Future Work

Based on the thesis requirements, the following features could be implemented:

1. **Campus SSO Integration**: Support for school OAuth/SSO (Microsoft, Google)
2. **QR Code/NFC**: Physical locker access via QR or NFC
3. **Payment Integration**: Online payment gateway
4. **Email Notifications**: Automated emails for reservation status
5. **Kiosk Mode**: On-site reservation terminal
6. **Mobile App**: Native mobile application
7. **Persistent Storage**: SQLite or PostgreSQL database
8. **Analytics Dashboard**: Usage reports and statistics
9. **Maintenance Tickets**: Locker maintenance workflow

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3001 |
| JWT_SECRET | JWT signing secret | (dev default) |
| CORS_ORIGIN | Allowed CORS origin | http://localhost:5173 |

## License

ISC

## References

- Thesis: "LockR: A Digital Platform for Management of School Lockers" (iACADEMY)
- See \`docs/data-model.md\` for entity relationship diagram
