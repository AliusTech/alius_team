import { Navigate, useLocation } from 'react-router-dom';
import { useSessionStore } from '@/stores/session-store';
import { ROUTES } from '@/shared/constants/routes';

const DEV_BYPASS = import.meta.env.DEV;

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated } = useSessionStore();
  const location = useLocation();

  if (DEV_BYPASS) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
}