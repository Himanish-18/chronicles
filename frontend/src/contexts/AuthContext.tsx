import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, AuthState } from '@/types';

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: localStorage.getItem('chronicles-token'),
    isAuthenticated: !!localStorage.getItem('chronicles-token'),
    isLoading: false,
  });

  const login = async (_email: string, _password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    // Placeholder — will connect to backend API in future phase
    const mockUser: User = {
      id: '1',
      name: 'Alex Morgan',
      email: _email,
      avatar: 'https://api.dicebear.com/9.x/avataaars/svg?seed=Alex',
      bio: 'Full-stack developer & technical writer.',
      role: 'user',
      createdAt: new Date().toISOString(),
    };
    const mockToken = 'mock-jwt-token';
    localStorage.setItem('chronicles-token', mockToken);
    setState({ user: mockUser, token: mockToken, isAuthenticated: true, isLoading: false });
  };

  const register = async (_name: string, _email: string, _password: string) => {
    setState((s) => ({ ...s, isLoading: true }));
    // Placeholder
    await login(_email, _password);
  };

  const logout = () => {
    localStorage.removeItem('chronicles-token');
    setState({ user: null, token: null, isAuthenticated: false, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
