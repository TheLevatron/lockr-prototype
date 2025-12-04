import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  isOfficer: boolean;
  isStudent: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// Mock users for demo purposes
const MOCK_USERS: Record<string, User & { password: string }> = {
  'student@lockr.edu': {
    id: '1',
    email: 'student@lockr.edu',
    password: 'student123',
    firstName: 'Juan',
    lastName: 'Dela Cruz',
    studentId: '2024-00001',
    role: 'student',
  },
  'officer@lockr.edu': {
    id: '2',
    email: 'officer@lockr.edu',
    password: 'officer123',
    firstName: 'Maria',
    lastName: 'Santos',
    role: 'officer',
  },
  'admin@lockr.edu': {
    id: '3',
    email: 'admin@lockr.edu',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('lockr-user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500));

    const mockUser = MOCK_USERS[email.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _pwd, ...userData } = mockUser;
      setUser(userData);
      localStorage.setItem('lockr-user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('lockr-user');
  };

  const isAuthenticated = user !== null;
  const isAdmin = user?.role === 'admin';
  const isOfficer = user?.role === 'officer';
  const isStudent = user?.role === 'student';

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        isAdmin,
        isOfficer,
        isStudent,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
