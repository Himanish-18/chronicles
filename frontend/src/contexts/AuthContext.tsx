import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { AuthState } from '@/types';
import { authService } from '@/services/authService';
import { socialAuthService } from '@/services/socialAuthService';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGitHub: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('chronicles-token'),
    isAuthenticated: false,
    isLoading: !!localStorage.getItem('chronicles-token'), // load if we have token
  });

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('chronicles-token');
      if (token) {
        try {
          const user = await authService.getProfile();
          setState({ user, token, isAuthenticated: true, isLoading: false });
        } catch (error) {
          console.error('Session restoration failed:', error);
          localStorage.removeItem('chronicles-token');
          setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      }
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const { user, token } = await authService.login(email, password);
      localStorage.setItem('chronicles-token', token);
      setState({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((s) => ({ ...s, isLoading: false }));
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const { user, token } = await authService.register(name, email, password);
      localStorage.setItem('chronicles-token', token);
      setState({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((s) => ({ ...s, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('chronicles-token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  const loginWithGoogle = async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const { user, token } = await socialAuthService.signInWithGoogle();
      localStorage.setItem('chronicles-token', token);
      setState({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((s) => ({ ...s, isLoading: false }));
      throw error;
    }
  };

  const loginWithGitHub = async () => {
    setState((s) => ({ ...s, isLoading: true }));
    try {
      const { user, token } = await socialAuthService.signInWithGitHub();
      localStorage.setItem('chronicles-token', token);
      setState({ user, token, isAuthenticated: true, isLoading: false });
    } catch (error) {
      setState((s) => ({ ...s, isLoading: false }));
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, loginWithGoogle, loginWithGitHub, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
