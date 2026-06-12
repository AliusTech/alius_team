import { describe, it, expect } from 'vitest';
import { ERROR_MESSAGES, getErrorMessage, type ErrorCode } from './errors';

describe('ERROR_MESSAGES', () => {
  it('has a message for every known error code', () => {
    const codes: ErrorCode[] = [
      'AUTH_INVALID_PHONE',
      'AUTH_INVALID_CODE',
      'AUTH_CODE_EXPIRED',
      'AUTH_CODE_USED',
      'AUTH_TOO_MANY_ATTEMPTS',
      'AUTH_SESSION_EXPIRED',
      'AUTH_UNAUTHORIZED',
      'AUTH_TOKEN_EXPIRED',
      'AUTH_REFRESH_FAILED',
      'AGENT_CONNECTION_CODE_INVALID',
      'AGENT_CONNECTION_CODE_EXPIRED',
      'AGENT_CONNECTION_ALREADY_USED',
      'AGENT_CONNECTION_REJECTED',
      'AGENT_CONNECTION_RATE_LIMITED',
      'AGENT_NOT_FOUND',
      'AGENT_OFFLINE',
      'AGENT_ALREADY_CONNECTED',
      'AGENT_DISCONNECT_FAILED',
      'AGENT_MESSAGE_FAILED',
      'AGENT_MESSAGE_TIMEOUT',
      'AGENT_MESSAGE_REJECTED',
      'AGENT_NOT_REACHABLE',
      'AGENT_BLOCKED',
      'AGENT_BROADCAST_FAILED',
      'TASK_NOT_FOUND',
      'TASK_ALREADY_RUNNING',
      'TASK_ALREADY_COMPLETED',
      'TASK_APPROVAL_REQUIRED',
      'TASK_APPROVAL_DENIED',
      'TASK_CANCEL_FAILED',
      'NETWORK_ERROR',
      'NETWORK_TIMEOUT',
      'NETWORK_OFFLINE',
      'NETWORK_CONNECTION_LOST',
      'SERVER_ERROR',
      'SERVER_UNAVAILABLE',
      'SERVER_MAINTENANCE',
      'SERVER_OVERLOADED',
      'CLIENT_ERROR',
      'CLIENT_INVALID_REQUEST',
      'CLIENT_VALIDATION_ERROR',
      'CLIENT_NOT_FOUND',
      'CLIENT_RATE_LIMITED',
    ];
    for (const code of codes) {
      expect(ERROR_MESSAGES[code], `missing message for ${code}`).toBeTruthy();
    }
  });

  it('all messages are non-empty strings', () => {
    for (const [, msg] of Object.entries(ERROR_MESSAGES)) {
      expect(typeof msg).toBe('string');
      expect(msg.length).toBeGreaterThan(0);
    }
  });
});

describe('getErrorMessage', () => {
  it('returns the mapped message for a known code', () => {
    expect(getErrorMessage('AUTH_INVALID_CODE')).toBe('验证码错误');
  });

  it('returns fallback when code is not mapped', () => {
    expect(getErrorMessage('UNKNOWN_CODE' as ErrorCode, 'custom fallback')).toBe(
      'custom fallback'
    );
  });

  it('returns default unknown message when no fallback provided', () => {
    expect(getErrorMessage('UNKNOWN_CODE' as ErrorCode)).toBe('未知错误');
  });
});
