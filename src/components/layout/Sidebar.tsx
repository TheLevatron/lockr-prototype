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
  ChevronRight,
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[var(--z-modal)] lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full z-[var(--z-modal)]',
          'w-72 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-950',
          'flex flex-col',
          'transition-transform duration-300 ease-out',
          'lg:translate-x-0 lg:static lg:z-0',
          'shadow-2xl lg:shadow-none',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/5">
          <Link
            to={isAdmin || isOfficer ? '/admin' : '/dashboard'}
            className="flex items-center gap-3 group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">LockR</span>
          </Link>
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-4">
          <ul className="space-y-1" role="list">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  to={item.href}
                  onClick={() => onClose()}
                  className={clsx(
                    'group flex items-center justify-between px-4 py-3 rounded-xl',
                    'text-sm font-medium transition-all duration-200',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900',
                    isActive(item.href)
                      ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-purple-500/25'
                      : 'text-gray-400 hover:bg-white/5 hover:text-white'
                  )}
                  aria-current={isActive(item.href) ? 'page' : undefined}
                >
                  <div className="flex items-center gap-3">
                    <span className={clsx(
                      'transition-transform duration-200',
                      isActive(item.href) ? '' : 'group-hover:scale-110'
                    )}>
                      {item.icon}
                    </span>
                    {item.label}
                  </div>
                  {isActive(item.href) && (
                    <ChevronRight className="w-4 h-4 opacity-70" />
                  )}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-4 px-4 py-3 mb-2 rounded-xl bg-white/5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/20">
              {user?.firstName?.[0]}
              {user?.lastName?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-400 truncate capitalize">
                {user?.role}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={logout}
            className={clsx(
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl',
              'text-sm font-medium text-gray-400',
              'hover:bg-rose-500/10 hover:text-rose-400',
              'transition-all duration-200',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-rose-400 focus-visible:ring-offset-2 focus-visible:ring-offset-gray-900'
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
