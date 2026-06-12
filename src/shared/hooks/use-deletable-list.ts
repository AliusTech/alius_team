import { useState, useCallback, useRef } from 'react';
import type { DeletableItem } from '@/shared/types/deletion';

interface DeletableListConfig<T extends DeletableItem> {
  items: T[];
  deleteOne: (id: string) => Promise<void>;
  deleteBatch: (ids: string[]) => Promise<void>;
  onItemsChange: (items: T[]) => void;
}

interface DeletableListReturn<T extends DeletableItem> {
  items: T[];
  selectedIds: Set<string>;
  isSelectMode: boolean;
  focusedId: string | null;
  enterSelectMode: () => void;
  exitSelectMode: () => void;
  toggleSelect: (id: string) => void;
  selectAll: () => void;
  setFocusedId: (id: string | null) => void;
  deleteOne: (id: string) => Promise<void>;
  deleteSelected: () => void;
  isConfirmOpen: boolean;
  pendingDeleteIds: string[];
  pendingDeleteName?: string;
  confirmDelete: () => Promise<void>;
  cancelDelete: () => void;
  undoAvailable: boolean;
  undoDelete: () => void;
}

export function useDeletableList<T extends DeletableItem>(
  config: DeletableListConfig<T>,
): DeletableListReturn<T> {
  const { items, deleteOne: deleteOneApi, deleteBatch: deleteBatchApi, onItemsChange } = config;

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isSelectMode, setIsSelectMode] = useState(false);
  const [focusedId, setFocusedId] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingDeleteIds, setPendingDeleteIds] = useState<string[]>([]);
  const [pendingDeleteName, setPendingDeleteName] = useState<string | undefined>();
  const [undoAvailable, setUndoAvailable] = useState(false);

  const undoSnapshot = useRef<{ items: T[]; ids: string[] } | null>(null);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const enterSelectMode = useCallback(() => setIsSelectMode(true), []);
  const exitSelectMode = useCallback(() => {
    setIsSelectMode(false);
    setSelectedIds(new Set());
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelectedIds(new Set(items.map((item) => item.id)));
  }, [items]);

  const performDelete = useCallback(
    async (ids: string[], _name?: string) => {
      const snapshot = items.filter((item) => !ids.includes(item.id));

      undoSnapshot.current = { items, ids };
      setUndoAvailable(true);
      onItemsChange(snapshot);

      if (undoTimer.current) clearTimeout(undoTimer.current);
      undoTimer.current = setTimeout(() => {
        undoSnapshot.current = null;
        setUndoAvailable(false);
      }, 3000);

      try {
        if (ids.length === 1) {
          await deleteOneApi(ids[0]);
        } else {
          await deleteBatchApi(ids);
        }
      } catch {
        if (undoSnapshot.current?.ids === ids) {
          onItemsChange(undoSnapshot.current.items);
          undoSnapshot.current = null;
          setUndoAvailable(false);
          if (undoTimer.current) clearTimeout(undoTimer.current);
        }
      }

      setIsConfirmOpen(false);
      setPendingDeleteIds([]);
      setPendingDeleteName(undefined);
      if (isSelectMode) {
        setIsSelectMode(false);
        setSelectedIds(new Set());
      }
    },
    [items, deleteOneApi, deleteBatchApi, onItemsChange, isSelectMode],
  );

  const deleteOne = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      const name = item && 'name' in item ? (item as Record<string, unknown>).name as string : undefined;
      setIsConfirmOpen(true);
      setPendingDeleteIds([id]);
      setPendingDeleteName(name);
    },
    [items],
  );

  const deleteSelected = useCallback(() => {
    if (selectedIds.size === 0) return;
    setIsConfirmOpen(true);
    setPendingDeleteIds(Array.from(selectedIds));
    setPendingDeleteName(undefined);
  }, [selectedIds]);

  const confirmDelete = useCallback(async () => {
    await performDelete(pendingDeleteIds, pendingDeleteName);
  }, [performDelete, pendingDeleteIds, pendingDeleteName]);

  const cancelDelete = useCallback(() => {
    setIsConfirmOpen(false);
    setPendingDeleteIds([]);
    setPendingDeleteName(undefined);
  }, []);

  const undoDelete = useCallback(() => {
    if (undoSnapshot.current) {
      onItemsChange(undoSnapshot.current.items);
      undoSnapshot.current = null;
      setUndoAvailable(false);
      if (undoTimer.current) clearTimeout(undoTimer.current);
    }
  }, [onItemsChange]);

  return {
    items,
    selectedIds,
    isSelectMode,
    focusedId,
    enterSelectMode,
    exitSelectMode,
    toggleSelect,
    selectAll,
    setFocusedId,
    deleteOne,
    deleteSelected,
    isConfirmOpen,
    pendingDeleteIds,
    pendingDeleteName,
    confirmDelete,
    cancelDelete,
    undoAvailable,
    undoDelete,
  };
}
