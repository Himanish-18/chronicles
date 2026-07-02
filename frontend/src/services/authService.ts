import type { User } from '@/types';
import { api } from './api';

export const authService = {
  login: (email: string, password: string) =>
    api.post<{ user: User; token: string }>('/auth/login', { email, password }),

  register: (name: string, email: string, password: string) =>
    api.post<{ user: User; token: string }>('/auth/register', { name, email, password }),

  forgotPassword: (email: string) =>
    api.post<{ message: string }>('/auth/forgot-password', { email }),

  verifyResetToken: (token: string) =>
    api.get<{ valid: boolean }>(`/auth/verify-reset-token/${token}`),

  resetPassword: (token: string, password: string) =>
    api.post<{ message: string }>('/auth/reset-password', { token, password }),

  getProfile: () => api.get<User>('/auth/me'),

  updateProfile: (data: Partial<User>) => api.put<User>('/auth/profile', data),
};
