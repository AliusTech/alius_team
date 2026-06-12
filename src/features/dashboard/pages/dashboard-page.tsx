import { LayoutDashboard } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { dashboardStats } from '@/shared/mocks/dashboard-data';
import { PageHeader } from '@/design-system/components';
import { StatCard } from '@/design-system/components/stat-card';
import { TaskTrendChart } from '../components/task-trend-chart';
import { AgentCompletionChart } from '../components/agent-completion-chart';
import { RecentTasksList } from '../components/recent-tasks-list';
import { AgentStatusList } from '../components/agent-status-list';

export function DashboardPage() {
  const { t } = useTranslation('dashboard');

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={t('page.title')}
        description={t('page.description')}
        icon={LayoutDashboard}
      />

      {/* Stat cards */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-3">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <StatCard
              key={stat.titleKey}
              title={t(stat.titleKey)}
              value={stat.value}
              subtitle={stat.subtitleKey ? t(stat.subtitleKey, stat.subtitleParams) : undefined}
              icon={Icon}
              iconBgColor={stat.iconBgColor}
            />
          );
        })}
      </div>

      {/* Charts */}
      <div className="flex flex-col gap-4">
        <TaskTrendChart />
        <AgentCompletionChart />
      </div>

      {/* Recent tasks */}
      <RecentTasksList />

      {/* Agent status */}
      <AgentStatusList />
    </div>
  );
}
