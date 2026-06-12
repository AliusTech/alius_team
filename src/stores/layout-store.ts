import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/** Manages UI layout state: sidebar, inspector, drawers, dialogs, and bottom sheet. */
export interface LayoutState {
  // Sidebar state
  sidebarCollapsed: boolean;
  sidebarWidth: number;

  // Inspector state
  inspectorCollapsed: boolean;
  inspectorWidth: number;

  // Phone-specific state
  drawerOpen: boolean;
  bottomSheetOpen: boolean;
  settingsSheetOpen: boolean;

  // Dialog state
  newTaskDialogOpen: boolean;
  settingsDialogOpen: boolean;
  notificationsDialogOpen: boolean;

  // Actions
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleInspector: () => void;
  setInspectorCollapsed: (collapsed: boolean) => void;
  setDrawerOpen: (open: boolean) => void;
  setBottomSheetOpen: (open: boolean) => void;
  setSettingsSheetOpen: (open: boolean) => void;
  setNewTaskDialogOpen: (open: boolean) => void;
  setSettingsDialogOpen: (open: boolean) => void;
  setNotificationsDialogOpen: (open: boolean) => void;
  resetLayout: () => void;
}

const DEFAULT_SIDEBAR_WIDTH = 220;
const DEFAULT_SIDEBAR_COLLAPSED_WIDTH = 56;
/** Width reserved for the collapsed sidebar icon rail. */
export const SIDEBAR_RAIL_WIDTH = 72;
const DEFAULT_INSPECTOR_WIDTH = 360;

/** Zustand store hook for reading and mutating layout state (persisted to localStorage). */
export const useLayoutStore = create<LayoutState>()(
  persist(
    (set) => ({
      // Initial state
      sidebarCollapsed: false,
      sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
      inspectorCollapsed: false,
      inspectorWidth: DEFAULT_INSPECTOR_WIDTH,
      drawerOpen: false,
      bottomSheetOpen: false,
      settingsSheetOpen: false,
      newTaskDialogOpen: false,
      settingsDialogOpen: false,
      notificationsDialogOpen: false,

      // Actions
      toggleSidebar: () =>
        set((state) => ({
          sidebarCollapsed: !state.sidebarCollapsed,
          sidebarWidth: state.sidebarCollapsed
            ? DEFAULT_SIDEBAR_WIDTH
            : DEFAULT_SIDEBAR_COLLAPSED_WIDTH,
        })),

      setSidebarCollapsed: (collapsed: boolean) =>
        set({
          sidebarCollapsed: collapsed,
          sidebarWidth: collapsed
            ? DEFAULT_SIDEBAR_COLLAPSED_WIDTH
            : DEFAULT_SIDEBAR_WIDTH,
        }),

      toggleInspector: () =>
        set((state) => ({
          inspectorCollapsed: !state.inspectorCollapsed,
        })),

      setInspectorCollapsed: (collapsed: boolean) =>
        set({
          inspectorCollapsed: collapsed,
        }),

      setDrawerOpen: (open: boolean) =>
        set({
          drawerOpen: open,
        }),

      setBottomSheetOpen: (open: boolean) =>
        set({
          bottomSheetOpen: open,
        }),

      setSettingsSheetOpen: (open: boolean) =>
        set({
          settingsSheetOpen: open,
        }),

      setNewTaskDialogOpen: (open: boolean) =>
        set({
          newTaskDialogOpen: open,
        }),

      setSettingsDialogOpen: (open: boolean) =>
        set({
          settingsDialogOpen: open,
        }),

      setNotificationsDialogOpen: (open: boolean) =>
        set({
          notificationsDialogOpen: open,
        }),

      resetLayout: () =>
        set({
          sidebarCollapsed: false,
          sidebarWidth: DEFAULT_SIDEBAR_WIDTH,
          inspectorCollapsed: false,
          inspectorWidth: DEFAULT_INSPECTOR_WIDTH,
          drawerOpen: false,
          bottomSheetOpen: false,
          settingsSheetOpen: false,
          newTaskDialogOpen: false,
          settingsDialogOpen: false,
          notificationsDialogOpen: false,
        }),
    }),
    {
      name: 'alius-layout-storage',
      partialize: (state) => ({
        sidebarCollapsed: state.sidebarCollapsed,
        inspectorCollapsed: state.inspectorCollapsed,
      }),
    }
  )
);