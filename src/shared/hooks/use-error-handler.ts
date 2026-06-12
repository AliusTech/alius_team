import { useCallback } from 'react';
import { HTTPClientError } from '@/data/api-client/http-client';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

/** Optional callbacks for specific HTTP error categories. */
interface UseErrorHandlerOptions {
  onAuthError?: (error: HTTPClientError) => void;
  onNetworkError?: (error: HTTPClientError) => void;
  onServerError?: (error: HTTPClientError) => void;
  onGenericError?: (error: HTTPClientError) => void;
}

/** Centralized error handling hook — classifies HTTP errors and routes them to appropriate callbacks or defaults. */
export function useErrorHandler(options?: UseErrorHandlerOptions) {
  const navigate = useNavigate();

  const handleError = useCallback(
    (error: unknown, fallbackMessage?: string) => {
      // 如果是 HTTPClientError
      if (error instanceof HTTPClientError) {
        // 认证错误 - 跳转登录页
        if (error.isAuthError()) {
          if (options?.onAuthError) {
            options.onAuthError(error);
          } else {
            // 默认处理：跳转登录页
            navigate(ROUTES.LOGIN);
          }
          return;
        }

        // 网络错误
        if (error.isNetworkError()) {
          if (options?.onNetworkError) {
            options.onNetworkError(error);
          } else {
            // 默认处理：显示网络错误提示
            console.error('Network error:', error.message);
          }
          return;
        }

        // 服务器错误
        if (error.isServerError()) {
          if (options?.onServerError) {
            options.onServerError(error);
          } else {
            // 默认处理：显示服务器错误提示
            console.error('Server error:', error.message);
          }
          return;
        }

        // 其他错误
        if (options?.onGenericError) {
          options.onGenericError(error);
        } else {
          console.error('Error:', error.message);
        }
      }

      // 其他类型的错误
      const message = error instanceof Error ? error.message : fallbackMessage || '未知错误';
      console.error('Unhandled error:', message);
    },
    [navigate, options]
  );

  // 判断错误是否可重试
  const shouldRetry = useCallback((error: unknown): boolean => {
    if (error instanceof HTTPClientError) {
      return error.isRetryable();
    }
    return false;
  }, []);

  // 获取错误消息
  const getErrorDisplayMessage = useCallback(
    (error: unknown, fallback?: string): string => {
      if (error instanceof HTTPClientError) {
        return error.message;
      }
      if (error instanceof Error) {
        return error.message;
      }
      return fallback || '未知错误';
    },
    []
  );

  return {
    handleError,
    shouldRetry,
    getErrorDisplayMessage,
  };
}