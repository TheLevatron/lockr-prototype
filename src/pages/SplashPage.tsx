import { useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Shield, Zap, Users, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import { Button } from '@/components/ui';

export function SplashPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Secure Reservations',
      description: 'Your locker assignments are protected with verified authentication',
      gradient: 'from-violet-500 to-purple-500',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Reserve your locker in seconds with our streamlined process',
      gradient: 'from-amber-500 to-orange-500',
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Smart Management',
      description: 'Track reservations and payments with intuitive dashboards',
      gradient: 'from-emerald-500 to-teal-500',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f0f1a] overflow-hidden relative">
      {/* Animated background gradient orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -left-40 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 right-1/3 w-72 h-72 bg-pink-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Grid pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />

      <div className="relative container mx-auto px-6 sm:px-8 lg:px-16 py-8 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">LockR</span>
          </div>
          <Button
            variant="ghost"
            className="text-white/70 hover:text-white hover:bg-white/10"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </header>

        {/* Hero Section */}
        <main className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-20 py-16">
          {/* Left side - Text content */}
          <div className="lg:w-1/2 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-8 animate-slide-in-bottom">
              <Sparkles className="w-4 h-4" />
              <span>Introducing LockR 2.0</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight animate-slide-in-bottom" style={{ animationDelay: '100ms' }}>
              Digital Locker
              <br />
              <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Management
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-white/60 mb-12 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-slide-in-bottom" style={{ animationDelay: '200ms' }}>
              A modern platform for managing school locker reservations. Simple, secure, and beautifully designed.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-in-bottom" style={{ animationDelay: '300ms' }}>
              <Button
                size="lg"
                onClick={() => navigate('/login')}
                rightIcon={<ArrowRight className="w-5 h-5" />}
                className="bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white px-8 py-4 text-lg shadow-xl shadow-purple-500/25 border-0"
              >
                Get Started Free
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/5 px-8 py-4 text-lg backdrop-blur-sm"
                onClick={() => navigate('/login')}
              >
                Watch Demo
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex items-center gap-6 mt-12 justify-center lg:justify-start animate-fade-in" style={{ animationDelay: '400ms' }}>
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-500 border-2 border-[#0f0f1a] flex items-center justify-center text-white text-xs font-medium"
                  >
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <p className="text-sm text-white/50">
                <span className="text-white font-semibold">500+</span> students using LockR
              </p>
            </div>
          </div>

          {/* Right side - Feature cards */}
          <div className="lg:w-1/2 w-full max-w-xl lg:max-w-none">
            <div className="grid gap-5">
              {features.map((feature, index) => (
                <div
                  key={feature.title}
                  className={clsx(
                    'group relative flex items-start gap-5 p-6 rounded-3xl',
                    'bg-white/[0.03] backdrop-blur-xl border border-white/[0.05]',
                    'transform transition-all duration-500',
                    'hover:bg-white/[0.06] hover:border-white/[0.1] hover:scale-[1.02]',
                    'animate-slide-in-bottom'
                  )}
                  style={{ animationDelay: `${(index + 4) * 100}ms` }}
                >
                  {/* Glow effect on hover */}
                  <div className={clsx(
                    'absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                    'bg-gradient-to-r',
                    feature.gradient,
                    'blur-xl -z-10'
                  )} style={{ transform: 'scale(0.9)', filter: 'blur(40px)', opacity: 0.15 }} />
                  
                  <div className={clsx(
                    'w-14 h-14 rounded-2xl flex items-center justify-center text-white flex-shrink-0',
                    'bg-gradient-to-br shadow-lg',
                    feature.gradient
                  )}>
                    {feature.icon}
                  </div>
                  <div className="pt-1">
                    <h3 className="font-semibold text-white text-lg mb-2">{feature.title}</h3>
                    <p className="text-white/50 leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="text-center text-white/30 text-sm py-6 animate-fade-in">
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
