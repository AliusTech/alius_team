import { createHashRouter, Navigate } from 'react-router-dom';
import { DesktopTabletLayout } from '@/layouts/desktop-tablet-layout';
import { PhoneLayout } from '@/layouts/phone-layout';
import { useBreakpoint } from '@/shared/hooks/use-breakpoint';
import { AuthGuard } from '@/features/auth/auth-guard';
import { LoginPage } from '@/features/auth/pages/login-page';
import { SMSCodePage } from '@/features/auth/pages/sms-code-page';
import { DashboardPage } from '@/features/dashboard/pages/dashboard-page';
import { AgentsPage } from '@/features/agents/pages/agents-page';
import { TasksPage } from '@/features/tasks/pages/tasks-page';
import { LogsPage } from '@/features/logs/pages/logs-page';
import { SettingsPage } from '@/features/settings/pages/settings-page';

// Layout wrapper that chooses between desktop/tablet and phone layouts
function AppLayout() {
  const { isPhone } = useBreakpoint();

  return (
    <AuthGuard>
      {isPhone ? <PhoneLayout /> : <DesktopTabletLayout />}
    </AuthGuard>
  );
}

export const router = createHashRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/sms-code',
    element: <SMSCodePage />,
  },
  {
    path: '/',
    element: <Navigate to="/app/dashboard" replace />,
  },
  {
    path: '/app',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'agents',
        element: <AgentsPage />,
      },
      {
        path: 'agents/:agentId',
        element: <AgentsPage />,
      },
      {
        path: 'tasks',
        element: <TasksPage />,
      },
      {
        path: 'tasks/:taskId',
        element: <TasksPage />,
      },
      {
        path: 'logs',
        element: <LogsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);