/** Aggregated dashboard data combining agent, task, and token usage summaries. */
export interface DashboardSummary {
  agents: AgentSummary;
  tasks: TaskSummary;
  tokenUsage: TokenUsageSummary;
}

/** Counts of agents by status category. */
export interface AgentSummary {
  online: number;
  working: number;
  idle: number;
  waiting: number;
  offline: number;
}

/** Counts of tasks by status category. */
export interface TaskSummary {
  running: number;
  waitingApproval: number;
  failed: number;
  completed: number;
}

/** Token consumption stats for today and this month. */
export interface TokenUsageSummary {
  today: number;
  thisMonth: number;
  estimatedCost: number;
}

/** A recent lifecycle event from an agent. */
export interface RecentAgentEvent {
  id: string;
  agentId: string;
  agentName: string;
  type: AgentEventType;
  timestamp: string;
  details?: string;
}

/** Types of agent lifecycle events. */
export type AgentEventType =
  | 'connected'
  | 'disconnected'
  | 'status_changed'
  | 'task_started'
  | 'task_completed'
  | 'task_failed';

/** A recent error or critical log entry. */
export interface RecentErrorLog {
  id: string;
  agentId?: string;
  taskId?: string;
  message: string;
  timestamp: string;
  level: 'error' | 'critical';
}