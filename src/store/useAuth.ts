import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState } from '@/types';

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      credentials: null,
      isAuthenticated: false,
      login: (credentials, user) => set({ credentials, user, isAuthenticated: true, lastActivity: Date.now() }),
      updateActivity: () => set({ lastActivity: Date.now() }),
      checkActivity: () => set((state) => {
        if (state.isAuthenticated && state.lastActivity && Date.now() - state.lastActivity > 30 * 60 * 1000) {
          return { credentials: null, user: null, isAuthenticated: false, lastActivity: undefined };
        }
        return state;
      }),
      logout: () => set({ credentials: null, user: null, isAuthenticated: false }),
      updateUser: (data) => set((state) => ({ user: state.user ? { ...state.user, ...data } : null })),
    }),
    {
      name: 'auth-storage',
    }
  )
);
