import { httpClient } from './http-client';
import { API_ENDPOINTS } from './endpoints';
import type {
  Agent,
  AgentConnection,
  AgentConnectionStatusResponse,
  CreateConnectionCodeResponse,
  AgentMessage,
  SendMessageRequest,
  BroadcastMessageRequest,
  DiscoverAgentsRequest,
  AgentCapability,
  ConnectAgentRequest,
  DisconnectAgentRequest,
} from '@/features/agents/types/agent';

/** Agent management API methods for listing, connecting, messaging, and discovery. */
export const agentsAPI = {
  // Agent 列表和详情
  getAgents: async (): Promise<Agent[]> => {
    return httpClient<Agent[]>(API_ENDPOINTS.AGENTS.LIST);
  },

  getAgentDetail: async (agentId: string): Promise<Agent> => {
    return httpClient<Agent>(API_ENDPOINTS.AGENTS.DETAIL(agentId));
  },

  // Agent 连接管理
  connectAgent: async (request: ConnectAgentRequest): Promise<Agent> => {
    return httpClient<Agent>(API_ENDPOINTS.AGENTS.CONNECT, {
      method: 'POST',
      body: request,
    });
  },

  disconnectAgent: async (agentId: string, request?: DisconnectAgentRequest): Promise<void> => {
    return httpClient(API_ENDPOINTS.AGENTS.DISCONNECT(agentId), {
      method: 'POST',
      body: request,
    });
  },

  getConnectionStatus: async (agentId: string): Promise<AgentConnectionStatusResponse> => {
    return httpClient<AgentConnectionStatusResponse>(
      API_ENDPOINTS.AGENTS.CONNECTION_STATUS(agentId)
    );
  },

  // Agent 接入流程
  getConnections: async (): Promise<AgentConnection[]> => {
    return httpClient<AgentConnection[]>(API_ENDPOINTS.AGENTS.CONNECTIONS);
  },

  createConnectionCode: async (): Promise<CreateConnectionCodeResponse> => {
    return httpClient<CreateConnectionCodeResponse>(
      API_ENDPOINTS.AGENTS.CREATE_CONNECTION_CODE,
      { method: 'POST' }
    );
  },

  getConnectionDetail: async (connectionId: string): Promise<AgentConnection> => {
    return httpClient<AgentConnection>(
      API_ENDPOINTS.AGENTS.CONNECTION_DETAIL(connectionId)
    );
  },

  approveConnection: async (connectionId: string): Promise<Agent> => {
    return httpClient<Agent>(
      API_ENDPOINTS.AGENTS.APPROVE_CONNECTION(connectionId),
      { method: 'POST' }
    );
  },

  rejectConnection: async (connectionId: string, reason?: string): Promise<void> => {
    return httpClient(
      API_ENDPOINTS.AGENTS.REJECT_CONNECTION(connectionId),
      {
        method: 'POST',
        body: { reason },
      }
    );
  },

  // Agent 间通信
  sendMessage: async (request: SendMessageRequest): Promise<AgentMessage> => {
    return httpClient<AgentMessage>(API_ENDPOINTS.AGENTS.SEND_MESSAGE, {
      method: 'POST',
      body: request,
    });
  },

  getMessages: async (agentId: string, limit?: number): Promise<AgentMessage[]> => {
    const url = `${API_ENDPOINTS.AGENTS.MESSAGES(agentId)}?limit=${limit || 50}`;
    return httpClient<AgentMessage[]>(url);
  },

  broadcastMessage: async (request: BroadcastMessageRequest): Promise<{ recipientCount: number }> => {
    return httpClient<{ recipientCount: number }>(API_ENDPOINTS.AGENTS.BROADCAST, {
      method: 'POST',
      body: request,
    });
  },

  // Agent 发现
  discoverAgents: async (request: DiscoverAgentsRequest): Promise<Agent[]> => {
    const params = new URLSearchParams();

    if (request.status) {
      params.append('status', request.status.join(','));
    }
    if (request.roles) {
      params.append('roles', request.roles.join(','));
    }
    if (request.capabilities) {
      params.append('capabilities', request.capabilities.join(','));
    }
    if (request.online !== undefined) {
      params.append('online', String(request.online));
    }
    if (request.limit) {
      params.append('limit', String(request.limit));
    }
    if (request.offset) {
      params.append('offset', String(request.offset));
    }

    const url = `${API_ENDPOINTS.AGENTS.DISCOVER}?${params.toString()}`;
    return httpClient<Agent[]>(url);
  },

  getAgentCapabilities: async (agentId: string): Promise<AgentCapability> => {
    return httpClient<AgentCapability>(
      API_ENDPOINTS.AGENTS.CAPABILITIES(agentId)
    );
  },

  // Agent 数据
  getAgentUsage: async (agentId: string): Promise<{ today: number; thisMonth: number; estimatedCost: number }> => {
    return httpClient(API_ENDPOINTS.AGENTS.USAGE(agentId));
  },

  getAgentLogs: async (agentId: string, limit?: number): Promise<{ logs: unknown[] }> => {
    const url = `${API_ENDPOINTS.AGENTS.LOGS(agentId)}?limit=${limit || 100}`;
    return httpClient(url);
  },
};