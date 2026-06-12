import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Zap,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';
import { NAV_ITEMS } from '@/shared/constants/routes';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Zap,
  ScrollText,
};

/** Tab-based bottom navigation bar for phone layout. */
export function BottomNavigation() {
  const { t } = useTranslation('common');
  const location = useLocation();

  return (
    <nav
      className="bg-card border-t border-border flex items-center justify-around px-2"
      style={{ paddingBottom: 'var(--safe-area-bottom)' }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = ICON_MAP[item.icon];
        const isActive = location.pathname === item.path ||
                        location.pathname.startsWith(item.path + '/');

        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              'flex flex-col items-center justify-center gap-1 py-2 rounded-lg min-w-0 flex-1',
              'transition-colors',
              isActive
                ? 'text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}
          >
            {Icon && <Icon className="size-5" />}
            <span className="text-xs truncate">{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}
