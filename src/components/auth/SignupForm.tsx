import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface SignupFormProps {
  onSuccess?: () => void;
  onSwitchToSignin?: () => void;
}

const GoogleIcon: React.FC = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

export const SignupForm: React.FC<SignupFormProps> = ({
  onSuccess,
  onSwitchToSignin,
}) => {
  const { signUp, signInWithGoogle } = useAuthStore();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name || !email || !password) {
      setError('All fields are required.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      await signUp(email, password, name);
      onSuccess?.();
    } catch (err: any) {
      if (err?.code === 'auth/configuration-not-found') {
        setError('Email sign-in is not enabled. Please click "Continue with Google" or enable Email/Password in your Firebase Console.');
      } else {
        const msg =
          err?.code === 'auth/email-already-in-use'
            ? 'Email already in use.'
            : err?.message ?? 'Sign up failed.';
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onSuccess?.();
    } catch (err: any) {
      setError(err?.message ?? 'Google sign-in failed.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <div>
        <h2 className="text-xl font-semibold text-[#111827] mb-1">Create account</h2>
        <p className="text-sm text-gray-500">Get started with Ideal App today</p>
      </div>

      <Input
        label="Full name"
        type="text"
        placeholder="John Doe"
        iconLeft={UserIcon}
        value={name}
        onChange={(e) => setName((e.target as HTMLInputElement).value)}
        autoComplete="name"
        required
      />

      <Input
        label="Email address"
        type="email"
        placeholder="you@example.com"
        iconLeft={Mail}
        value={email}
        onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
        autoComplete="email"
        required
      />

      <Input
        label="Password"
        type="password"
        placeholder="Min. 6 characters"
        iconLeft={Lock}
        value={password}
        onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
        autoComplete="new-password"
        helperText="Must be at least 6 characters"
        required
      />

      {error && (
        <p className="text-sm text-red-500 bg-red-50 rounded-lg px-3 py-2 -mt-1">
          {error}
        </p>
      )}

      <Button type="submit" variant="primary" fullWidth loading={loading}>
        Create Account
      </Button>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#E5E7EB]" />
        <span className="text-xs text-gray-400">or continue with</span>
        <div className="flex-1 h-px bg-[#E5E7EB]" />
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={googleLoading}
        className="w-full flex items-center justify-center gap-2.5 bg-white border border-[#E5E7EB] text-[#111827] text-sm font-medium px-4 py-2.5 rounded-xl hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
      >
        <GoogleIcon />
        {googleLoading ? 'Connecting...' : 'Continue with Google'}
      </button>

      {onSwitchToSignin && (
        <p className="text-center text-sm text-gray-500">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitchToSignin}
            className="text-indigo-600 font-medium hover:text-indigo-700 transition-colors"
          >
            Sign In
          </button>
        </p>
      )}
    </form>
  );
};

export default SignupForm;
