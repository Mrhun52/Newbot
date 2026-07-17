import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '@/types';

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      credentials: null,
      isAuthenticated: false,
      login: (credentials, user) => set({ credentials, user, isAuthenticated: true }),
      logout: () => set({ credentials: null, user: null, isAuthenticated: false }),
      updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
