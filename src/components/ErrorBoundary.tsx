import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
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

  public componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    // 🛡️ Sentinel: Safe error logging - do not expose React component stack traces containing PII to console.
    console.error('Uncaught error:', error);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
          <h2 className="text-xl font-bold mb-2">Something went wrong.</h2>
          <details className="whitespace-pre-wrap">
            {/* 🛡️ Sentinel: Do not render raw error strings to prevent exposing internal state or stack traces to the UI */}
            An unexpected error occurred. Please refresh the page or try again later.
          </details>
        </div>
      );
    }

    return this.props.children;
  }
}
