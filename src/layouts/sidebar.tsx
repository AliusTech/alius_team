import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Zap,
  ScrollText,
  Settings,
  PanelLeftClose,
  PanelLeft,
  Plus,
  type LucideIcon,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import logoSvg from '@/assets/logo.svg';
import { cn } from '@/shared/utils/cn';
import { useLayoutStore } from '@/stores/layout-store';
import { useBreakpoint } from '@/shared/hooks/use-breakpoint';
import { NAV_ITEMS } from '@/shared/constants/routes';
import { recentTasks } from '@/shared/mocks/dashboard-data';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/design-system/primitives/tooltip';

const ICON_MAP: Record<string, LucideIcon> = {
  LayoutDashboard,
  Users,
  Zap,
  ScrollText,
  Settings,
};

const taskDotColors = ['#2d6ff2', '#7c3aed', '#d97706'];

type SidebarMode = 'expanded' | 'collapsed' | 'rail';

export function Sidebar() {
  const { t } = useTranslation('common');
  const location = useLocation();
  const { sidebarCollapsed, toggleSidebar } = useLayoutStore();
  const { isTablet } = useBreakpoint();
  const [hovering, setHovering] = useState(false);

  const mode: SidebarMode = isTablet ? (hovering ? 'expanded' : 'rail') : (sidebarCollapsed ? 'collapsed' : 'expanded');

  const handleMouseEnter = () => {
    if (!isTablet) return;
    setHovering(true);
  };

  const handleMouseLeave = () => {
    if (!isTablet) return;
    setHovering(false);
  };

  const widthClass =
    mode === 'expanded' ? 'w-[220px]' :
    mode === 'rail' ? 'w-[72px]' :
    'w-14';

  const showLabels = mode === 'expanded';
  const showRecentTasks = mode === 'expanded';
  const showUserProfileDetails = mode === 'expanded';

  return (
    <aside
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'h-full border-r border-border bg-card flex flex-col pb-3 shrink-0 overflow-hidden',
        'transition-[width] duration-300 ease-in-out',
        widthClass,
        mode === 'expanded' ? 'pl-2 pr-2' : 'items-center px-0'
      )}
      style={{ paddingTop: 'calc(1.5rem + var(--safe-area-top))' }}
    >
      {/* Logo */}
      <Link
        to="/app/dashboard"
        className={cn(
          'flex items-center shrink-0 mb-3',
          showLabels ? 'gap-2 h-11 px-2' : 'justify-center size-11'
        )}
      >
        <img src={logoSvg} alt="Alius" className="size-8 shrink-0" />
        <span className={cn(
          'text-sm font-semibold text-foreground whitespace-nowrap',
          'transition-[opacity] duration-200 ease-in-out',
          showLabels ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
        )}>
          Alius
        </span>
      </Link>

      {/* Separator after logo */}
      <div className={cn(
        'mb-3 h-px bg-border shrink-0',
        showLabels ? 'mx-1' : 'mx-0 w-8'
      )} />

      {/* Button list: new task + all nav items */}
      <div className={cn('flex flex-col gap-1.5 shrink-0', mode === 'expanded' ? 'w-full' : 'items-center')}>
        {/* New task button */}
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                type="button"
                onClick={() => useLayoutStore.getState().setNewTaskDialogOpen(true)}
                className={cn(
                  'flex items-center rounded-xl bg-[#2d6ff2] shrink-0',
                  'transition-[width,height,gap] duration-200 ease-in-out',
                  showLabels
                    ? 'w-full h-11 gap-2 px-3'
                    : 'size-11 justify-center'
                )}
              >
                <Plus className="size-5 text-white shrink-0" />
                <span className={cn(
                  'text-xs font-medium text-white whitespace-nowrap',
                  'transition-[opacity] duration-200 ease-in-out',
                  showLabels ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                )}>
                  {t('actions.newTask')}
                </span>
              </button>
            </TooltipTrigger>
            {!showLabels && (
              <TooltipContent side="right">
                {t('actions.newTask')}
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>

        {/* Nav items */}
        <TooltipProvider delayDuration={0}>
          {NAV_ITEMS.map((item) => {
            const Icon = ICON_MAP[item.icon];
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + '/');

            const navLink = (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex items-center rounded-xl transition-colors',
                  showLabels
                    ? 'gap-2 h-11 px-3 w-full'
                    : 'size-11 justify-center',
                  isActive ? 'bg-primary/10' : 'hover:bg-accent'
                )}
                title={showLabels ? undefined : t(item.labelKey)}
              >
                {Icon && (
                  <Icon className={cn(
                    'size-5 shrink-0',
                    isActive ? 'text-primary' : 'text-muted-foreground'
                  )} />
                )}
                <span className={cn(
                  'text-xs font-medium whitespace-nowrap',
                  'transition-[opacity] duration-200 ease-in-out',
                  isActive ? 'text-primary' : 'text-muted-foreground',
                  showLabels ? 'opacity-100' : 'opacity-0 w-0 overflow-hidden'
                )}>
                  {t(item.labelKey)}
                </span>
              </Link>
            );

            if (showLabels) {
              return <div key={item.path}>{navLink}</div>;
            }

            return (
              <Tooltip key={item.path}>
                <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                <TooltipContent side="right">{t(item.labelKey)}</TooltipContent>
              </Tooltip>
            );
          })}
        </TooltipProvider>
      </div>

      {/* Separator before recent tasks */}
      <div className={cn(
        'my-3 h-px bg-border shrink-0',
        showLabels ? 'mx-1' : 'mx-0 w-8'
      )} />

      {/* Recent tasks section — only visible when expanded */}
      <div className={cn(
        'transition-[opacity,max-height] duration-300 ease-in-out overflow-hidden',
        showRecentTasks ? 'opacity-100 max-h-50' : 'opacity-0 max-h-0'
      )}>
        <div className="mt-4">
          <p className="px-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {t('dashboard:recentTasks.title')}
          </p>
          <div className="flex flex-col gap-0 pt-1.5">
            {recentTasks.slice(0, 3).map((task, i) => (
              <button
                key={task.id}
                className="flex items-center gap-2 rounded-lg px-3 py-1.5 w-full hover:bg-accent"
              >
                <span
                  className="inline-block size-1.5 rounded-full shrink-0"
                  style={{ backgroundColor: taskDotColors[i % taskDotColors.length] }}
                />
                <span className="text-xs font-medium text-foreground truncate flex-1 text-left">
                  {task.name.length > 8 ? task.name.slice(0, 8) + '…' : task.name}
                </span>
                <span className="text-xs font-medium text-muted-foreground shrink-0">
                  {t('units.agentsShort', { count: task.agentCount })}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom section */}
      <div className={cn(
        'border-t border-border shrink-0',
        showLabels ? 'pt-3' : 'pt-2'
      )}>
        {/* Collapsed / Rail bottom icons */}
        <div className={cn(
          'flex flex-col gap-1.5 items-center',
          'transition-[opacity] duration-200 ease-in-out',
          !showLabels ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'
        )}>
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  onClick={toggleSidebar}
                  className="flex items-center justify-center size-11 rounded-xl hover:bg-accent"
                >
                  <PanelLeft className="size-4 text-muted-foreground" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">{t('nav.settings')}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <div className="flex items-center justify-center size-7 rounded-full bg-gradient-to-br from-[#5191fc] to-[#2d6ff2]">
            <span className="text-xs font-medium text-white">魏</span>
          </div>
        </div>

        {/* Expanded bottom user row */}
        <div className={cn(
          'flex items-center gap-2 px-1 pt-3',
          'transition-[opacity] duration-200 ease-in-out',
          showUserProfileDetails ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden py-0'
        )}>
          <div className="flex items-center justify-center size-7 rounded-full bg-gradient-to-br from-[#5191fc] to-[#2d6ff2] shrink-0">
            <span className="text-xs font-medium text-white">魏</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-foreground truncate">魏拓</p>
            <p className="text-xs text-muted-foreground">管理员</p>
          </div>
          <button
            onClick={toggleSidebar}
            className="flex items-center justify-center rounded-lg p-1.5 hover:bg-accent"
          >
            <PanelLeftClose className="size-3.5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </aside>
  );
}
