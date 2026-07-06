import { Component, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

// A crash in any child (e.g. a third-party library throwing during a browser
// feature it assumed was available) would otherwise unmount the whole React
// tree to a blank page with no on-screen indication anything went wrong —
// this catches that and shows a minimal recoverable message instead.
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    console.error('[ErrorBoundary] caught:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? (
        <div className="min-h-screen flex items-center justify-center bg-brand-bg px-5">
          <div className="text-center max-w-sm">
            <p className="font-black text-brand-dark text-xl mb-2">Something went wrong.</p>
            <p className="text-stone-500 text-sm mb-5">Please refresh the page to try again.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-brand-dark text-white rounded-xl px-6 py-3 font-black text-[13px] cursor-pointer"
            >
              Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
