import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/design-system/primitives/card';
import { ChartContainer, ChartTooltip } from '@/design-system/primitives/chart';
import { agentCompletionData } from '@/shared/mocks/dashboard-data';

export function AgentCompletionChart() {
  const { t } = useTranslation('dashboard');

  return (
    <Card>
      <CardHeader className="items-start">
        <div>
          <CardTitle>{t('charts.agentCompletion.title')}</CardTitle>
          <CardDescription>{t('charts.agentCompletion.description')}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="h-35 mt-3">
        <ChartContainer className="h-32">
          <BarChart data={agentCompletionData} margin={{ top: 0, right: 0, left: -16, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
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
            <Bar
              dataKey="completed"
              fill="#2d6ff2"
              radius={[4, 4, 0, 0]}
              name={t('charts.agentCompletion.completed')}
              maxBarSize={40}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
