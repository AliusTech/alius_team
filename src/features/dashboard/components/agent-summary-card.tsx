import { Users, Activity, Clock, UserCheck, UserX } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/design-system/primitives/card';
import type { AgentSummary } from '../types';

interface AgentSummaryCardProps {
  data: AgentSummary | undefined;
  isLoading: boolean;
}

export function AgentSummaryCard({ data, isLoading }: AgentSummaryCardProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Agent 状态
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Agent 状态
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Main stat */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold">{data?.online || 0}</p>
            <p className="text-sm text-muted-foreground">在线 Agent</p>
          </div>
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Activity className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Status breakdown */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2 p-2 rounded-md bg-green-50 dark:bg-green-950">
            <UserCheck className="w-4 h-4 text-green-600" />
            <div>
              <p className="text-sm font-medium">{data?.working || 0}</p>
              <p className="text-xs text-muted-foreground">工作中</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-md bg-blue-50 dark:bg-blue-950">
            <Clock className="w-4 h-4 text-blue-600" />
            <div>
              <p className="text-sm font-medium">{data?.idle || 0}</p>
              <p className="text-xs text-muted-foreground">空闲</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-md bg-yellow-50 dark:bg-yellow-950">
            <Clock className="w-4 h-4 text-yellow-600" />
            <div>
              <p className="text-sm font-medium">{data?.waiting || 0}</p>
              <p className="text-xs text-muted-foreground">等待确认</p>
            </div>
          </div>

          <div className="flex items-center gap-2 p-2 rounded-md bg-gray-50 dark:bg-gray-950">
            <UserX className="w-4 h-4 text-gray-600" />
            <div>
              <p className="text-sm font-medium">{data?.offline || 0}</p>
              <p className="text-xs text-muted-foreground">离线</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}