import { useState, useCallback } from 'react';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Trash2, CheckSquare } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';

interface ListContextMenuProps {
  children: React.ReactNode;
  onDelete: () => void;
  onSelect?: () => void;
}

export function ListContextMenu({ children, onDelete, onSelect }: ListContextMenuProps) {
  const { t } = useTranslation('common');
  const [open, setOpen] = useState(false);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  }, []);

  return (
    <DropdownMenu.Root open={open} onOpenChange={setOpen}>
      <div onContextMenu={handleContextMenu}>{children}</div>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="start"
          sideOffset={2}
          className={cn(
            'z-50 min-w-[140px] overflow-hidden rounded-xl border',
            'bg-popover text-popover-foreground shadow-md',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          )}
        >
          <DropdownMenu.Item
            onSelect={() => {
              onDelete();
              setOpen(false);
            }}
            className={cn(
              'flex cursor-pointer items-center gap-2 px-3 py-2 text-xs outline-none',
              'transition-colors hover:bg-accent hover:text-accent-foreground text-destructive',
            )}
          >
            <Trash2 className="size-3.5" />
            <span>{t('deletion.deleteOne')}</span>
          </DropdownMenu.Item>
          {onSelect && (
            <>
              <DropdownMenu.Separator className="h-px bg-border" />
              <DropdownMenu.Item
                onSelect={() => {
                  onSelect();
                  setOpen(false);
                }}
                className={cn(
                  'flex cursor-pointer items-center gap-2 px-3 py-2 text-xs outline-none',
                  'transition-colors hover:bg-accent hover:text-accent-foreground',
                )}
              >
                <CheckSquare className="size-3.5" />
                <span>{t('deletion.enterSelectMode')}</span>
              </DropdownMenu.Item>
            </>
          )}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
