import { Outlet } from 'react-router-dom';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Topbar } from './topbar';
import { BottomNavigation } from './bottom-navigation';
import { useLayoutStore } from '@/stores/layout-store';
import { SelectAgentsDialog } from '@/features/agents/components/select-agents-dialog';
import { SettingsDialog } from '@/features/settings/components/settings-dialog';
import { NotificationsDialog } from '@/features/notifications/components/notifications-dialog';

export function PhoneLayout() {
  const { t } = useTranslation('common');
  const { bottomSheetOpen, setBottomSheetOpen, settingsDialogOpen, setSettingsDialogOpen, notificationsDialogOpen, setNotificationsDialogOpen, newTaskDialogOpen, setNewTaskDialogOpen } = useLayoutStore();

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-background">

      {/* Topbar */}
      <Topbar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto bg-background p-4">
        <Outlet />
      </main>

      {/* Bottom navigation */}
      <BottomNavigation />

      {/* Bottom sheet for inspector content */}
      {bottomSheetOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setBottomSheetOpen(false)}
          />
          <div className="fixed inset-x-0 bottom-0 z-50 bg-card border-t border-border shadow-lg rounded-t-xl">
            <div className="h-12 border-b border-border flex items-center justify-between px-4">
              <h2 className="text-sm font-semibold text-foreground">Details</h2>
              <button
                onClick={() => setBottomSheetOpen(false)}
                className="p-1.5 hover:bg-accent rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Close details panel"
              >
                <X className="size-4 text-muted-foreground" />
              </button>
            </div>
            <div
              className="h-64 overflow-y-auto p-4"
              style={{ paddingBottom: 'calc(var(--bottom-sheet-padding) + var(--safe-area-bottom))' }}
            >
              <div className="text-sm text-muted-foreground">
                {t('inspector.selectHint')}
              </div>
            </div>
          </div>
        </>
      )}

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
