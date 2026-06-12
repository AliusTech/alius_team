import { useEffect } from 'react';

interface KeyboardDeleteHandlerProps {
  focusedId: string | null;
  onDelete: (id: string) => void;
  onExitSelectMode?: () => void;
  onSelectAll?: () => void;
  enabled?: boolean;
}

export function KeyboardDeleteHandler({
  focusedId,
  onDelete,
  onExitSelectMode,
  onSelectAll,
  enabled = true,
}: KeyboardDeleteHandlerProps) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (focusedId && !(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
          onDelete(focusedId);
        }
      }

      if (e.key === 'Escape') {
        onExitSelectMode?.();
      }

      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        if (!(e.target instanceof HTMLInputElement) && !(e.target instanceof HTMLTextAreaElement)) {
          e.preventDefault();
          onSelectAll?.();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [focusedId, onDelete, onExitSelectMode, onSelectAll, enabled]);

  return null;
}
