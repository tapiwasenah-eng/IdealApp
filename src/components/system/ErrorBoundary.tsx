// src/components/system/ErrorBoundary.tsx

import React from 'react';
import { NavigateFunction, useNavigate } from 'react-router-dom';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundaryInner extends React.Component<
  ErrorBoundaryProps & { navigate: NavigateFunction },
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps & { navigate: NavigateFunction }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // In production you can send this to Sentry, LogRocket, etc.
    console.error('ErrorBoundary caught an error', error, info);
  }

  handleRefresh = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  handleBackToDashboard = () => {
    this.setState({ hasError: false, error: null });
    this.props.navigate('/dashboard');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100">
          <div className="max-w-md w-full mx-4">
            <div className="rounded-2xl border border-slate-800 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-indigo-900/40 px-6 py-6 sm:px-8 sm:py-7">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-9 w-9 rounded-xl bg-slate-900 flex items-center justify-center border border-slate-700">
                  <span className="text-indigo-400 font-semibold text-sm">I</span>
                </div>
                <div>
                  <h1 className="text-base sm:text-lg font-semibold tracking-tight">
                    Something went wrong
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-400">
                    The workspace hit an unexpected error. Your data is safe.
                  </p>
                </div>
              </div>

              <div className="mt-3 text-xs sm:text-sm text-slate-300">
                <p>Try returning to your dashboard or refreshing the page.</p>
              </div>

              {process.env.NODE_ENV !== 'production' && this.state.error && (
                <pre className="mt-4 max-h-32 overflow-auto rounded-lg bg-slate-900/80 border border-slate-800 px-3 py-2 text-[11px] text-slate-400">
                  {this.state.error.message}
                </pre>
              )}

              <div className="mt-5 flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={this.handleBackToDashboard}
                  className="inline-flex justify-center items-center rounded-lg px-4 py-2 text-sm font-semibold bg-indigo-600 text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-indigo-500"
                >
                  Return to Dashboard
                </button>
                <button
                  type="button"
                  onClick={this.handleRefresh}
                  className="inline-flex justify-center items-center rounded-lg px-4 py-2 text-sm font-semibold bg-slate-800 text-slate-100 hover:bg-slate-700 border border-slate-700"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({ children }) => {
  const navigate = useNavigate();
  return <ErrorBoundaryInner navigate={navigate}>{children}</ErrorBoundaryInner>;
};

export default ErrorBoundary;
