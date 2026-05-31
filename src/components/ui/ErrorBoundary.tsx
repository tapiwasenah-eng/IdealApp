import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="bg-white rounded-2xl border border-[#E5E7EB] shadow-lg p-8 max-w-md w-full text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-red-50 rounded-full p-4">
                <AlertTriangle size={32} className="text-red-500" />
              </div>
            </div>
            <h1 className="text-xl font-semibold text-[#111827] mb-2">
              Something went wrong
            </h1>
            <p className="text-sm text-gray-500 mb-2">
              An unexpected error occurred while rendering this page.
            </p>
            {this.state.error && (
              <p className="text-xs text-red-400 font-mono bg-red-50 rounded-lg px-3 py-2 mb-6 text-left break-all">
                {this.state.error.message}
              </p>
            )}
            <div className="flex flex-col gap-3">
              <button
                onClick={this.handleReload}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#3B82F6] text-white font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all focus:outline-none focus:ring-2 focus:ring-[#3B82F6] focus:ring-offset-2"
              >
                <RefreshCw size={16} />
                Reload App
              </button>
              <button
                onClick={this.handleReset}
                className="w-full inline-flex items-center justify-center gap-2 bg-gray-100 text-gray-700 font-medium text-sm px-4 py-2.5 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
