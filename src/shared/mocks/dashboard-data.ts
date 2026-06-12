import {
  Bot,
  ListTodo,
  Loader2,
  AlertTriangle,
  Zap,
  type LucideIcon,
} from 'lucide-react';

export interface StatItem {
  titleKey: string;
  value: string;
  subtitleKey?: string;
  subtitleParams?: Record<string, unknown>;
  icon: LucideIcon;
  iconBgColor: string;
  trend?: { value: string; positive: boolean };
}

export const dashboardStats: StatItem[] = [
  { titleKey: 'stats.activeAgents', value: '3', subtitleKey: 'stats.total', subtitleParams: { count: 6 }, icon: Bot, iconBgColor: '#e0ebff' },
  { titleKey: 'stats.todayTasks', value: '24', subtitleKey: 'stats.comparedToYesterday', subtitleParams: { count: 4 }, icon: ListTodo, iconBgColor: '#dcfce7' },
  { titleKey: 'stats.running', value: '2', subtitleKey: 'stats.estimatedMinutes', subtitleParams: { count: 23 }, icon: Loader2, iconBgColor: '#fef9c3' },
  { titleKey: 'stats.failedTasks', value: '1', subtitleKey: 'stats.needsAttention', icon: AlertTriangle, iconBgColor: '#fee2e2' },
  { titleKey: 'stats.tokenConsumption', value: '58.3K', subtitleKey: 'stats.todayAccumulated', icon: Zap, iconBgColor: '#ede9fe' },
];

export interface RecentTask {
  id: string;
  name: string;
  status: 'running' | 'completed' | 'error' | 'idle';
  progress?: number;
  eta?: string;
  team: string;
  agentCount: number;
  time: string;
}

export const recentTasks: RecentTask[] = [
  { id: '1', name: '重新设计联系页面并更新 i18n 翻译', status: 'running', progress: 72, eta: '~8 min', team: '临时团队', agentCount: 2, time: '14:12' },
  { id: '2', name: '分析 Q2 用户留存率下降原因', status: 'running', progress: 45, eta: '~15 min', team: '临时团队', agentCount: 1, time: '13:50' },
  { id: '3', name: '更新 NPM 包并检查兼容性', status: 'completed', team: '临时团队', agentCount: 1, time: '12:30' },
  { id: '4', name: '生成本周社交媒体内容日历', status: 'completed', team: '临时团队', agentCount: 1, time: '11:00' },
  { id: '5', name: '处理客户工单 #4821 技术问题', status: 'error', team: '临时团队', agentCount: 1, time: '10:45' },
  { id: '6', name: '优化首页加载性能', status: 'idle', team: '临时团队', agentCount: 3, time: '—' },
];

export interface TaskTrendPoint {
  time: string;
  tasks: number;
  tokens: number;
}

export const taskTrendData: TaskTrendPoint[] = [
  { time: '00:00', tasks: 0, tokens: 20 },
  { time: '04:00', tasks: 1, tokens: 40 },
  { time: '08:00', tasks: 3, tokens: 80 },
  { time: '10:00', tasks: 7, tokens: 120 },
  { time: '12:00', tasks: 10, tokens: 180 },
  { time: '14:00', tasks: 8, tokens: 150 },
  { time: '16:00', tasks: 11, tokens: 200 },
  { time: '18:00', tasks: 9, tokens: 160 },
  { time: '20:00', tasks: 6, tokens: 100 },
];

export interface AgentCompletionPoint {
  name: string;
  completed: number;
}

export const agentCompletionData: AgentCompletionPoint[] = [
  { name: '前端开发者', completed: 8 },
  { name: '代码审查者', completed: 16 },
  { name: '数据分析师', completed: 22 },
  { name: '客服代理', completed: 28 },
];

export interface AgentStatus {
  id: string;
  name: string;
  taskCount: number;
  status: 'active' | 'idle' | 'error';
  avatarBg: string;
  icon: LucideIcon;
}

export const agentStatusData: AgentStatus[] = [
  { id: '1', name: '前端开发者', taskCount: 8, status: 'active', avatarBg: 'rgba(45,111,242,0.08)', icon: Bot },
  { id: '2', name: '代码审查者', taskCount: 5, status: 'idle', avatarBg: 'rgba(2,132,199,0.08)', icon: Bot },
  { id: '3', name: '数据分析师', taskCount: 3, status: 'active', avatarBg: 'rgba(124,58,237,0.08)', icon: Bot },
  { id: '4', name: '内容创作者', taskCount: 6, status: 'idle', avatarBg: 'rgba(217,119,6,0.08)', icon: Bot },
  { id: '5', name: '客服代理', taskCount: 14, status: 'active', avatarBg: 'rgba(22,163,74,0.08)', icon: Bot },
  { id: '6', name: '问题诊断', taskCount: 2, status: 'error', avatarBg: 'rgba(220,38,38,0.08)', icon: Bot },
];
