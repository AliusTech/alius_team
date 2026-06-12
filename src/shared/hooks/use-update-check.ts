import { useEffect, useRef } from 'react';
import { check } from '@tauri-apps/plugin-updater';
import { useUpdateStore } from '@/stores/update-store';

/** Checks for application updates once on mount and populates the update store. */
export function useUpdateCheck() {
  const { setChecking, setAvailable, setUpToDate, setError } = useUpdateStore();
  const hasChecked = useRef(false);

  useEffect(() => {
    if (hasChecked.current) return;
    hasChecked.current = true;

    let cancelled = false;

    (async () => {
      setChecking();
      try {
        const update = await check();
        if (cancelled) return;

        if (update) {
          setAvailable({
            version: update.version,
            date: update.date?.toString(),
            body: update.body ?? undefined,
          });
        } else {
          setUpToDate();
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : String(err));
        }
      }
    })();

    return () => { cancelled = true; };
  }, [setChecking, setAvailable, setUpToDate, setError]);
}
