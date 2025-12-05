import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { Toaster } from '@/components/ui';
import { AppShell } from '@/components/layout';

// Pages
import { SplashPage } from '@/pages/SplashPage';
import { LoginPage } from '@/pages/LoginPage';
import { UserDashboardPage, FloorSelectionPage, LockerGridPage, ReservationsPage } from '@/pages/user';
import { AdminDashboardPage, AdminFloorPlanPage, AcademicYearPage } from '@/pages/admin';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

// Protected route wrapper
function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, isAdmin, isOfficer } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !isAdmin && !isOfficer) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Redirect based on role
function RoleBasedRedirect() {
  const { isAuthenticated, isAdmin, isOfficer } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isAdmin || isOfficer) {
    return <Navigate to="/admin" replace />;
  }

  return <Navigate to="/dashboard" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<SplashPage />} />
      <Route path="/login" element={<LoginPage />} />

      {/* User routes */}
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<UserDashboardPage />} />
        <Route path="/floors" element={<FloorSelectionPage />} />
        <Route path="/floors/:floorId" element={<LockerGridPage />} />
        <Route path="/reservations" element={<ReservationsPage />} />
      </Route>

      {/* Admin routes */}
      <Route
        element={
          <ProtectedRoute adminOnly>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/endorsement" element={<AdminDashboardPage />} />
        <Route path="/admin/approval" element={<AdminDashboardPage />} />
        <Route path="/admin/occupied" element={<AdminDashboardPage />} />
        <Route path="/admin/history" element={<AdminDashboardPage />} />
        <Route path="/admin/floors" element={<AdminFloorPlanPage />} />
        <Route path="/admin/academic-year" element={<AcademicYearPage />} />
        <Route path="/admin/settings" element={<AdminDashboardPage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<RoleBasedRedirect />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <BrowserRouter>
            <AppRoutes />
            <Toaster />
          </BrowserRouter>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
