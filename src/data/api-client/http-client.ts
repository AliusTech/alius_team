import { useSessionStore } from '@/stores/session-store';
import { API_ENDPOINTS } from './endpoints';
import type { ErrorCode, APIError, ErrorResponse } from '@/shared/types/errors';
import { getErrorMessage } from '@/shared/types/errors';

/** HTTP client error with classified error codes. */
export class HTTPClientError extends Error {
  public code: ErrorCode;
  public statusCode: number;
  public details?: Record<string, unknown>;
  public requestId?: string;

  constructor(
    code: ErrorCode,
    statusCode: number,
    details?: Record<string, unknown>,
    requestId?: string
  ) {
    super(getErrorMessage(code));
    this.name = 'HTTPClientError';
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
    this.requestId = requestId;
  }

  // 从 API 响应创建错误
  /** Creates an HTTPClientError from a structured API error response. */
  static fromAPIResponse(errorResponse: APIError): HTTPClientError {
    return new HTTPClientError(
      errorResponse.code,
      errorResponse.statusCode,
      errorResponse.details,
      errorResponse.requestId
    );
  }

  // 判断是否为认证错误
  /** Returns true if the error is authentication-related. */
  isAuthError(): boolean {
    return this.code.startsWith('AUTH_');
  }

  // 判断是否为网络错误
  /** Returns true if the error is network-related. */
  isNetworkError(): boolean {
    return this.code.startsWith('NETWORK_');
  }

  // 判断是否为服务器错误
  /** Returns true if the error is a server-side error. */
  isServerError(): boolean {
    return this.code.startsWith('SERVER_');
  }

  // 判断是否可重试
  /** Returns true if the request can be safely retried. */
  isRetryable(): boolean {
    return (
      this.isNetworkError() ||
      this.code === 'SERVER_UNAVAILABLE' ||
      this.code === 'SERVER_OVERLOADED' ||
      this.statusCode >= 500
    );
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  timeout?: number;
}

async function refreshAccessToken(): Promise<string> {
  const { session } = useSessionStore.getState();

  if (!session?.refreshToken) {
    throw new HTTPClientError('AUTH_UNAUTHORIZED', 401);
  }

  try {
    const response = await fetch(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refreshToken: session.refreshToken }),
    });

    if (!response.ok) {
      useSessionStore.getState().clearSession();
      throw new HTTPClientError('AUTH_REFRESH_FAILED', 401);
    }

    const data = await response.json();
    useSessionStore.getState().setSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      expiresAt: Date.now() + data.expiresIn * 1000,
      user: data.user,
    });

    return data.accessToken;
  } catch (error) {
    useSessionStore.getState().clearSession();
    throw new HTTPClientError('AUTH_REFRESH_FAILED', 401);
  }
}

// 解析错误响应
/** Parses an HTTP error response into a classified HTTPClientError. */
export async function parseErrorResponse(response: Response): Promise<HTTPClientError> {
  try {
    const errorData: ErrorResponse = await response.json();
    return HTTPClientError.fromAPIResponse(errorData.error);
  } catch {
    // 无法解析错误响应，使用通用错误
    let code: ErrorCode = 'SERVER_ERROR';

    if (response.status === 401) {
      code = 'AUTH_UNAUTHORIZED';
    } else if (response.status === 403) {
      code = 'AUTH_UNAUTHORIZED';
    } else if (response.status === 404) {
      code = 'CLIENT_NOT_FOUND';
    } else if (response.status === 429) {
      code = 'CLIENT_RATE_LIMITED';
    } else if (response.status >= 500) {
      code = 'SERVER_ERROR';
    } else if (response.status >= 400) {
      code = 'CLIENT_INVALID_REQUEST';
    }

    return new HTTPClientError(code, response.status);
  }
}

/** HTTP client with automatic token refresh and error classification. */
export async function httpClient<T = unknown>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    skipAuth = false,
    timeout = 30000,
  } = options;

  const requestHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    ...headers,
  };

  // 添加认证 header
  if (!skipAuth) {
    const { session } = useSessionStore.getState();

    if (session?.accessToken) {
      // 检查 Token 是否过期
      if (session.expiresAt <= Date.now()) {
        try {
          const newToken = await refreshAccessToken();
          requestHeaders['Authorization'] = `Bearer ${newToken}`;
        } catch (error) {
          if (error instanceof HTTPClientError) {
            throw error;
          }
          throw new HTTPClientError('AUTH_REFRESH_FAILED', 401);
        }
      } else {
        requestHeaders['Authorization'] = `Bearer ${session.accessToken}`;
      }
    }
  }

  const requestOptions: RequestInit = {
    method,
    headers: requestHeaders,
  };

  if (body && method !== 'GET') {
    requestOptions.body = JSON.stringify(body);
  }

  // 添加超时处理
  const controller = new AbortController();
  requestOptions.signal = controller.signal;

  const timeoutId = setTimeout(() => {
    controller.abort();
  }, timeout);

  try {
    const response = await fetch(url, requestOptions);

    clearTimeout(timeoutId);

    if (!response.ok) {
      const error = await parseErrorResponse(response);

      // 处理认证错误
      if (error.isAuthError() && response.status === 401) {
        useSessionStore.getState().clearSession();
      }

      throw error;
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return response.json();
  } catch (error) {
    clearTimeout(timeoutId);

    // 处理网络错误
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new HTTPClientError('NETWORK_ERROR', 0);
    }

    // 处理超时
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw new HTTPClientError('NETWORK_TIMEOUT', 0);
    }

    // 如果已经是 HTTPClientError，直接抛出
    if (error instanceof HTTPClientError) {
      throw error;
    }

    // 其他错误
    throw new HTTPClientError('CLIENT_ERROR', 0, {
      originalError: error instanceof Error ? error.message : String(error),
    });
  }
}