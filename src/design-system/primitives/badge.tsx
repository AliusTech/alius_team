import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

/** Variant class map for the Badge component. */
const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow',
        secondary: 'bg-secondary text-secondary-foreground',
        destructive: 'bg-destructive text-destructive-foreground shadow',
        outline: 'text-foreground border',
        running: 'bg-[#e0ebff] text-[#2d6ff2] dark:bg-blue-900/40 dark:text-blue-300',
        completed: 'bg-[#dcfce7] text-[#16a34a] dark:bg-green-900/40 dark:text-green-300',
        error: 'bg-[#fee2e2] text-[#dc2626] dark:bg-red-900/40 dark:text-red-300',
        idle: 'bg-[#f1f5f9] text-[#64748b] dark:bg-secondary dark:text-muted-foreground',
        warning: 'bg-[#fef9c3] text-[#d97706] dark:bg-yellow-900/40 dark:text-yellow-300',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/** Props for the Badge component, extending native div attributes with variant support. */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/** Small status indicator label with semantic color variants. */
const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(badgeVariants({ variant }), className)} {...props} />
  )
);
Badge.displayName = 'Badge';

export { Badge, badgeVariants };
