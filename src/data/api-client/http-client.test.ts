import { describe, it, expect } from 'vitest';
import { HTTPClientError, parseErrorResponse } from './http-client';
import type { APIError } from '@/shared/types/errors';

describe('HTTPClientError', () => {
  it('stores code, statusCode, and derives message from ERROR_MESSAGES', () => {
    const err = new HTTPClientError('AUTH_INVALID_CODE', 400);
    expect(err.code).toBe('AUTH_INVALID_CODE');
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('验证码错误');
    expect(err.name).toBe('HTTPClientError');
  });

  it('isAuthError detects AUTH_ prefix', () => {
    expect(new HTTPClientError('AUTH_UNAUTHORIZED', 401).isAuthError()).toBe(true);
    expect(new HTTPClientError('NETWORK_ERROR', 0).isAuthError()).toBe(false);
  });

  it('isNetworkError detects NETWORK_ prefix', () => {
    expect(new HTTPClientError('NETWORK_TIMEOUT', 0).isNetworkError()).toBe(true);
    expect(new HTTPClientError('SERVER_ERROR', 500).isNetworkError()).toBe(false);
  });

  it('isServerError detects SERVER_ prefix', () => {
    expect(new HTTPClientError('SERVER_UNAVAILABLE', 503).isServerError()).toBe(true);
    expect(new HTTPClientError('CLIENT_ERROR', 400).isServerError()).toBe(false);
  });

  it('isRetryable returns true for network errors', () => {
    expect(new HTTPClientError('NETWORK_ERROR', 0).isRetryable()).toBe(true);
  });

  it('isRetryable returns true for specific server codes', () => {
    expect(new HTTPClientError('SERVER_UNAVAILABLE', 503).isRetryable()).toBe(true);
    expect(new HTTPClientError('SERVER_OVERLOADED', 503).isRetryable()).toBe(true);
  });

  it('isRetryable returns true for any 5xx status', () => {
    expect(new HTTPClientError('SERVER_ERROR', 500).isRetryable()).toBe(true);
    expect(new HTTPClientError('SERVER_ERROR', 502).isRetryable()).toBe(true);
  });

  it('isRetryable returns false for 4xx client errors', () => {
    expect(new HTTPClientError('CLIENT_INVALID_REQUEST', 400).isRetryable()).toBe(false);
  });

  it('fromAPIResponse constructs error from APIError', () => {
    const apiError: APIError = {
      code: 'AUTH_TOKEN_EXPIRED',
      message: 'custom message',
      statusCode: 401,
      timestamp: '2026-06-12T00:00:00Z',
      requestId: 'req-123',
    };
    const err = HTTPClientError.fromAPIResponse(apiError);
    expect(err.code).toBe('AUTH_TOKEN_EXPIRED');
    expect(err.statusCode).toBe(401);
    expect(err.requestId).toBe('req-123');
  });
});

describe('parseErrorResponse', () => {
  function makeResponse(status: number, body: unknown): Response {
    return new Response(JSON.stringify(body), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  it('parses a well-formed error body', async () => {
    const apiError: APIError = {
      code: 'AUTH_UNAUTHORIZED',
      message: 'msg',
      statusCode: 401,
      timestamp: '2026-06-12T00:00:00Z',
    };
    const res = makeResponse(401, { error: apiError });
    const err = await parseErrorResponse(res);
    expect(err).toBeInstanceOf(HTTPClientError);
    expect(err.code).toBe('AUTH_UNAUTHORIZED');
    expect(err.statusCode).toBe(401);
  });

  it('falls back to AUTH_UNAUTHORIZED for 401 with unparseable body', async () => {
    const res = new Response('not json', { status: 401 });
    const err = await parseErrorResponse(res);
    expect(err.code).toBe('AUTH_UNAUTHORIZED');
    expect(err.statusCode).toBe(401);
  });

  it('falls back to CLIENT_NOT_FOUND for 404', async () => {
    const res = new Response('not json', { status: 404 });
    const err = await parseErrorResponse(res);
    expect(err.code).toBe('CLIENT_NOT_FOUND');
  });

  it('falls back to CLIENT_RATE_LIMITED for 429', async () => {
    const res = new Response('not json', { status: 429 });
    const err = await parseErrorResponse(res);
    expect(err.code).toBe('CLIENT_RATE_LIMITED');
  });

  it('falls back to SERVER_ERROR for 5xx', async () => {
    const res = new Response('not json', { status: 500 });
    const err = await parseErrorResponse(res);
    expect(err.code).toBe('SERVER_ERROR');
  });

  it('falls back to CLIENT_INVALID_REQUEST for other 4xx', async () => {
    const res = new Response('not json', { status: 422 });
    const err = await parseErrorResponse(res);
    expect(err.code).toBe('CLIENT_INVALID_REQUEST');
  });
});
