import * as React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { cn } from '@/shared/utils/cn';

/** Context provider that must wrap all tooltip instances. */
const TooltipProvider = TooltipPrimitive.Provider;

/** Root tooltip component managing open/close state. */
const Tooltip = TooltipPrimitive.Root;

/** Element that triggers the tooltip on hover or focus. */
const TooltipTrigger = TooltipPrimitive.Trigger;

/** Floating content panel rendered in a portal beside the trigger. */
const TooltipContent = React.forwardRef<
  React.ComponentRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        'z-50 overflow-hidden rounded-md bg-popover text-popover-foreground px-3 py-1.5 text-xs animate-in fade-in-0 zoom-in-95',
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
