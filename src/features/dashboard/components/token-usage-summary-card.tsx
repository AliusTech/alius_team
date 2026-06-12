import { Coins } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/primitives/card';
import type { TokenUsageSummary } from '../types';

interface TokenUsageSummaryCardProps {
  data: TokenUsageSummary | undefined;
  isLoading: boolean;
}

export function TokenUsageSummaryCard({ data, isLoading }: TokenUsageSummaryCardProps) {
  const { t } = useTranslation('dashboard');

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Coins className="w-5 h-5" />
            {t('tokenUsage.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3">
            <div className="h-20 bg-muted rounded"></div>
            <div className="h-16 bg-muted rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return num.toString();
  };

  const formatCost = (cost: number) => {
    return `$${cost.toFixed(2)}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Coins className="w-5 h-5" />
          {t('tokenUsage.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Today usage */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{formatNumber(data?.today || 0)}</p>
            <p className="text-sm text-muted-foreground">{t('tokenUsage.todayTokens')}</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Coins className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Usage breakdown */}
        <div className="space-y-2">
          <div className="flex justify-between items-center p-2 rounded-md bg-muted">
            <p className="text-sm text-muted-foreground">{t('tokenUsage.monthlyUsage')}</p>
            <p className="text-sm font-medium">{formatNumber(data?.thisMonth || 0)}</p>
          </div>

          <div className="flex justify-between items-center p-2 rounded-md bg-purple-50 dark:bg-purple-950">
            <p className="text-sm text-muted-foreground">{t('tokenUsage.estimatedCost')}</p>
            <p className="text-sm font-medium text-purple-600">
              {formatCost(data?.estimatedCost || 0)}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}