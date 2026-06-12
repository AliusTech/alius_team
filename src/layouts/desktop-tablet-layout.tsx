import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Inspector } from './inspector';
import { FloatingControls } from './floating-controls';
import { useLayoutStore } from '@/stores/layout-store';
import { SelectAgentsDialog } from '@/features/agents/components/select-agents-dialog';
import { SettingsDialog } from '@/features/settings/components/settings-dialog';
import { NotificationsDialog } from '@/features/notifications/components/notifications-dialog';

/** Three-pane desktop/tablet layout with collapsible sidebar and inspector. */
export function DesktopTabletLayout() {
  const { inspectorCollapsed, newTaskDialogOpen, setNewTaskDialogOpen, settingsDialogOpen, setSettingsDialogOpen, notificationsDialogOpen, setNotificationsDialogOpen } = useLayoutStore();

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar — full-height */}
      <Sidebar />

      {/* Center workspace */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
        {/* Window drag region */}
        <div
          data-tauri-drag-region
          className="absolute top-0 left-0 right-0 z-10"
          style={{ height: 'calc(var(--safe-area-top) + var(--drag-region-height))' }}
        />

        {/* Floating controls positioned at top-right of main content */}
        <FloatingControls />

        {/* Content area */}
        <div
          className="flex-1 overflow-y-auto bg-background p-6"
          style={{ paddingTop: 'calc(var(--safe-area-top) + var(--content-offset))' }}
        >
          <Outlet />
        </div>
      </main>

      {/* Inspector — full-height */}
      {!inspectorCollapsed && <Inspector />}

      {/* Dialogs */}
      <SelectAgentsDialog
        open={newTaskDialogOpen}
        onClose={() => setNewTaskDialogOpen(false)}
      />
      <SettingsDialog
        open={settingsDialogOpen}
        onClose={() => setSettingsDialogOpen(false)}
      />
      <NotificationsDialog
        open={notificationsDialogOpen}
        onClose={() => setNotificationsDialogOpen(false)}
      />
    </div>
  );
}
