/** Application route path constants. */
export const ROUTES = {
  // Auth routes
  LOGIN: '/login',
  SMS_CODE: '/sms-code',

  // App routes
  APP: '/app',
  DASHBOARD: '/app/dashboard',
  AGENTS: '/app/agents',
  AGENT_DETAIL: '/app/agents/:agentId',
  AGENT_RUNS: '/app/agents/:agentId/runs',
  AGENT_TOKENS: '/app/agents/:agentId/tokens',
  AGENT_LOGS: '/app/agents/:agentId/logs',
  TASKS: '/app/tasks',
  TASK_DETAIL: '/app/tasks/:taskId',
  TASK_RUNS: '/app/tasks/:taskId/runs',
  TASK_LOGS: '/app/tasks/:taskId/logs',
  LOGS: '/app/logs',
  SETTINGS: '/app/settings',
  SETTINGS_ACCOUNT: '/app/settings/account',
  SETTINGS_SECURITY: '/app/settings/security',
  SETTINGS_DEVICES: '/app/settings/devices',
  SETTINGS_APPEARANCE: '/app/settings/appearance',
  SETTINGS_ABOUT: '/app/settings/about',
} as const;

/** Primary sidebar navigation items with i18n label key, path, and icon name. */
export const NAV_ITEMS = [
  {
    labelKey: 'common:nav.dashboard',
    path: ROUTES.DASHBOARD,
    icon: 'LayoutDashboard',
  },
  {
    labelKey: 'common:nav.agents',
    path: ROUTES.AGENTS,
    icon: 'Users',
  },
  {
    labelKey: 'common:nav.automation',
    path: ROUTES.TASKS,
    icon: 'Zap',
  },
  {
    labelKey: 'common:nav.logs',
    path: ROUTES.LOGS,
    icon: 'ScrollText',
  },
] as const;