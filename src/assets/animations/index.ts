import splashData from './splash.json';
import loadingPopupData from './loading-popup.json';
import loginHeroData from './login-hero.json';
import pullRefreshData from './pull-refresh.json';
import stepCompleteData from './step-complete.json';
import stepActiveData from './step-active.json';
import taskLaunchData from './task-launch.json';
import smsSuccessData from './sms-success.json';
import emptyTasksData from './empty-tasks.json';
import emptyAgentsData from './empty-agents.json';
import emptyNotificationsData from './empty-notifications.json';
import emptyLogsData from './empty-logs.json';
import errorStateData from './error-state.json';
import warningStateData from './warning-state.json';
import runningGearData from './running-gear.json';
import downloadProgressData from './download-progress.json';
import logoHoverData from './logo-hover.json';

export type AnimationName =
  | 'splash'
  | 'loading'
  | 'login-hero'
  | 'pull-refresh'
  | 'step-complete'
  | 'step-active'
  | 'task-launch'
  | 'sms-success'
  | 'no-tasks'
  | 'no-agents'
  | 'no-notifications'
  | 'no-logs'
  | 'error'
  | 'warning'
  | 'running'
  | 'download'
  | 'logo-hover';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const animations: Record<AnimationName, any> = {
  'splash': splashData,
  'loading': loadingPopupData,
  'login-hero': loginHeroData,
  'pull-refresh': pullRefreshData,
  'step-complete': stepCompleteData,
  'step-active': stepActiveData,
  'task-launch': taskLaunchData,
  'sms-success': smsSuccessData,
  'no-tasks': emptyTasksData,
  'no-agents': emptyAgentsData,
  'no-notifications': emptyNotificationsData,
  'no-logs': emptyLogsData,
  'error': errorStateData,
  'warning': warningStateData,
  'running': runningGearData,
  'download': downloadProgressData,
  'logo-hover': logoHoverData,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAnimationData(name: AnimationName): any {
  return animations[name];
}
