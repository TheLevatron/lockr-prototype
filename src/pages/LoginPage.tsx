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
      <header className="p-4">
        <Link to="/" className="flex items-center gap-2 w-fit">
          <div className="w-8 h-8 rounded-lg bg-[var(--color-primary-600)] flex items-center justify-center">
            <Lock className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-[var(--color-text-primary)]">LockR</span>
        </Link>
      </header>

      {/* Main content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md animate-scale-in">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-primary-100)] flex items-center justify-center">
                <KeyRound className="w-8 h-8 text-[var(--color-primary-600)]" />
              </div>
              <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">Welcome back</h1>
              <p className="text-[var(--color-text-secondary)] mt-1">
                Sign in to your LockR account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
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
                    'absolute right-3 top-9 p-1',
                    'text-[var(--color-text-tertiary)]',
                    'hover:text-[var(--color-text-secondary)]',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] rounded'
                  )}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
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
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Sign In
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-6 p-4 bg-[var(--color-bg-tertiary)] rounded-lg">
              <p className="text-xs font-medium text-[var(--color-text-tertiary)] mb-2">
                Demo Credentials:
              </p>
              <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
                <p>
                  <strong>Student:</strong> student@lockr.edu / student123
                </p>
                <p>
                  <strong>Officer:</strong> officer@lockr.edu / officer123
                </p>
                <p>
                  <strong>Admin:</strong> admin@lockr.edu / admin123
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-sm text-[var(--color-text-tertiary)]">
        <p>
          Based on thesis: "LockR: A Digital Platform for Management of School Lockers"
        </p>
      </footer>
    </div>
  );
}
