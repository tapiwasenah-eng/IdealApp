// src/main.tsx
import React, { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import './index.css';
import App from './App';
import { ErrorBoundary } from './components/ErrorBoundary';
import { migrateTemplatesFromLocal } from './lib/migrateTemplatesFromLocal';

const RootComponent = () => {
  useEffect(() => {
    if (import.meta.env.DEV) {
      migrateTemplatesFromLocal().catch(console.error);
    }
  }, []);

  return (
    <StrictMode>
      <ErrorBoundary>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </ErrorBoundary>
    </StrictMode>
  );
};

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

createRoot(rootEl).render(<RootComponent />);
