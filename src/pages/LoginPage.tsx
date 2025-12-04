import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, Eye, EyeOff, ArrowRight, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { useAuth } from '@/context/AuthContext';
import { Button, Input, toast } from '@/components/ui';

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
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-[#0f0f1a] overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/3 right-20 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          <div className="absolute -bottom-20 left-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        </div>
        
        {/* Grid overlay */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">LockR</span>
          </Link>

          <div className="max-w-md">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-8">
              <Sparkles className="w-4 h-4" />
              <span>Secure & Modern</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-6 leading-tight">
              Manage your locker
              <br />
              <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                with ease
              </span>
            </h2>
            <p className="text-white/50 text-lg leading-relaxed">
              Join hundreds of students already using LockR for seamless locker management.
            </p>
          </div>

          <p className="text-white/30 text-sm">
            Based on thesis: "LockR: A Digital Platform for Management of School Lockers"
          </p>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="w-full lg:w-1/2 flex flex-col bg-[var(--color-bg-primary)]">
        {/* Mobile header */}
        <header className="lg:hidden p-6">
          <Link to="/" className="flex items-center gap-3 w-fit">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[var(--color-text-primary)]">LockR</span>
          </Link>
        </header>

        <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-12">
          <div className="w-full max-w-md animate-scale-in">
            <div className="text-center lg:text-left mb-10">
              <h1 className="text-3xl sm:text-4xl font-bold text-[var(--color-text-primary)] mb-3">
                Welcome back
              </h1>
              <p className="text-[var(--color-text-secondary)] text-lg">
                Sign in to continue to your dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-5">
                <Input
                  type="email"
                  label="Email Address"
                  placeholder="you@school.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  leftIcon={<Mail className="w-5 h-5" />}
                  error={error && !email ? 'Email is required' : undefined}
                  required
                  autoComplete="email"
                  className="h-14"
                />

                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    label="Password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    leftIcon={<Lock className="w-5 h-5" />}
                    error={error && !password ? 'Password is required' : undefined}
                    required
                    autoComplete="current-password"
                    className="h-14"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={clsx(
                      'absolute right-4 top-10 p-1.5',
                      'text-[var(--color-text-tertiary)]',
                      'hover:text-[var(--color-text-secondary)]',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary-500)] rounded-lg',
                      'transition-colors duration-150'
                    )}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="p-4 rounded-xl bg-[var(--color-error-50)] border border-[var(--color-error-200)]">
                  <p className="text-sm text-[var(--color-error-600)] font-medium" role="alert">
                    {error}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                variant="primary"
                className="w-full h-14 text-lg bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 shadow-lg shadow-purple-500/25"
                size="lg"
                isLoading={isLoading}
                rightIcon={!isLoading ? <ArrowRight className="w-5 h-5" /> : undefined}
              >
                Sign In
              </Button>
            </form>

            {/* Demo credentials */}
            <div className="mt-10 p-6 bg-gradient-to-br from-[var(--color-bg-tertiary)] to-[var(--color-bg-secondary)] rounded-2xl border border-[var(--color-border-primary)]">
              <p className="text-sm font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--color-success-500)]" />
                Demo Credentials
              </p>
              <div className="grid gap-3 text-sm">
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]">
                  <span className="font-medium text-[var(--color-text-primary)]">Student</span>
                  <span className="text-[var(--color-text-secondary)] font-mono text-xs">student@lockr.edu / student123</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]">
                  <span className="font-medium text-[var(--color-text-primary)]">Officer</span>
                  <span className="text-[var(--color-text-secondary)] font-mono text-xs">officer@lockr.edu / officer123</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)]">
                  <span className="font-medium text-[var(--color-text-primary)]">Admin</span>
                  <span className="text-[var(--color-text-secondary)] font-mono text-xs">admin@lockr.edu / admin123</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile footer */}
        <footer className="lg:hidden py-6 text-center text-sm text-[var(--color-text-tertiary)]">
          <p>Based on thesis: "LockR: A Digital Platform for Management of School Lockers"</p>
        </footer>
      </div>
    </div>
  );
}
