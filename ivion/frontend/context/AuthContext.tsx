'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { UserDTO } from '../lib/types';
import { api } from '../lib/api';

interface AuthState {
  user: UserDTO | null;
  initializing: boolean;
}

interface AuthContextValue {
  user: UserDTO | null;
  isAuthenticated: boolean;
  initializing: boolean;
  login: (user: UserDTO) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, initializing: true });

  useEffect(() => {
    api.get<UserDTO>('/api/auth/me')
      .then(user => setState({ user, initializing: false }))
      .catch(() => setState({ user: null, initializing: false }));
  }, []);

  const login = useCallback((user: UserDTO) => {
    setState({ user, initializing: false });
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout', null);
    } catch {
      // best-effort
    }
    setState({ user: null, initializing: false });
  }, []);

  return (
    <AuthContext.Provider value={{
      user: state.user,
      isAuthenticated: !!state.user,
      initializing: state.initializing,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
