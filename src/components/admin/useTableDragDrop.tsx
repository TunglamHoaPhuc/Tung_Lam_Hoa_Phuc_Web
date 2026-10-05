'use client';

import React, { useState, useCallback } from 'react';

// 🪷 Biểu tượng tay nắm kéo thả 6 chấm hoàng kim chuẩn quốc tế
export function GripHandleIcon({ className = 'w-3.5 h-3.5' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <circle cx="9" cy="6" r="1.75" />
      <circle cx="15" cy="6" r="1.75" />
      <circle cx="9" cy="12" r="1.75" />
      <circle cx="15" cy="12" r="1.75" />
      <circle cx="9" cy="18" r="1.75" />
      <circle cx="15" cy="18" r="1.75" />
    </svg>
  );
}

export interface UseTableDragDropProps<T> {
  items: T[];
  setItems: (newItems: T[]) => void;
  setIsDirty?: (dirty: boolean) => void;
  onToast?: (msg: string) => void;
  getId?: (item: T, idx: number) => string | number;
}

export function useTableDragDrop<T>({
  items,
  setItems,
  setIsDirty,
  onToast,
  getId,
}: UseTableDragDropProps<T>) {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);
  const [dropPosition, setDropPosition] = useState<'above' | 'below' | null>(null);

  const resolveId = useCallback(
    (item: T, idx: number): string => {
      if (getId) return String(getId(item, idx));
      const anyItem = item as any;
      return String(anyItem?.id ?? anyItem?.code ?? anyItem?.slug ?? idx);
    },
    [getId]
  );

  const handleDragStart = useCallback(
    (e: React.DragEvent, id: string | number) => {
      const strId = String(id);
      setDraggedId(strId);
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', strId);
    },
    []
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, id: string | number) => {
      e.preventDefault();
      const strId = String(id);
      if (!draggedId || draggedId === strId) return;

      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      const midY = rect.top + rect.height / 2;
      const isAbove = e.clientY < midY;

      setDragOverId(strId);
      setDropPosition(isAbove ? 'above' : 'below');
    },
    [draggedId]
  );

  const handleDragLeave = useCallback(() => {
    // Không reset ngay để tránh chớp nháy khi di chuyển giữa các cell bên trong row
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetId: string | number) => {
      e.preventDefault();
      const strTargetId = String(targetId);

      if (!draggedId || draggedId === strTargetId) {
        setDraggedId(null);
        setDragOverId(null);
        setDropPosition(null);
        return;
      }

      const fromIdx = items.findIndex((it, idx) => resolveId(it, idx) === draggedId);
      if (fromIdx === -1) {
        setDraggedId(null);
        setDragOverId(null);
        setDropPosition(null);
        return;
      }

      const next = [...items];
      const [moved] = next.splice(fromIdx, 1);

      const toIdx = next.findIndex((it, idx) => resolveId(it, idx) === strTargetId);
      if (toIdx === -1) {
        setDraggedId(null);
        setDragOverId(null);
        setDropPosition(null);
        return;
      }

      if (dropPosition === 'below') {
        next.splice(toIdx + 1, 0, moved);
      } else {
        next.splice(toIdx, 0, moved);
      }

      setItems(next);
      if (setIsDirty) setIsDirty(true);
      if (onToast) {
        onToast('✨ Đã thay đổi thứ tự hàng! Hãy bấm Lưu Bảng Tính (Ctrl+S) để cập nhật.');
      }

      setDraggedId(null);
      setDragOverId(null);
      setDropPosition(null);
    },
    [draggedId, dropPosition, items, onToast, resolveId, setIsDirty, setItems]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverId(null);
    setDropPosition(null);
  }, []);

  const moveItem = useCallback(
    (index: number, direction: 'up' | 'down') => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return;
      const next = [...items];
      const [moved] = next.splice(index, 1);
      next.splice(targetIndex, 0, moved);
      setItems(next);
      if (setIsDirty) setIsDirty(true);
      if (onToast) {
        onToast('✨ Đã thay đổi thứ tự hàng! Hãy bấm Lưu Bảng Tính (Ctrl+S) để cập nhật.');
      }
    },
    [items, onToast, setIsDirty, setItems]
  );

  return {
    draggedId,
    dragOverId,
    dropPosition,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    moveItem,
  };
}
