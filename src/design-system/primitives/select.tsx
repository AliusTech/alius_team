import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

/** A single option in a Select dropdown. */
export interface SelectOption<T extends string> {
  value: T;
  label: string;
}

/** Props for the Select component. */
export interface SelectProps<T extends string> {
  value: T;
  options: SelectOption<T>[];
  onChange: (value: T) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

/** Dropdown select built on Radix UI DropdownMenu with check-mark selection indicator. */
export function Select<T extends string>({
  value,
  options,
  onChange,
  placeholder,
  className,
  disabled,
}: SelectProps<T>) {
  const selected = options.find((o) => o.value === value);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild disabled={disabled}>
        <button
          className={cn(
            'inline-flex items-center justify-between gap-2 h-8 px-3 py-1.5',
            'rounded-lg border border-input bg-secondary text-xs text-foreground',
            'hover:bg-accent hover:text-accent-foreground',
            'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            'transition-colors disabled:opacity-50 disabled:pointer-events-none',
            className
          )}
        >
          <span className="truncate">
            {selected?.label ?? placeholder ?? 'Select...'}
          </span>
          <ChevronDown className="size-3.5 shrink-0 opacity-50" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          align="end"
          sideOffset={4}
          className={cn(
            'z-50 min-w-[8rem] overflow-hidden rounded-xl border',
            'bg-popover text-popover-foreground shadow-md',
            'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
            'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          )}
        >
          {options.map((option) => (
            <DropdownMenu.Item
              key={option.value}
              onSelect={() => onChange(option.value)}
              className={cn(
                'relative flex cursor-pointer items-center gap-2 px-2 py-1.5 text-xs outline-none',
                'transition-colors hover:bg-accent hover:text-accent-foreground',
                value === option.value && 'font-medium',
              )}
            >
              <Check
                className={cn(
                  'size-3.5 shrink-0',
                  value === option.value ? 'opacity-100' : 'opacity-0',
                )}
              />
              <span className="truncate">{option.label}</span>
            </DropdownMenu.Item>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
