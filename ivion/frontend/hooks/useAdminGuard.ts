'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

// UX-only guard: keeps non-admins off the admin pages/redirects them away.
// The real access control is the hasRole("ADMIN") check on the backend —
// this hook never substitutes for it.
export function useAdminGuard() {
  const router = useRouter();
  const { user, isAuthenticated, initializing } = useAuth();

  useEffect(() => {
    if (initializing) return;
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/account');
    }
  }, [initializing, isAuthenticated, user, router]);

  return { ready: !initializing && isAuthenticated && user?.role === 'ADMIN' };
}
