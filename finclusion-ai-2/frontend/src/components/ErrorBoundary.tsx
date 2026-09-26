import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--bg-base)] text-[var(--text-main)] p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 flex items-center justify-center mb-6 border border-rose-500/20">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2 tracking-tight">Something went wrong</h1>
          <p className="text-[var(--text-muted)] mb-8 max-w-md">
            We encountered an unexpected error while loading this interface. Don't worry, your data is safe.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-[var(--bg-surface)] border border-[var(--border-card)] hover:border-[var(--accent-primary)] font-semibold transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" /> Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
