export interface LoginRequest {
  phone: string;
}

export interface SendSMSCodeRequest {
  phone: string;
}

export interface VerifySMSCodeRequest {
  phone: string;
  code: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatar?: string;
}

export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}

export type AuthError = {
  code: string;
  message: string;
};