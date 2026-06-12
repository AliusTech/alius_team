export interface DashboardSummary {
  agents: AgentSummary;
  tasks: TaskSummary;
  tokenUsage: TokenUsageSummary;
}

export interface AgentSummary {
  online: number;
  working: number;
  idle: number;
  waiting: number;
  offline: number;
}

export interface TaskSummary {
  running: number;
  waitingApproval: number;
  failed: number;
  completed: number;
}

export interface TokenUsageSummary {
  today: number;
  thisMonth: number;
  estimatedCost: number;
}

export interface RecentAgentEvent {
  id: string;
  agentId: string;
  agentName: string;
  type: AgentEventType;
  timestamp: string;
  details?: string;
}

export type AgentEventType =
  | 'connected'
  | 'disconnected'
  | 'status_changed'
  | 'task_started'
  | 'task_completed'
  | 'task_failed';

export interface RecentErrorLog {
  id: string;
  agentId?: string;
  taskId?: string;
  message: string;
  timestamp: string;
  level: 'error' | 'critical';
}