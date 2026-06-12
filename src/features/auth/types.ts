/** Request payload for initiating a login. */
export interface LoginRequest {
  phone: string;
}

/** Request payload for sending an SMS verification code. */
export interface SendSMSCodeRequest {
  phone: string;
}

/** Request payload for verifying an SMS code. */
export interface VerifySMSCodeRequest {
  phone: string;
  code: string;
}

/** Successful authentication response containing tokens and user info. */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
}

/** Authenticated user profile. */
export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatar?: string;
}

/** Active user session with tokens and expiration. */
export interface Session {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: User;
}

/** Authentication error with a machine-readable code and message. */
export type AuthError = {
  code: string;
  message: string;
};