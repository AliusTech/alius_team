import { describe, it, expect, beforeEach } from 'vitest';
import { useLayoutStore, SIDEBAR_RAIL_WIDTH } from './layout-store';

beforeEach(() => {
  useLayoutStore.getState().resetLayout();
});

describe('useLayoutStore', () => {
  it('has default expanded state', () => {
    const state = useLayoutStore.getState();
    expect(state.sidebarCollapsed).toBe(false);
    expect(state.inspectorCollapsed).toBe(false);
    expect(state.drawerOpen).toBe(false);
  });

  it('toggleSidebar collapses and adjusts width', () => {
    useLayoutStore.getState().toggleSidebar();
    const state = useLayoutStore.getState();
    expect(state.sidebarCollapsed).toBe(true);
  });

  it('toggleSidebar twice restores expanded state', () => {
    useLayoutStore.getState().toggleSidebar();
    useLayoutStore.getState().toggleSidebar();
    expect(useLayoutStore.getState().sidebarCollapsed).toBe(false);
  });

  it('setSidebarCollapsed(true) collapses', () => {
    useLayoutStore.getState().setSidebarCollapsed(true);
    expect(useLayoutStore.getState().sidebarCollapsed).toBe(true);
  });

  it('setSidebarCollapsed(false) expands', () => {
    useLayoutStore.getState().setSidebarCollapsed(true);
    useLayoutStore.getState().setSidebarCollapsed(false);
    expect(useLayoutStore.getState().sidebarCollapsed).toBe(false);
  });

  it('toggleInspector toggles collapsed', () => {
    useLayoutStore.getState().toggleInspector();
    expect(useLayoutStore.getState().inspectorCollapsed).toBe(true);
    useLayoutStore.getState().toggleInspector();
    expect(useLayoutStore.getState().inspectorCollapsed).toBe(false);
  });

  it('setInspectorCollapsed sets state', () => {
    useLayoutStore.getState().setInspectorCollapsed(true);
    expect(useLayoutStore.getState().inspectorCollapsed).toBe(true);
  });

  it('setDrawerOpen sets drawer state', () => {
    useLayoutStore.getState().setDrawerOpen(true);
    expect(useLayoutStore.getState().drawerOpen).toBe(true);
  });

  it('setNewTaskDialogOpen sets dialog state', () => {
    useLayoutStore.getState().setNewTaskDialogOpen(true);
    expect(useLayoutStore.getState().newTaskDialogOpen).toBe(true);
  });

  it('setSettingsDialogOpen sets dialog state', () => {
    useLayoutStore.getState().setSettingsDialogOpen(true);
    expect(useLayoutStore.getState().settingsDialogOpen).toBe(true);
  });

  it('setNotificationsDialogOpen sets dialog state', () => {
    useLayoutStore.getState().setNotificationsDialogOpen(true);
    expect(useLayoutStore.getState().notificationsDialogOpen).toBe(true);
  });

  it('resetLayout restores all defaults', () => {
    useLayoutStore.getState().toggleSidebar();
    useLayoutStore.getState().toggleInspector();
    useLayoutStore.getState().setDrawerOpen(true);
    useLayoutStore.getState().setNewTaskDialogOpen(true);
    useLayoutStore.getState().resetLayout();
    const state = useLayoutStore.getState();
    expect(state.sidebarCollapsed).toBe(false);
    expect(state.inspectorCollapsed).toBe(false);
    expect(state.drawerOpen).toBe(false);
    expect(state.newTaskDialogOpen).toBe(false);
    expect(state.settingsDialogOpen).toBe(false);
    expect(state.notificationsDialogOpen).toBe(false);
  });

  it('exports SIDEBAR_RAIL_WIDTH constant', () => {
    expect(SIDEBAR_RAIL_WIDTH).toBe(72);
  });
});
