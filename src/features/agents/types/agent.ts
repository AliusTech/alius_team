/** Operational status of an agent. */
export type AgentStatus =
  | 'idle'
  | 'working'
  | 'waiting'
  | 'paused'
  | 'failed'
  | 'completed'
  | 'offline';

/** Connection status between the app and an agent. */
export type ConnectionStatus =
  | 'connected'
  | 'disconnected'
  | 'pending'
  | 'reconnecting';

/** Full agent entity with identity, status, and usage metadata. */
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

/** An agent connection record including claim and expiration info. */
export interface AgentConnection {
  connectionId: string;
  code: string;
  status: AgentConnectionStatus;
  expiresAt: string;
  createdAt: string;
  claimedAgent?: ClaimedAgentInfo;
}

/** Lifecycle status of an agent connection. */
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

/** Information about an agent that has claimed a connection code. */
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

/** Response after creating a new connection code. */
export interface CreateConnectionCodeResponse {
  connectionId: string;
  code: string;
  expiresAt: string;
  expiresIn: number;
}

/** Current connection status response for an agent. */
export interface AgentConnectionStatusResponse {
  agentId: string;
  connectionId: string;
  status: ConnectionStatus;
  connectedAt?: string;
  disconnectedAt?: string;
  reconnectAttempts?: number;
}

/** A message sent between agents. */
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

/** Request payload for sending a direct message to an agent. */
export interface SendMessageRequest {
  toAgentId: string;
  messageType: string;
  payload: unknown;
  priority?: 'high' | 'normal' | 'low';
}

/** Request payload for broadcasting a message to multiple agents. */
export interface BroadcastMessageRequest {
  messageType: string;
  payload: unknown;
  targetRoles?: string[];
  targetCapabilities?: string[];
  excludeAgentIds?: string[];
}

/** Request payload for discovering agents by filters. */
export interface DiscoverAgentsRequest {
  status?: AgentStatus[];
  roles?: string[];
  capabilities?: string[];
  online?: boolean;
  limit?: number;
  offset?: number;
}

/** Capability profile of an agent including tools and supported models. */
export interface AgentCapability {
  agentId: string;
  capabilities: string[];
  tools: string[];
  models: string[];
  maxConcurrentTasks: number;
  supportedLanguages?: string[];
}

/** Request payload for connecting an agent via a connection code. */
export interface ConnectAgentRequest {
  connectionCode: string;
  agentInfo: ClaimedAgentInfo;
}

/** Request payload for disconnecting an agent. */
export interface DisconnectAgentRequest {
  reason?: string;
  notifyOthers?: boolean;
}