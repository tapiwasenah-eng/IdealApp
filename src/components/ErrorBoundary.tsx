import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-[9999] bg-red-50 p-8 flex flex-col items-center justify-center overflow-auto font-mono text-red-900">
          <div className="max-w-4xl w-full bg-white rounded-lg shadow-2xl border border-red-200 p-8">
            <h1 className="text-3xl font-bold mb-4">React Application Crashed</h1>
            <h2 className="text-xl font-semibold mb-2">{this.state.error?.toString()}</h2>
            <div className="bg-red-900 text-red-50 p-4 rounded text-sm overflow-x-auto my-4 whitespace-pre-wrap">
              {this.state.error?.stack}
            </div>
            {this.state.errorInfo && (
              <div className="bg-slate-900 text-slate-50 p-4 rounded text-sm overflow-x-auto whitespace-pre-wrap">
                {this.state.errorInfo.componentStack}
              </div>
            )}
            <button 
              className="mt-6 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700" 
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary };
