import { Link, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  LayoutDashboard,
  Users,
  Zap,
  ScrollText,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/shared/utils/cn';
import { useLayoutStore } from '@/stores/layout-store';
import { NAV_ITEMS } from '@/shared/constants/routes';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Zap,
  ScrollText,
};

/** Slide-out drawer navigation for phone layout, shown over a backdrop. */
export function DrawerNavigation() {
  const { t } = useTranslation('common');
  const location = useLocation();
  const { drawerOpen, setDrawerOpen } = useLayoutStore();

  if (!drawerOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50"
        onClick={() => setDrawerOpen(false)}
      />

      {/* Drawer */}
      <aside className="fixed left-0 top-0 bottom-0 z-50 w-72 bg-card border-r border-border shadow-lg animate-in slide-in-from-left">
        {/* Header */}
        <div className="h-14 border-b border-border flex items-center justify-between px-4">
          <h2 className="text-base font-semibold text-foreground">{t('app.name')}</h2>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 hover:bg-accent rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Close navigation menu"
          >
            <X className="size-5 text-muted-foreground" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="py-4">
          <ul className="space-y-1 px-2">
            {NAV_ITEMS.map((item) => {
              const Icon = ICON_MAP[item.icon];
              const isActive = location.pathname === item.path ||
                              location.pathname.startsWith(item.path + '/');

              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => setDrawerOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-3 py-3 rounded-xl transition-colors',
                      isActive
                        ? 'bg-primary/10 text-primary font-medium'
                        : 'text-foreground hover:bg-accent'
                    )}
                  >
                    {Icon && <Icon className={cn(
                      'size-5',
                      isActive ? 'text-primary' : 'text-muted-foreground'
                    )} />}
                    <span className="text-sm">{t(item.labelKey)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}
