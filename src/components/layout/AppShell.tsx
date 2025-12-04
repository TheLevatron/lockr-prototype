import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

// Map routes to page titles
const pageTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/floors': 'Floor Plan',
  '/reservations': 'My Reservations',
  '/admin': 'Admin Dashboard',
  '/admin/endorsement': 'For Endorsement',
  '/admin/approval': 'For Approval',
  '/admin/occupied': 'Occupied Lockers',
  '/admin/history': 'Reservation History',
  '/admin/floors': 'Floor Plan Editor',
  '/admin/academic-year': 'Academic Year',
  '/admin/settings': 'Settings',
};

export function AppShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Get page title based on current route
  const getTitle = () => {
    // Check exact match first
    if (pageTitles[location.pathname]) {
      return pageTitles[location.pathname];
    }
    // Check if it starts with any known path
    for (const [path, title] of Object.entries(pageTitles)) {
      if (location.pathname.startsWith(path) && path !== '/') {
        return title;
      }
    }
    return '';
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg-secondary)]">
      {/* Skip link for accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col min-h-screen lg:ml-0">
          <Topbar onMenuClick={() => setSidebarOpen(true)} title={getTitle()} />

          <main
            id="main-content"
            className="flex-1 p-4 lg:p-6"
            role="main"
            tabIndex={-1}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
