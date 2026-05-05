import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles, Zap, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useStore } from '../store';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import { Logo } from '../components/ui/Logo';
import SEOHead from '../components/Shared/SEOHead';

const BENEFITS = [
  {
    icon: Sparkles,
    title: 'AI-Powered Generation',
    description: 'Create professional business documents in seconds with Gemini.',
  },
  {
    icon: Zap,
    title: 'Real-time Editor',
    description: 'Powerful canvas editor with drag-and-drop simplicity.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise Security',
    description: 'Your data is encrypted and protected with industry standards.',
  },
];

export const AuthPage: React.FC = () => {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const { user, loading } = useStore();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect if already logged in
  useEffect(() => {
    if (user && !loading) {
      const from = (location.state as any)?.from?.pathname || '/dashboard';
      navigate(from, { replace: true });
    }
  }, [user, loading, navigate, location]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col md:flex-row relative">
      <SEOHead
        title="Sign In or Create Your Free Account | Ideal App"
        description="Log in to Ideal App or create your free account to start building pitch decks, business plans, and financial models with AI."
        canonicalUrl="https://idealapp.technology/auth"
        noIndex={true}
      />
      {/* Back to Home Button */}
      <Link 
        to="/" 
        className="absolute top-4 left-4 z-50 flex items-center gap-1.5 text-gray-400 hover:text-white md:text-gray-400 md:hover:text-white transition-colors group"
      >
        <div className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-colors">
          <ArrowLeft size={14} />
        </div>
        <span className="text-xs font-medium">Back to Home</span>
      </Link>

      {/* Left Panel - Branding & Benefits */}
      <div className="hidden md:flex md:w-1/2 bg-[#111827] p-12 flex-col justify-between relative overflow-hidden">
        {/* Abstract background blobs */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-600/20 blur-[120px] rounded-full" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-16">
            <Logo variant="full" size="xl" color="white" href="/" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight mb-8">
            Turn your ideas into <br />
            <span className="text-indigo-500">professional documents.</span>
          </h1>

          <div className="space-y-8">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + i * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <benefit.icon className="text-indigo-500" size={24} />
                </div>
                <div>
                  <h3 className="text-white font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {benefit.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-3 text-sm text-gray-500">
          <div className="flex -space-x-2">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full border-2 border-[#111827] bg-gray-800 flex items-center justify-center overflow-hidden"
              >
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                  alt="User"
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
          <span>Joined by 10,000+ professionals</span>
        </div>
      </div>

      {/* Right Panel - Auth Forms */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-[400px]">
          {/* Mobile Logo */}
          <div className="md:hidden flex items-center gap-2 mb-12">
            <Logo variant="full" size="lg" href="/" />
          </div>

          <AnimatePresence mode="wait">
            {mode === 'signin' ? (
              <motion.div
                key="signin"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <LoginForm onSwitchToSignup={() => setMode('signup')} />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <SignupForm onSwitchToSignin={() => setMode('signin')} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Trust badge */}
          <div className="mt-12 pt-8 border-t border-[#E5E7EB] flex items-center justify-center gap-6 opacity-40 grayscale">
            <img src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" alt="Google" className="h-5" referrerPolicy="no-referrer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" className="h-5" referrerPolicy="no-referrer" />
            <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="h-3.5" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
