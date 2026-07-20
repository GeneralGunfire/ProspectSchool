// Shared loading spinner — extracted from the inline markup previously
// hardcoded in App.tsx's top-level Suspense fallback so every lazy-loaded
// route/page uses one consistent spinner instead of ad-hoc copies.
export function Spinner({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <div className={`border-2 border-slate-200 border-t-slate-700 rounded-full animate-spin ${className}`} />
  );
}
