const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.alius.tech';
const WS_BASE_URL = import.meta.env.VITE_WS_BASE_URL || 'wss://api.alius.tech';

export const WS_ENDPOINTS = {
  NOTIFICATIONS: `${WS_BASE_URL}/ws/notifications`,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    SEND_SMS_CODE: `${API_BASE_URL}/api/v1/auth/sms/send`,
    VERIFY_SMS_CODE: `${API_BASE_URL}/api/v1/auth/sms/verify`,
    APPLE_LOGIN: `${API_BASE_URL}/api/v1/auth/icloud/login`,
    WECHAT_LOGIN: `${API_BASE_URL}/api/v1/auth/wechat/login`,
    REFRESH: `${API_BASE_URL}/api/v1/auth/refresh`,
    ME: `${API_BASE_URL}/api/v1/auth/me`,
  },
  HEALTH: `${API_BASE_URL}/api/v1/ops/health`,
  DASHBOARD: {
    SUMMARY: `${API_BASE_URL}/api/v1/dashboard/summary`,
    EVENTS: `${API_BASE_URL}/api/v1/dashboard/events`,
    ERRORS: `${API_BASE_URL}/api/v1/dashboard/errors`,
  },
  AGENTS: {
    // Agent 列表和详情
    LIST: `${API_BASE_URL}/api/v1/agents`,
    DETAIL: (id: string) => `${API_BASE_URL}/api/v1/agents/${id}`,

    // Agent 连接管理
    CONNECT: `${API_BASE_URL}/api/v1/agents/connect`,
    DISCONNECT: (id: string) => `${API_BASE_URL}/api/v1/agents/${id}/disconnect`,
    CONNECTION_STATUS: (id: string) => `${API_BASE_URL}/api/v1/agents/${id}/connection-status`,

    // Agent 接入流程
    CONNECTIONS: `${API_BASE_URL}/api/v1/agents/connections`,
    CREATE_CONNECTION_CODE: `${API_BASE_URL}/api/v1/agents/connections/code`,
    CONNECTION_DETAIL: (id: string) => `${API_BASE_URL}/api/v1/agents/connections/${id}`,
    APPROVE_CONNECTION: (id: string) => `${API_BASE_URL}/api/v1/agents/connections/${id}/approve`,
    REJECT_CONNECTION: (id: string) => `${API_BASE_URL}/api/v1/agents/connections/${id}/reject`,

    // Agent 间通信
    SEND_MESSAGE: `${API_BASE_URL}/api/v1/agents/messages`,
    MESSAGES: (agentId: string) => `${API_BASE_URL}/api/v1/agents/${agentId}/messages`,
    BROADCAST: `${API_BASE_URL}/api/v1/agents/broadcast`,

    // Agent 发现
    DISCOVER: `${API_BASE_URL}/api/v1/agents/discover`,
    CAPABILITIES: (id: string) => `${API_BASE_URL}/api/v1/agents/${id}/capabilities`,

    // Agent 数据
    USAGE: (id: string) => `${API_BASE_URL}/api/v1/agents/${id}/usage`,
    LOGS: (id: string) => `${API_BASE_URL}/api/v1/agents/${id}/logs`,
  },
  TASKS: {
    LIST: `${API_BASE_URL}/tasks`,
    DETAIL: (id: string) => `${API_BASE_URL}/tasks/${id}`,
    RUNS: (id: string) => `${API_BASE_URL}/tasks/${id}/runs`,
    LOGS: (id: string) => `${API_BASE_URL}/tasks/${id}/logs`,
    APPROVE: (id: string) => `${API_BASE_URL}/tasks/${id}/approve`,
    CANCEL: (id: string) => `${API_BASE_URL}/tasks/${id}/cancel`,
  },
  LOGS: {
    LIST: `${API_BASE_URL}/logs`,
    DETAIL: (id: string) => `${API_BASE_URL}/logs/${id}`,
  },
  SETTINGS: {
    GET: `${API_BASE_URL}/settings`,
    UPDATE: `${API_BASE_URL}/settings`,
    DEVICES: `${API_BASE_URL}/devices`,
    REVOKE_DEVICE: (id: string) => `${API_BASE_URL}/devices/${id}/revoke`,
  },
} as const;