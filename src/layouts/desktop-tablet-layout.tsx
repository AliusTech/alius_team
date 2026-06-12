import { Outlet } from 'react-router-dom';
import { Sidebar } from './sidebar';
import { Inspector } from './inspector';
import { FloatingControls } from './floating-controls';
import { useLayoutStore } from '@/stores/layout-store';
import { SelectAgentsDialog } from '@/features/agents/components/select-agents-dialog';
import { SettingsDialog } from '@/features/settings/components/settings-dialog';
import { NotificationsDialog } from '@/features/notifications/components/notifications-dialog';

export function DesktopTabletLayout() {
  const { inspectorCollapsed, newTaskDialogOpen, setNewTaskDialogOpen, settingsDialogOpen, setSettingsDialogOpen, notificationsDialogOpen, setNotificationsDialogOpen } = useLayoutStore();

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Sidebar — full-height */}
      <Sidebar />

      {/* Center workspace */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 relative">
        {/* Floating controls positioned at top-right of main content */}
        <FloatingControls />

        {/* Content area */}
        <div
          className="flex-1 overflow-y-auto bg-background p-6"
          style={{ paddingTop: 'calc(var(--safe-area-top, 0px) + 24px)' }}
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
