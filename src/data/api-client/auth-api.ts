import { httpClient } from './http-client';
import { API_ENDPOINTS } from './endpoints';
import type {
  AuthResponse,
  User,
} from '@/features/auth/types';

/** Authentication API methods for SMS, Apple, and WeChat login flows. */
export const authAPI = {
  sendSMSCode: async (phone: string): Promise<void> => {
    await httpClient(API_ENDPOINTS.AUTH.SEND_SMS_CODE, {
      method: 'POST',
      body: { phone },
      skipAuth: true,
    });
  },

  verifySMSCode: async (phone: string, code: string): Promise<AuthResponse> => {
    return httpClient<AuthResponse>(API_ENDPOINTS.AUTH.VERIFY_SMS_CODE, {
      method: 'POST',
      body: { phone, code },
      skipAuth: true,
    });
  },

  appleLogin: async (identityToken: string): Promise<AuthResponse> => {
    return httpClient<AuthResponse>(API_ENDPOINTS.AUTH.APPLE_LOGIN, {
      method: 'POST',
      body: { identityToken },
      skipAuth: true,
    });
  },

  wechatLogin: async (code: string): Promise<AuthResponse> => {
    return httpClient<AuthResponse>(API_ENDPOINTS.AUTH.WECHAT_LOGIN, {
      method: 'POST',
      body: { code },
      skipAuth: true,
    });
  },

  refreshSession: async (refreshToken: string): Promise<AuthResponse> => {
    return httpClient<AuthResponse>(API_ENDPOINTS.AUTH.REFRESH, {
      method: 'POST',
      body: { refreshToken },
      skipAuth: true,
    });
  },

  getCurrentUser: async (): Promise<User> => {
    return httpClient<User>(API_ENDPOINTS.AUTH.ME);
  },

  healthCheck: async (): Promise<{ status: string }> => {
    return httpClient<{ status: string }>(API_ENDPOINTS.HEALTH, { skipAuth: true });
  },
};