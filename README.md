# LockR Prototype

A modern, accessible web-based locker reservation system for schools, based on the thesis "LockR: A Digital Platform for Management of School Lockers."

## Features

### User Features
- **Floor Plan Selection**: Browse available floors and their locker availability
- **Locker Grid View**: Visual grid of lockers with real-time availability status
- **Reservation Flow**: Multi-step reservation process with policy acknowledgment
- **Receipt Upload**: Drag-and-drop file upload with preview and validation
- **Reservation Tracking**: View and track reservation status

### Admin Features
- **Dashboard**: Overview of pending, approved, and occupied reservations
- **Tabbed Management**: Separate views for endorsement, approval, occupied, and history
- **Floor Plan Editor**: Add, edit, and delete lockers from floor plans
- **Academic Year Wizard**: Configure academic year and reservation periods

### Accessibility (a11y)
- ✅ Semantic HTML with proper heading hierarchy
- ✅ ARIA labels and roles throughout
- ✅ Keyboard navigation support
- ✅ Roving tabindex for locker grid navigation
- ✅ Focus-visible states for all interactive elements
- ✅ Focus trap in modals and dialogs
- ✅ Skip link for main content
- ✅ Screen reader announcements for status changes
- ✅ Color contrast compliant design tokens

### UI/UX Enhancements
- ✅ Light/Dark theme with localStorage persistence
- ✅ Micro-interactions and animations (150-200ms transitions)
- ✅ Toast notifications for user feedback
- ✅ Responsive design for mobile and desktop
- ✅ Loading states and skeletons

## Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 7
- **Styling**: TailwindCSS 4 with CSS custom properties
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router 7
- **UI Components**: Headless UI + Lucide Icons
- **Notifications**: React Hot Toast

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm 9+

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/TheLevatron/lockr-prototype.git
cd lockr-prototype

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Start development server
npm run dev
\`\`\`

### Available Scripts

\`\`\`bash
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
npm run preview  # Preview production build
\`\`\`

## Demo Credentials

| Role    | Email             | Password   |
|---------|-------------------|------------|
| Student | student@lockr.edu | student123 |
| Officer | officer@lockr.edu | officer123 |
| Admin   | admin@lockr.edu   | admin123   |

## Project Structure

\`\`\`
src/
├── components/
│   ├── admin/          # Admin-specific components
│   ├── layout/         # AppShell, Sidebar, Topbar
│   ├── ui/             # Reusable UI components
│   └── user/           # User-specific components
├── context/            # React contexts (Theme, Auth)
├── pages/
│   ├── admin/          # Admin pages
│   └── user/           # User pages
├── services/           # API services and mock data
├── styles/             # CSS and design tokens
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
\`\`\`

## Thesis Section Mapping

| Screen | Thesis Section |
|--------|----------------|
| Splash/Landing | Section 1 - Introduction |
| Login | Section 4.1 - User Authentication |
| Floor Plan Selection | Section 4.2 - Locker Location |
| Locker Grid | Section 4.2 - Locker Selection |
| Reservation Policy | Section 4.3 - Terms and Conditions |
| Receipt Upload | Section 4.4 - Payment Verification |
| Verified Receipt | Section 4.4 - Confirmation |
| Admin Dashboard | Section 5.1 - Administrative Functions |
| For Endorsement | Section 5.2 - Officer Endorsement |
| For Approval | Section 5.3 - Admin Approval |
| Floor Plan Editor | Section 5.4 - Locker Management |
| Academic Year | Section 5.5 - Academic Period Setup |

## Design Tokens

Design tokens are defined in \`src/styles/tokens.css\`:

- **Colors**: Primary (blue), Success (green), Warning (amber), Error (red), Neutrals
- **Spacing**: 0-20 scale (0.25rem increments)
- **Border Radius**: sm, md, lg, xl, 2xl, full
- **Shadows**: sm, md, lg, xl
- **Transitions**: fast (150ms), normal (200ms), slow (300ms)

## Accessibility Checklist

- [x] All images have alt text
- [x] Form inputs have associated labels
- [x] Color is not the only way to convey information
- [x] Focus is visible on all interactive elements
- [x] Modals trap focus and return focus on close
- [x] Skip navigation link available
- [x] Heading levels are sequential
- [x] ARIA landmarks used appropriately
- [x] Dynamic content updates announced

## Known TODOs

- [ ] Replace mock data with actual API integration
- [ ] Add policy content from thesis PDF Section 4.3
- [ ] Implement password reset flow
- [ ] Add email notifications
- [ ] Implement locker position drag-and-drop editor

## License

This project is for educational purposes as part of the thesis "LockR: A Digital Platform for Management of School Lockers."

## References

- Thesis PDF: \`LockR_ A Digital Platform for Management of School Lockers (2)_compressed-compressed.pdf\`
