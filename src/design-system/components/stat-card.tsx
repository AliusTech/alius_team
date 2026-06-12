import type { LucideIcon } from 'lucide-react';
import { Card } from '@/design-system/primitives/card';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  iconBgColor?: string;
  className?: string;
}

export function StatCard({ title, value, subtitle, icon: Icon, iconBgColor = '#e0ebff', className }: StatCardProps) {
  return (
    <Card className={className}>
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{title}</p>
        {Icon && (
          <div
            className="flex size-6 items-center justify-center rounded-lg"
            style={{ backgroundColor: iconBgColor }}
          >
            <Icon className="size-4 text-muted-foreground" />
          </div>
        )}
      </div>
      <p className="mt-2 text-lg font-semibold text-foreground">
        {value}
      </p>
      {subtitle && (
        <p className="mt-0.5 text-xs text-muted-foreground">
          {subtitle}
        </p>
      )}
    </Card>
  );
}
