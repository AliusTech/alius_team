import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/design-system/primitives/button';
import { Input } from '@/design-system/primitives/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/design-system/primitives/card';
import { useSendSMSCode } from '../hooks/use-send-sms-code';
import { useSessionStore } from '@/stores/session-store';
import { ROUTES } from '@/shared/constants/routes';

export function LoginPage() {
  const { t } = useTranslation('auth');
  const [phone, setPhone] = useState('');
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { sendCode, isLoading, error } = useSendSMSCode();
  const setSession = useSessionStore((s) => s.setSession);

  const validatePhone = (value: string): boolean => {
    const phoneRegex = /^1[3-9]\d{9}$/;
    if (!value) {
      setPhoneError(t('common:validation.phoneRequired'));
      return false;
    }
    if (!phoneRegex.test(value)) {
      setPhoneError(t('common:validation.phoneInvalid'));
      return false;
    }
    setPhoneError(null);
    return true;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhone(value);
    if (phoneError) {
      validatePhone(value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePhone(phone)) {
      return;
    }

    const success = await sendCode(phone);
    if (success) {
      navigate(ROUTES.SMS_CODE, { state: { phone } });
    }
  };

  const handleSkipLogin = async () => {
    const mockSession = {
      accessToken: 'dev-mock-access-token',
      refreshToken: 'dev-mock-refresh-token',
      expiresAt: Date.now() + 365 * 24 * 60 * 60 * 1000,
      user: {
        id: 'dev-user-001',
        phone: '13800000000',
        name: '开发者',
        avatar: undefined,
      },
    };
    await setSession(mockSession);
    navigate(ROUTES.DASHBOARD);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('login.title')}</CardTitle>
          <CardDescription>{t('login.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium">
                {t('login.phoneLabel')}
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder={t('login.phonePlaceholder')}
                value={phone}
                onChange={handlePhoneChange}
                error={phoneError || error || undefined}
                disabled={isLoading}
                className="text-lg"
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              loading={isLoading}
              disabled={phone.length !== 11}
            >
              {isLoading ? t('login.sending') : t('login.sendCode')}
            </Button>

            <p className="text-xs text-center text-muted-foreground">
              {t('login.helperText')}
            </p>

            <div className="pt-2 border-t">
              <button
                type="button"
                onClick={handleSkipLogin}
                className="w-full text-xs text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {t('login.skipLogin', '跳过登录（开发模式）')}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}