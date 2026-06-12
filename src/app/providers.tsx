import '@/i18n';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSessionStore } from "@/stores/session-store";
import { useNotificationStore } from "@/stores/notification-store";
import { useThemeEffect } from "@/shared/hooks/use-theme-effect";
import { useUpdateCheck } from "@/shared/hooks/use-update-check";
import { usePushConnection } from "@/shared/hooks/use-push-connection";
import { UpdateDialog } from "@/features/settings/components/update-dialog";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

function UpdateChecker() {
  useUpdateCheck();
  return <UpdateDialog />;
}

function PushNotifications() {
  usePushConnection();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  useThemeEffect();
  const loadSession = useSessionStore((state) => state.loadSession);
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const isLoaded = useSessionStore((state) => state.isLoaded);
  const loadNotifications = useNotificationStore((s) => s.loadNotifications);
  const loadUnreadCount = useNotificationStore((s) => s.loadUnreadCount);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadNotifications();
  }, [isAuthenticated, loadNotifications]);

  useEffect(() => {
    if (!isAuthenticated) return;
    loadUnreadCount();
  }, [isAuthenticated, loadUnreadCount]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <UpdateChecker />
      <PushNotifications />
      {children}
    </QueryClientProvider>
  );
}
