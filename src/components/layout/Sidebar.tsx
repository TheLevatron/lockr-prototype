import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard,
  MapPin,
  ClipboardList,
  Calendar,
  Settings,
  LogOut,
  Lock,
  Users,
  FileCheck,
  History,
  X,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

const studentNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'Floor Plan', href: '/floors', icon: <MapPin className="w-5 h-5" /> },
  { label: 'My Reservations', href: '/reservations', icon: <ClipboardList className="w-5 h-5" /> },
];

const adminNavItems: NavItem[] = [
  { label: 'Dashboard', href: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { label: 'For Endorsement', href: '/admin/endorsement', icon: <FileCheck className="w-5 h-5" /> },
  { label: 'For Approval', href: '/admin/approval', icon: <ClipboardList className="w-5 h-5" /> },
  { label: 'Occupied', href: '/admin/occupied', icon: <Users className="w-5 h-5" /> },
  { label: 'History', href: '/admin/history', icon: <History className="w-5 h-5" /> },
  { label: 'Floor Plan', href: '/admin/floors', icon: <MapPin className="w-5 h-5" /> },
  { label: 'Academic Year', href: '/admin/academic-year', icon: <Calendar className="w-5 h-5" /> },
  { label: 'Settings', href: '/admin/settings', icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const location = useLocation();
  const { user, logout, isAdmin, isOfficer } = useAuth();

  const navItems = isAdmin || isOfficer ? adminNavItems : studentNavItems;

  const isActive = (href: string) => {
    if (href === '/admin' || href === '/dashboard') {
      return location.pathname === href;
    }
    return location.pathname.startsWith(href);
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-[var(--z-modal)] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full z-[var(--z-modal)]',
          'w-64 bg-[var(--color-sidebar-bg)]',
          'flex flex-col',
          'transition-transform duration-300 ease-in-out',
          'lg:translate-x-0 lg:static lg:z-0',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
          <Link
            to={isAdmin || isOfficer ? '/admin' : '/dashboard'}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-600)] flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">LockR</span>
          </Link>
          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)]"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => onClose()}
                  className={clsx(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg',
                    'text-sm font-medium transition-colors duration-150',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-400)]',
                    isActive(item.href)
                      ? 'bg-[var(--color-sidebar-active)] text-white'
                      : 'text-[var(--color-sidebar-text)] hover:bg-[var(--color-sidebar-hover)]'
                  )}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  {item.icon}
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-white/10">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[var(--color-primary-600)] flex items-center justify-center text-white text-sm font-medium">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-[var(--color-sidebar-text)] truncate capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg',
              'text-sm font-medium text-[var(--color-sidebar-text)]',
              'hover:bg-[var(--color-sidebar-hover)]',
              'transition-colors duration-150',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-400)]'
            )}
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
