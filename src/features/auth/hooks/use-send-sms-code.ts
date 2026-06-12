import { useState } from 'react';
import { authAPI } from '@/data/api-client/auth-api';

/** Hook to send an SMS verification code with a 60-second resend countdown. */
export function useSendSMSCode() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const sendCode = async (phone: string) => {
    setIsLoading(true);
    setError(null);

    try {
      await authAPI.sendSMSCode(phone);

      // Start countdown
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send SMS code';
      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sendCode,
    isLoading,
    error,
    countdown,
    canResend: countdown === 0,
  };
}