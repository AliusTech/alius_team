export type AgentStatus =
  | 'idle'
  | 'working'
  | 'waiting'
  | 'paused'
  | 'failed'
  | 'completed'
  | 'offline';

export type ConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'pending'
  | 'reconnecting';

export interface Agent {
  agentId: string;
  nodeId: string;
  name: string;
  role: string;
  status: AgentStatus;
  connectionStatus: ConnectionStatus;
  soulName: string;
  soulVersion: string;
  currentTaskId?: string;
  currentTaskTitle?: string;
  modelName?: string;
  tokensToday: number;
  tokensThisMonth: number;
  estimatedCostThisMonth?: number;
  lastActiveAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentConnection {
  connectionId: string;
  code: string;
  status: AgentConnectionStatus;
  expiresAt: string;
  createdAt: string;
  claimedAgent?: ClaimedAgentInfo;
}

export type AgentConnectionStatus =
  | 'created'
  | 'waiting_for_agent'
  | 'claimed_by_agent'
  | 'waiting_approval'
  | 'approved'
  | 'connected'
  | 'expired'
  | 'rejected'
  | 'canceled'
  | 'invalid_code'
  | 'already_used'
  | 'rate_limited';

export interface ClaimedAgentInfo {
  name: string;
  role: string;
  soulName: string;
  soulVersion: string;
  platform: string;
  cliVersion: string;
  capabilities: string[];
  tools?: string[];
}

export interface CreateConnectionCodeResponse {
  connectionId: string;
  code: string;
  expiresAt: string;
  expiresIn: number;
}

export interface AgentConnectionStatusResponse {
  agentId: string;
  connectionId: string;
  status: ConnectionStatus;
  connectedAt?: string;
  disconnectedAt?: string;
  reconnectAttempts?: number;
}

// Agent 间通信
export interface AgentMessage {
  messageId: string;
  fromAgentId: string;
  toAgentId: string;
  messageType: string;
  payload: unknown;
  timestamp: string;
  delivered: boolean;
  deliveredAt?: string;
}

export interface SendMessageRequest {
  toAgentId: string;
  messageType: string;
  payload: unknown;
  priority?: 'high' | 'normal' | 'low';
}

export interface BroadcastMessageRequest {
  messageType: string;
  payload: unknown;
  targetRoles?: string[];
  targetCapabilities?: string[];
  excludeAgentIds?: string[];
}

// Agent 发现
export interface DiscoverAgentsRequest {
  status?: AgentStatus[];
  roles?: string[];
  capabilities?: string[];
  online?: boolean;
  limit?: number;
  offset?: number;
}

export interface AgentCapability {
  agentId: string;
  capabilities: string[];
  tools: string[];
  models: string[];
  maxConcurrentTasks: number;
  supportedLanguages?: string[];
}

// Agent 操作请求
export interface ConnectAgentRequest {
  connectionCode: string;
  agentInfo: ClaimedAgentInfo;
}

export interface DisconnectAgentRequest {
  reason?: string;
  notifyOthers?: boolean;
}