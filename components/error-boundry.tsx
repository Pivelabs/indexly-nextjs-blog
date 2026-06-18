'use client';

import { useEffect } from 'react';

export function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Blog error:', error);
  }, [error]);

  return (
    <div className="min-h-[400px] flex items-center justify-center">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Something went wrong!</h2>
        <p className="text-muted-foreground">
          Unable to load blog posts. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
        >
          Try again
        </button>
      </div>
    </div>
  );
}