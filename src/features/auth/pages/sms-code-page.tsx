import { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/design-system/primitives/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/design-system/primitives/card';
import { useVerifySMSCode } from '../hooks/use-verify-sms-code';
import { useSendSMSCode } from '../hooks/use-send-sms-code';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/utils/cn';
import { AnimatedIllustration } from '@/design-system/components/animated-illustration';

/** SMS verification code entry page with auto-submit and resend support. */
export function SMSCodePage() {
  const { t } = useTranslation('auth');
  const location = useLocation();
  const navigate = useNavigate();
  const phone = location.state?.phone || '';

  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const { verifyCode, isLoading, error } = useVerifySMSCode();
  const { sendCode, countdown, canResend } = useSendSMSCode();

  useEffect(() => {
    if (!phone) {
      navigate(ROUTES.LOGIN);
      return;
    }
    // Focus first input
    inputRefs.current[0]?.focus();
  }, [phone, navigate]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(-1);

    const newCode = [...code];
    newCode[index] = digit;
    setCode(newCode);

    // Auto-focus next input
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all digits entered
    if (newCode.every(d => d !== '') && newCode.join('').length === 6) {
      handleSubmit(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace') {
      if (!code[index] && index > 0) {
        // Focus previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData.length === 6) {
      const newCode = pastedData.split('');
      setCode(newCode);
      handleSubmit(pastedData);
    } else if (pastedData.length > 0) {
      const newCode = [...code];
      pastedData.split('').forEach((d, i) => {
        if (i < 6) newCode[i] = d;
      });
      setCode(newCode);
      // Focus next empty input or last input
      const nextEmptyIndex = newCode.findIndex(d => d === '');
      const focusIndex = nextEmptyIndex >= 0 ? nextEmptyIndex : 5;
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const handleSubmit = async (codeString?: string) => {
    const finalCode = codeString || code.join('');

    if (finalCode.length !== 6) {
      setCodeError(t('common:validation.codeRequired'));
      return;
    }

    setCodeError(null);
    const success = await verifyCode(phone, finalCode);

    if (success) {
      setShowSuccess(true);
      setTimeout(() => navigate(ROUTES.DASHBOARD), 1200);
    } else {
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    await sendCode(phone);
  };

  const handleBack = () => {
    navigate(ROUTES.LOGIN);
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted">
        <AnimatedIllustration
          name="sms-success"
          size="lg"
          loop={false}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{t('sms.title')}</CardTitle>
          <CardDescription>
            {t('sms.description', { phone })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Code input */}
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className={cn(
                    "w-12 h-12 text-center text-2xl font-semibold rounded-md border border-input bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    (codeError || error) && "border-destructive focus-visible:ring-destructive"
                  )}
                  disabled={isLoading}
                />
              ))}
            </div>

            {/* Error message */}
            {(codeError || error) && (
              <p className="text-sm text-center text-destructive">
                {codeError || error}
              </p>
            )}

            {/* Resend */}
            <div className="text-center">
              {canResend ? (
                <Button
                  variant="ghost"
                  onClick={handleResend}
                  disabled={isLoading}
                >
                  {t('sms.resend')}
                </Button>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {t('sms.countdown', { count: countdown })}
                </p>
              )}
            </div>

            {/* Back button */}
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-full"
              disabled={isLoading}
            >
              {t('sms.back')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}