import '@/i18n';

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { useSessionStore } from "@/stores/session-store";
import { useThemeEffect } from "@/shared/hooks/use-theme-effect";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  useThemeEffect();
  const loadSession = useSessionStore((state) => state.loadSession);
  const isLoaded = useSessionStore((state) => state.isLoaded);

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}