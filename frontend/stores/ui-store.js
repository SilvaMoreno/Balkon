import { create } from 'zustand';

export const useUIStore = create((set) => ({
  sidebarOpen: true,
  locked: false,
  toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
  setLocked: (locked) => set({ locked }),
}));
