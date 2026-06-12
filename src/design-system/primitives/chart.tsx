import * as React from 'react';
import {
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '@/shared/utils/cn';

/** Props for the ChartContainer component. */
interface ChartContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement;
}

/** Responsive wrapper that scales a Recharts chart to fill its parent. */
function ChartContainer({ children, className, ...props }: ChartContainerProps) {
  return (
    <div className={cn('w-full h-full', className)} {...props}>
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

/** Props for the ChartTooltipContent component. */
interface ChartTooltipContentProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

/** Styled tooltip body that renders chart data point name, value, and color swatch. */
function ChartTooltipContent({ active, payload, label }: ChartTooltipContentProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-popover px-3 py-2 shadow-md">
      {label && (
        <p className="text-xs text-popover-foreground mb-1">{label}</p>
      )}
      {payload.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-xs">
          <span
            className="inline-block size-2 rounded-full"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-muted-foreground">{item.name}</span>
          <span className="font-medium text-popover-foreground">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/** Recharts Tooltip wrapper pre-wired with ChartTooltipContent and subtle cursor highlight. */
function ChartTooltip(props: React.ComponentProps<typeof Tooltip>) {
  return (
    <Tooltip
      content={<ChartTooltipContent />}
      cursor={{ fill: 'rgba(45, 111, 242, 0.04)' }}
      {...props}
    />
  );
}

export { ChartContainer, ChartTooltip, ChartTooltipContent };
