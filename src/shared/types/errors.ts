// 统一错误类型定义

export type ErrorCode =
  // 认证相关
  | 'AUTH_INVALID_PHONE'
  | 'AUTH_INVALID_CODE'
  | 'AUTH_CODE_EXPIRED'
  | 'AUTH_CODE_USED'
  | 'AUTH_TOO_MANY_ATTEMPTS'
  | 'AUTH_SESSION_EXPIRED'
  | 'AUTH_UNAUTHORIZED'
  | 'AUTH_TOKEN_EXPIRED'
  | 'AUTH_REFRESH_FAILED'

  // Agent 连接相关
  | 'AGENT_CONNECTION_CODE_INVALID'
  | 'AGENT_CONNECTION_CODE_EXPIRED'
  | 'AGENT_CONNECTION_ALREADY_USED'
  | 'AGENT_CONNECTION_REJECTED'
  | 'AGENT_CONNECTION_RATE_LIMITED'
  | 'AGENT_NOT_FOUND'
  | 'AGENT_OFFLINE'
  | 'AGENT_ALREADY_CONNECTED'
  | 'AGENT_DISCONNECT_FAILED'

  // Agent 通信相关
  | 'AGENT_MESSAGE_FAILED'
  | 'AGENT_MESSAGE_TIMEOUT'
  | 'AGENT_MESSAGE_REJECTED'
  | 'AGENT_NOT_REACHABLE'
  | 'AGENT_BLOCKED'
  | 'AGENT_BROADCAST_FAILED'

  // Task 相关
  | 'TASK_NOT_FOUND'
  | 'TASK_ALREADY_RUNNING'
  | 'TASK_ALREADY_COMPLETED'
  | 'TASK_APPROVAL_REQUIRED'
  | 'TASK_APPROVAL_DENIED'
  | 'TASK_CANCEL_FAILED'

  // 网络相关
  | 'NETWORK_ERROR'
  | 'NETWORK_TIMEOUT'
  | 'NETWORK_OFFLINE'
  | 'NETWORK_CONNECTION_LOST'

  // 服务端错误
  | 'SERVER_ERROR'
  | 'SERVER_UNAVAILABLE'
  | 'SERVER_MAINTENANCE'
  | 'SERVER_OVERLOADED'

  // 客户端错误
  | 'CLIENT_ERROR'
  | 'CLIENT_INVALID_REQUEST'
  | 'CLIENT_VALIDATION_ERROR'
  | 'CLIENT_NOT_FOUND'
  | 'CLIENT_RATE_LIMITED';

export interface APIError {
  code: ErrorCode;
  message: string;
  statusCode: number;
  details?: Record<string, unknown>;
  timestamp: string;
  requestId?: string;
}

export interface ErrorResponse {
  error: APIError;
}

// 错误消息映射
export const ERROR_MESSAGES: Record<ErrorCode, string> = {
  // 认证相关
  AUTH_INVALID_PHONE: '请输入正确的手机号',
  AUTH_INVALID_CODE: '验证码错误',
  AUTH_CODE_EXPIRED: '验证码已过期',
  AUTH_CODE_USED: '验证码已使用',
  AUTH_TOO_MANY_ATTEMPTS: '尝试次数过多，请稍后再试',
  AUTH_SESSION_EXPIRED: '登录已过期，请重新登录',
  AUTH_UNAUTHORIZED: '未授权，请先登录',
  AUTH_TOKEN_EXPIRED: 'Token 已过期',
  AUTH_REFRESH_FAILED: 'Token 刷新失败',

  // Agent 连接相关
  AGENT_CONNECTION_CODE_INVALID: '连接码无效',
  AGENT_CONNECTION_CODE_EXPIRED: '连接码已过期',
  AGENT_CONNECTION_ALREADY_USED: '连接码已使用',
  AGENT_CONNECTION_REJECTED: '连接请求被拒绝',
  AGENT_CONNECTION_RATE_LIMITED: '连接请求过于频繁',
  AGENT_NOT_FOUND: 'Agent 不存在',
  AGENT_OFFLINE: 'Agent 已离线',
  AGENT_ALREADY_CONNECTED: 'Agent 已连接',
  AGENT_DISCONNECT_FAILED: 'Agent 断开连接失败',

  // Agent 通信相关
  AGENT_MESSAGE_FAILED: '消息发送失败',
  AGENT_MESSAGE_TIMEOUT: '消息发送超时',
  AGENT_MESSAGE_REJECTED: '消息被拒绝',
  AGENT_NOT_REACHABLE: 'Agent 无法访问',
  AGENT_BLOCKED: 'Agent 已被阻止',
  AGENT_BROADCAST_FAILED: '广播消息失败',

  // Task 相关
  TASK_NOT_FOUND: 'Task 不存在',
  TASK_ALREADY_RUNNING: 'Task 已在运行',
  TASK_ALREADY_COMPLETED: 'Task 已完成',
  TASK_APPROVAL_REQUIRED: '需要审批',
  TASK_APPROVAL_DENIED: '审批被拒绝',
  TASK_CANCEL_FAILED: '取消 Task 失败',

  // 网络相关
  NETWORK_ERROR: '网络错误',
  NETWORK_TIMEOUT: '网络超时',
  NETWORK_OFFLINE: '网络已断开',
  NETWORK_CONNECTION_LOST: '连接已丢失',

  // 服务端错误
  SERVER_ERROR: '服务器错误',
  SERVER_UNAVAILABLE: '服务不可用',
  SERVER_MAINTENANCE: '服务维护中',
  SERVER_OVERLOADED: '服务过载',

  // 客户端错误
  CLIENT_ERROR: '客户端错误',
  CLIENT_INVALID_REQUEST: '无效请求',
  CLIENT_VALIDATION_ERROR: '验证失败',
  CLIENT_NOT_FOUND: '资源不存在',
  CLIENT_RATE_LIMITED: '请求过于频繁',
};

// 获取错误消息
export function getErrorMessage(code: ErrorCode, fallback?: string): string {
  return ERROR_MESSAGES[code] || fallback || '未知错误';
}