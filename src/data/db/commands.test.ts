import { describe, it, expect } from 'vitest';
import {
  userToDbUser,
  dbUserToUser,
  sessionToDbSession,
  dbSessionToSession,
  agentToDbAgent,
  dbAgentToAgent,
} from './commands';
import type { Session, User } from '@/features/auth/types';
import type { Agent } from '@/features/agents/types/agent';
import type { DbSession, DbAgent } from './types';

const mockUser: User = {
  id: 'u1',
  phone: '13800000000',
  name: 'Alice',
  email: 'alice@example.com',
  avatar: 'https://img/avatar.png',
};

const mockSession: Session = {
  accessToken: 'access-token-xyz',
  refreshToken: 'refresh-token-xyz',
  expiresAt: 1718000000000,
  user: mockUser,
};

const mockAgent: Agent = {
  agentId: 'agent-1',
  nodeId: 'node-1',
  name: 'Worker',
  role: 'developer',
  status: 'idle',
  connectionStatus: 'connected',
  soulName: 'soul',
  soulVersion: '1.0.0',
  currentTaskId: 'task-1',
  currentTaskTitle: 'Do something',
  modelName: 'gpt-4',
  tokensToday: 1234,
  tokensThisMonth: 5678,
  estimatedCostThisMonth: 9.99,
  lastActiveAt: '2026-06-12T10:00:00.000Z',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-06-12T12:00:00.000Z',
};

describe('userToDbUser / dbUserToUser', () => {
  it('converts camelCase to snake_case fields', () => {
    const db = userToDbUser(mockUser);
    expect(db).toEqual({
      id: 'u1',
      phone: '13800000000',
      name: 'Alice',
      email: 'alice@example.com',
      avatar: 'https://img/avatar.png',
    });
  });

  it('round-trips losslessly', () => {
    expect(dbUserToUser(userToDbUser(mockUser))).toEqual(mockUser);
  });

  it('preserves undefined optional fields', () => {
    const minimal: User = { id: 'u2', phone: '100' };
    const db = userToDbUser(minimal);
    expect(db.name).toBeUndefined();
    expect(db.email).toBeUndefined();
    expect(dbUserToUser(db)).toEqual(minimal);
  });
});

describe('sessionToDbSession / dbSessionToSession', () => {
  it('converts to snake_case with nested user', () => {
    const db = sessionToDbSession(mockSession);
    expect(db.access_token).toBe('access-token-xyz');
    expect(db.refresh_token).toBe('refresh-token-xyz');
    expect(db.expires_at).toBe(1718000000000);
    expect(db.user.id).toBe('u1');
  });

  it('round-trips losslessly', () => {
    expect(dbSessionToSession(sessionToDbSession(mockSession))).toEqual(mockSession);
  });
});

describe('agentToDbAgent / dbAgentToAgent', () => {
  it('converts camelCase to snake_case', () => {
    const db = agentToDbAgent(mockAgent);
    expect(db.agent_id).toBe('agent-1');
    expect(db.node_id).toBe('node-1');
    expect(db.connection_status).toBe('connected');
    expect(db.soul_name).toBe('soul');
    expect(db.tokens_today).toBe(1234);
    expect(db.estimated_cost_this_month).toBe(9.99);
  });

  it('converts ISO date strings to epoch milliseconds', () => {
    const db = agentToDbAgent(mockAgent);
    expect(db.last_active_at).toBe(new Date('2026-06-12T10:00:00.000Z').getTime());
    expect(db.created_at).toBe(new Date('2026-01-01T00:00:00.000Z').getTime());
    expect(db.updated_at).toBe(new Date('2026-06-12T12:00:00.000Z').getTime());
  });

  it('converts epoch milliseconds back to ISO strings', () => {
    const db = agentToDbAgent(mockAgent);
    const back = dbAgentToAgent(db);
    expect(back.lastActiveAt).toBe(mockAgent.lastActiveAt);
    expect(back.createdAt).toBe(mockAgent.createdAt);
    expect(back.updatedAt).toBe(mockAgent.updatedAt);
  });

  it('round-trips losslessly', () => {
    expect(dbAgentToAgent(agentToDbAgent(mockAgent))).toEqual(mockAgent);
  });

  it('preserves undefined optional fields', () => {
    const minimal: Agent = {
      agentId: 'a2',
      nodeId: 'n2',
      name: 'X',
      role: 'r',
      status: 'offline',
      connectionStatus: 'disconnected',
      soulName: 's',
      soulVersion: '1',
      tokensToday: 0,
      tokensThisMonth: 0,
      lastActiveAt: '2026-06-12T10:00:00.000Z',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-06-12T12:00:00.000Z',
    };
    const db = agentToDbAgent(minimal);
    expect(db.current_task_id).toBeUndefined();
    expect(db.model_name).toBeUndefined();
    expect(dbAgentToAgent(db)).toEqual(minimal);
  });
});

describe('DbSession / DbAgent type compatibility', () => {
  it('DbSession shape matches sessionToDbSession output', () => {
    const db: DbSession = sessionToDbSession(mockSession);
    expect(db.access_token).toBeTypeOf('string');
    expect(db.user.id).toBeTypeOf('string');
  });

  it('DbAgent shape matches agentToDbAgent output', () => {
    const db: DbAgent = agentToDbAgent(mockAgent);
    expect(db.agent_id).toBeTypeOf('string');
    expect(db.tokens_today).toBeTypeOf('number');
  });
});
