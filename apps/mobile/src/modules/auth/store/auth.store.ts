import { create } from 'zustand';
import type { User } from '@wudapp/types';

interface AuthState {
  user:  User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user:  null,
  token: localStorage.getItem('wudapp:token'),
  setAuth: (user, token) => {
    localStorage.setItem('wudapp:token', token);
    set({ user, token });
  },
  clearAuth: () => {
    localStorage.removeItem('wudapp:token');
    set({ user: null, token: null });
  },
}));
