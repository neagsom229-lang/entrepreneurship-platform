import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { migrateLegacyStorage } from './migrate-legacy-store';

interface UIState {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  isMobileNavOpen: boolean;
  isNotesDrawerOpen: boolean;
  isShortcutsModalOpen: boolean;

  // Actions
  toggleTheme: () => void;
  setTheme: (dark: boolean) => void;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  setMobileNavOpen: (open: boolean) => void;
  toggleNotesDrawer: () => void;
  setNotesDrawerOpen: (open: boolean) => void;
  toggleShortcutsModal: () => void;
  setShortcutsModalOpen: (open: boolean) => void;
}

if (typeof window !== 'undefined') {
  migrateLegacyStorage();
}

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      isDarkMode: false,
      isSidebarOpen: true,
      isMobileNavOpen: false,
      isNotesDrawerOpen: false,
      isShortcutsModalOpen: false,

      toggleTheme: () => {
        const next = !get().isDarkMode;
        set({ isDarkMode: next });
        if (typeof document !== 'undefined') {
          if (next) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      setTheme: (dark) => {
        set({ isDarkMode: dark });
        if (typeof document !== 'undefined') {
          if (dark) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
        }
      },

      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
      setSidebarOpen: (open) => set({ isSidebarOpen: open }),
      setMobileNavOpen: (open) => set({ isMobileNavOpen: open }),
      toggleNotesDrawer: () => set((s) => ({ isNotesDrawerOpen: !s.isNotesDrawerOpen })),
      setNotesDrawerOpen: (open) => set({ isNotesDrawerOpen: open }),
      toggleShortcutsModal: () => set((s) => ({ isShortcutsModalOpen: !s.isShortcutsModalOpen })),
      setShortcutsModalOpen: (open) => set({ isShortcutsModalOpen: open }),
    }),
    {
      name: 'hub-ui-store',
      partialize: (state) => ({ isDarkMode: state.isDarkMode }),
    }
  )
);