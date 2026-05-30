'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/hooks/useReduxStore';

/**
 * Client-side auth guard — redirects unauthenticated users to /.
 * Wraps page content that requires login.
 */
export default function ProtectedPage({ children }) {
  const { user, isLoading } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/');
    }
  }, [user, isLoading, router]);

  // While auth state is being determined, render nothing (AppShell shows LoadingScreen)
  if (isLoading || !user) return null;

  return children;
}
