import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/shared/utils/cn';

/** Variant class map for the Card component. */
const cardVariants = cva(
  'rounded-xl border border-border bg-card',
  {
    variants: {
      variant: {
        default: 'p-4',
        flush: 'overflow-hidden',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

/** Container card with optional bordered and flush variants. */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof cardVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(cardVariants({ variant }), className)}
    {...props}
  />
));
Card.displayName = 'Card';

/** Card header section with optional bottom border. */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { bordered?: boolean }
>(({ className, bordered, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center justify-between',
      bordered && 'border-b border-border',
      className
    )}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

/** Card title rendered as an h3 heading. */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-xs font-medium text-card-foreground',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

/** Secondary descriptive text rendered below a card title. */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

/** Main content area of a card. */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn(className)} {...props} />
));
CardContent.displayName = 'CardContent';

/** Card footer section with optional top border. */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { bordered?: boolean }
>(({ className, bordered, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex items-center',
      bordered && 'border-t border-border',
      className
    )}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants };
