import { invoke } from '@tauri-apps/api/core';
import type { Session, User } from '@/features/auth/types';
import type { Agent } from '@/features/agents/types/agent';
import type { PushNotification } from '@/data/realtime/types';
import type { DbSession, DbAgent } from './types';

// ============ 类型转换函数 ============

/** Converts a frontend User to a database-compatible format. */
export function userToDbUser(user: User): { id: string; phone: string; name?: string; email?: string; avatar?: string } {
  return {
    id: user.id,
    phone: user.phone,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
  };
}

/** Converts a database User row to a frontend User. */
export function dbUserToUser(dbUser: { id: string; phone: string; name?: string; email?: string; avatar?: string }): User {
  return {
    id: dbUser.id,
    phone: dbUser.phone,
    name: dbUser.name,
    email: dbUser.email,
    avatar: dbUser.avatar,
  };
}

/** Converts a frontend Session to a database-compatible format. */
export function sessionToDbSession(session: Session): DbSession {
  return {
    access_token: session.accessToken,
    refresh_token: session.refreshToken,
    expires_at: session.expiresAt,
    user: userToDbUser(session.user),
  };
}

/** Converts a database Session row to a frontend Session. */
export function dbSessionToSession(dbSession: DbSession): Session {
  return {
    accessToken: dbSession.access_token,
    refreshToken: dbSession.refresh_token,
    expiresAt: dbSession.expires_at,
    user: dbUserToUser(dbSession.user),
  };
}

/** Converts a frontend Agent to a database-compatible format. */
export function agentToDbAgent(agent: Agent): DbAgent {
  return {
    agent_id: agent.agentId,
    node_id: agent.nodeId,
    name: agent.name,
    role: agent.role,
    status: agent.status,
    connection_status: agent.connectionStatus,
    soul_name: agent.soulName,
    soul_version: agent.soulVersion,
    current_task_id: agent.currentTaskId,
    current_task_title: agent.currentTaskTitle,
    model_name: agent.modelName,
    tokens_today: agent.tokensToday,
    tokens_this_month: agent.tokensThisMonth,
    estimated_cost_this_month: agent.estimatedCostThisMonth,
    last_active_at: new Date(agent.lastActiveAt).getTime(),
    created_at: new Date(agent.createdAt).getTime(),
    updated_at: new Date(agent.updatedAt).getTime(),
  };
}

/** Converts a database Agent row to a frontend Agent. */
export function dbAgentToAgent(dbAgent: DbAgent): Agent {
  return {
    agentId: dbAgent.agent_id,
    nodeId: dbAgent.node_id,
    name: dbAgent.name,
    role: dbAgent.role,
    status: dbAgent.status as Agent['status'],
    connectionStatus: dbAgent.connection_status as Agent['connectionStatus'],
    soulName: dbAgent.soul_name,
    soulVersion: dbAgent.soul_version,
    currentTaskId: dbAgent.current_task_id,
    currentTaskTitle: dbAgent.current_task_title,
    modelName: dbAgent.model_name,
    tokensToday: dbAgent.tokens_today,
    tokensThisMonth: dbAgent.tokens_this_month,
    estimatedCostThisMonth: dbAgent.estimated_cost_this_month,
    lastActiveAt: new Date(dbAgent.last_active_at).toISOString(),
    createdAt: new Date(dbAgent.created_at).toISOString(),
    updatedAt: new Date(dbAgent.updated_at).toISOString(),
  };
}

// ============ Session Commands ============

/** Persists a session to the local database. */
export async function saveSession(session: Session): Promise<void> {
  return invoke('save_session', { session: sessionToDbSession(session) });
}

/** Loads the persisted session from the local database. */
export async function getSession(): Promise<Session | null> {
  const data = await invoke<DbSession | null>('get_session');
  return data ? dbSessionToSession(data) : null;
}

/** Removes the persisted session from the local database. */
export async function clearSession(): Promise<void> {
  return invoke('clear_session');
}

/** Updates the access token and expiration in the persisted session. */
export async function updateAccessToken(accessToken: string, expiresAt: number): Promise<void> {
  return invoke('update_access_token', { accessToken, expiresAt });
}

// ============ Agent Commands ============

/** Persists a list of agents to the local database. */
export async function saveAgents(agents: Agent[]): Promise<void> {
  return invoke('save_agents', { agents: agents.map(agentToDbAgent) });
}

/** Loads all persisted agents from the local database. */
export async function getAgents(): Promise<Agent[]> {
  const data = await invoke<DbAgent[]>('get_agents');
  return data.map(dbAgentToAgent);
}

/** Removes all persisted agents from the local database. */
export async function clearAgents(): Promise<void> {
  return invoke('clear_agents');
}

/** Deletes a single agent by ID from the local database. */
export async function deleteAgent(agentId: string): Promise<void> {
  return invoke('delete_agent', { agentId });
}

/** Deletes multiple agents by their IDs. Returns the number of deleted rows. */
export async function deleteAgentsBatch(agentIds: string[]): Promise<number> {
  return invoke<number>('delete_agents_batch', { agentIds });
}

/** Returns the timestamp of the last agents cache update, or null if never cached. */
export async function getAgentsCacheTime(): Promise<number | null> {
  return invoke('get_agents_cache_time');
}

// ============ Notification Commands ============

/** Loads notifications from the local database with optional filtering. */
export async function getNotifications(limit = 50, offset = 0, unreadOnly = false): Promise<PushNotification[]> {
  return invoke<PushNotification[]>('get_notifications', { limit, offset, unreadOnly });
}

/** Marks a single notification as read. */
export async function markNotificationRead(id: string): Promise<void> {
  return invoke('mark_notification_read', { id });
}

/** Marks all notifications as read. */
export async function markAllNotificationsRead(): Promise<void> {
  return invoke('mark_all_notifications_read');
}

/** Deletes a single notification by ID. */
export async function deleteNotification(id: string): Promise<void> {
  return invoke('delete_notification', { id });
}

/** Deletes all notifications from the local database. */
export async function clearAllNotifications(): Promise<void> {
  return invoke('clear_all_notifications');
}

/** Returns the count of unread notifications. */
export async function getUnreadNotificationCount(): Promise<number> {
  return invoke<number>('get_unread_notification_count');
}