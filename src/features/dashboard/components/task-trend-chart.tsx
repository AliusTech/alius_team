import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/design-system/primitives/card';
import { ChartContainer, ChartTooltip } from '@/design-system/primitives/chart';
import { taskTrendData } from '@/shared/mocks/dashboard-data';

export function TaskTrendChart() {
  const { t } = useTranslation('dashboard');

  return (
    <Card>
      <CardHeader className="items-start">
        <div>
          <CardTitle>{t('charts.taskTrend.title')}</CardTitle>
          <CardDescription>{t('charts.taskTrend.description')}</CardDescription>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-[#2d6ff2]" />
            <span className="text-xs text-muted-foreground">{t('charts.taskTrend.tasks')}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="inline-block size-2 rounded-full bg-[#b8d4fe]" />
            <span className="text-xs text-muted-foreground">{t('charts.taskTrend.tokens')}</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="h-35 mt-3">
        <ChartContainer className="h-32">
          <AreaChart data={taskTrendData} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#94a3b8' }}
              tickLine={false}
              axisLine={false}
              width={30}
            />
            <ChartTooltip />
            <defs>
              <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2d6ff2" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2d6ff2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="fillTokens" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#b8d4fe" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#b8d4fe" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="tasks"
              stroke="#2d6ff2"
              strokeWidth={2}
              fill="url(#fillTasks)"
              name={t('charts.taskTrend.tasks')}
            />
            <Area
              type="monotone"
              dataKey="tokens"
              stroke="#b8d4fe"
              strokeWidth={2}
              fill="url(#fillTokens)"
              name={t('charts.taskTrend.tokens')}
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
