import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/data/api-client/auth-api';
import { useSessionStore } from '@/stores/session-store';
import { ROUTES } from '@/shared/constants/routes';

/** Hook to verify an SMS code and establish a user session. */
export function useVerifySMSCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setSession } = useSessionStore();

  const verifyCode = async (phone: string, code: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authAPI.verifySMSCode(phone, code);

      // Save session
      setSession({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: Date.now() + response.expiresIn * 1000,
        user: response.user,
      });

      // Navigate to dashboard
      navigate(ROUTES.DASHBOARD);

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to verify code';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    verifyCode,
    isLoading,
    error,
  };
}