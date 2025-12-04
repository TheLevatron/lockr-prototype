import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, KeyRound } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, Card, CardContent, toast } from '@/components/ui';

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password);
      if (success) {
        toast.success('Welcome back!', 'You have been logged in successfully');
        // Navigate based on role
        const userData = JSON.parse(localStorage.getItem('lockr-user') || '{}');
        if (userData.role === 'admin' || userData.role === 'officer') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setError('Invalid email or password');
        toast.error('Login failed', 'Please check your credentials');
      }
    } catch {
      setError('An error occurred. Please try again.');
      toast.error('Error', 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--color-bg-secondary)]">
      {/* Header */}
      <header className="p-6">
        <Link to="/" className="flex items-center gap-3 w-fit">
          <div className="w-10 h-10 rounded-lg bg-[var(--color-primary-600)] flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[var(--color-text-primary)]">LockR</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md animate-scale-in shadow-lg">
          <CardContent className="p-8 sm:p-10">
            <div className="text-center mb-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center">
                <KeyRound className="w-10 h-10 text-[var(--color-primary-600)]" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-[var(--color-text-primary)]">Welcome back</h1>
              <p className="text-[var(--color-text-secondary)] mt-2 text-base">
                Sign in to your LockR account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                type="email"
                label="Email"
                placeholder="you@school.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="w-4 h-4" />}
                error={error && !email ? 'Email is required' : undefined}
                required
                autoComplete="email"
              />

              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  error={error && !password ? 'Password is required' : undefined}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={clsx(
                    'absolute right-3 top-9 p-1.5',
                    'text-[var(--color-text-tertiary)]',
                    'hover:text-[var(--color-text-secondary)]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] rounded'
                  )}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {error && (
                <p className="text-sm text-[var(--color-error-600)]" role="alert">
                  {error}
                </p>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2"
                size="lg"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-8 p-5 bg-[var(--color-bg-tertiary)] rounded-xl">
              <p className="text-sm font-medium text-[var(--color-text-tertiary)] mb-3">
                Demo Credentials:
              </p>
              <div className="text-sm text-[var(--color-text-secondary)] space-y-2">
                <p>
                  <strong className="text-[var(--color-text-primary)]">Student:</strong> student@lockr.edu / student123
                </p>
                <p>
                  <strong className="text-[var(--color-text-primary)]">Officer:</strong> officer@lockr.edu / officer123
                </p>
                <p>
                  <strong className="text-[var(--color-text-primary)]">Admin:</strong> admin@lockr.edu / admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-sm text-[var(--color-text-tertiary)]">
        <p>
          Based on thesis: "LockR: A Digital Platform for Management of School Lockers"
        </p>
      </footer>
    </div>
  );
}
