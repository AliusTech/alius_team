import { useEffect, useRef } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { listen } from '@tauri-apps/api/event';
import { useSessionStore } from '@/stores/session-store';
import { useNotificationStore } from '@/stores/notification-store';
import type { PushNotification } from '@/data/realtime/types';

export function usePushConnection() {
  const isAuthenticated = useSessionStore((s) => s.isAuthenticated);
  const onReceived = useNotificationStore((s) => s.onReceived);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated) return;
    if (startedRef.current) return;
    startedRef.current = true;

    let unlisten: (() => void) | undefined;

    (async () => {
      try {
        unlisten = await listen<PushNotification>('notification:received', (event) => {
          onReceived(event.payload);
        });
      } catch (e) {
        console.debug('[push] failed to listen for notifications:', e);
      }

      try {
        await invoke('start_push_client');
        console.info('[push] client started');
      } catch (e) {
        console.warn('[push] failed to start:', e);
      }
    })();

    return () => {
      unlisten?.();
      if (startedRef.current) {
        invoke('stop_push_client').catch((e) => {
          console.debug('[push] failed to stop on cleanup:', e);
        });
        startedRef.current = false;
      }
    };
  }, [isAuthenticated, onReceived]);
}
