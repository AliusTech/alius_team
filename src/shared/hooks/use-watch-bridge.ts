import { useEffect, useCallback, useRef } from 'react';

interface WatchActionMessage {
  action: 'startTask' | 'stopTask' | 'retryTask' | 'requestData';
  taskId?: string;
}

interface WatchDashboard {
  agents: { id: string; name: string; status: string; taskCount: number }[];
  tasks: { id: string; name: string; status: string; progress?: number; agentCount: number; teamName: string }[];
  tokenUsage: { todayTokens: string; monthlyUsage: string; costEstimate: string };
  activeAgentCount: number;
  runningTaskCount: number;
}

type WatchActionHandler = (message: WatchActionMessage) => void;

/** Two-way bridge to a companion watch app — sends dashboard data and receives action commands. */
export function useWatchBridge() {
  const handlerRef = useRef<WatchActionHandler | null>(null);

  const sendToWatch = useCallback(async (dashboard: WatchDashboard) => {
    try {
      const { invoke } = await import('@tauri-apps/api/core');
      await invoke('send_to_watch', { data: JSON.stringify(dashboard) });
    } catch (e) {
      // Not running in Tauri or watch not available
      console.debug('[watch] send failed:', e);
    }
  }, []);

  const onWatchAction = useCallback((handler: WatchActionHandler) => {
    handlerRef.current = handler;
  }, []);

  useEffect(() => {
    let unlisten: (() => void) | undefined;

    (async () => {
      try {
        const { listen } = await import('@tauri-apps/api/event');
        unlisten = await listen<string>('watch:message', (event) => {
          try {
            const msg = JSON.parse(event.payload) as WatchActionMessage;
            handlerRef.current?.(msg);
          } catch {}
        });
      } catch {}
    })();

    return () => {
      unlisten?.();
    };
  }, []);

  return { sendToWatch, onWatchAction };
}
