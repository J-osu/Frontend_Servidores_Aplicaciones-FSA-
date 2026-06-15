'use client';

import { useAuth } from './auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, isAdmin, isLoading } = useAuth();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isLoading) return;

    if (!isLoggedIn || !isAdmin) {
      router.push('/login');
      return;
    }

    setIsReady(true);
  }, [isLoading, isLoggedIn, isAdmin, router]);

  if (isLoading || !isReady) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-sm text-muted-foreground">Cargando sesión...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
