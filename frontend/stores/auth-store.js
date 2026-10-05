import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import apiClient from '../lib/api-client';

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const res = await apiClient.post('/auth/login', { email, password });
        const { accessToken, user } = res.data;
        localStorage.setItem('accessToken', accessToken);
        set({ user, token: accessToken });
        return user;
      },

      unlock: async (pin) => {
        const res = await apiClient.post('/auth/unlock', { pin });
        const { accessToken, user } = res.data;
        localStorage.setItem('accessToken', accessToken);
        set({ user, token: accessToken });
        return user;
      },

      logout: () => {
        localStorage.removeItem('accessToken');
        set({ user: null, token: null });
      },

      hasPermission: (perm) => {
        const user = get().user;
        return user?.permissions?.includes(perm) ?? false;
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);
