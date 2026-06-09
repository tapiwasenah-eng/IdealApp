// src/App.tsx

import React, { Suspense } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes/AppRoutes';
import ErrorBoundary from './components/system/ErrorBoundary';
import AuthModal from './components/auth/AuthModal';
import { useStore } from './store';

// Helper component for consuming hooks inside router context
const AuthModalRenderer = () => {
  const showAuthModal = useStore((state) => state.showAuthModal);
  const authModalMode = useStore((state) => state.authModalMode);
  const setShowAuthModal = useStore((state) => state.setShowAuthModal);
  const navigate = useNavigate();

  return (
    <AuthModal
      isOpen={showAuthModal}
      onClose={() => setShowAuthModal(false)}
      defaultTab={authModalMode === 'login' ? 'signin' : 'signup'}
    />
  );
};

function App() {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-white">
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-12 w-12 rounded-full border-2 border-transparent border-t-indigo-500 border-r-emerald-400 animate-spin" />
                  <div className="absolute inset-2 rounded-full bg-slate-900" />
                </div>
                <div className="text-sm text-slate-300">
                  Loading IdealApp workspace…
                </div>
              </div>
            </div>
          }
        >
          <AppRoutes />
          <AuthModalRenderer />
        </Suspense>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#020617',
              color: '#e5e7eb',
              border: '1px solid rgba(148, 163, 184, 0.35)',
            },
          }}
        />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
