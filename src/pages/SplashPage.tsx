import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Shield, Zap, Users } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui';

export function SplashPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Reservations',
      description: 'Your locker assignments are protected and verified',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Quick Process',
      description: 'Reserve your locker in just a few clicks',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Easy Management',
      description: 'Track your reservations and payments easily',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--color-primary-600)] to-[var(--color-primary-800)]">
      <div className="container mx-auto px-6 sm:px-8 lg:px-12 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center gap-3 mb-8 animate-fade-in">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Lock className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-white">LockR</span>
        </header>

        {/* Hero */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-16 py-8">
          <div className="lg:w-1/2 text-center lg:text-left animate-slide-in-bottom">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Digital Locker
              <br />
              <span className="text-[var(--color-primary-200)]">Management</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              A modern platform for managing school locker reservations. Simple, secure, and
              efficient.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => navigate('/login')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="bg-white text-[var(--color-primary-700)] hover:bg-white/90 px-8"
              >
                Get Started
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 px-8"
                onClick={() => navigate('/login')}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="lg:w-1/2 grid gap-5 animate-fade-in w-full max-w-xl lg:max-w-none">
            {features.map((feature, index) => (
              <div
                key={feature.title}
                className={clsx(
                  'flex items-start gap-5 p-6 rounded-2xl',
                  'bg-white/10 backdrop-blur-sm',
                  'transform transition-all duration-300',
                  'hover:bg-white/20 hover:scale-[1.02]'
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 rounded-xl bg-white/20 flex items-center justify-center text-white flex-shrink-0">
                  {feature.icon}
                </div>
                <div className="pt-1">
                  <h3 className="font-semibold text-white text-lg mb-1">{feature.title}</h3>
                  <p className="text-white/70">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-white/60 text-sm py-6 animate-fade-in">
          <p>
            LockR: A Digital Platform for Management of School Lockers
            <br />
            © {new Date().getFullYear()} All rights reserved
          </p>
        </footer>
      </div>
    </div>
  );
}
