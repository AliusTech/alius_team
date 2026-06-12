import React from 'react';
import { Composition } from 'remotion';
import { Splash } from './compositions/splash';
import { LoadingPopup } from './compositions/loading-popup';
import { LoginHero } from './compositions/login-hero';
import { PullRefresh } from './compositions/pull-refresh';
import { StepComplete } from './compositions/step-complete';
import { StepActive } from './compositions/step-active';
import { TaskLaunch } from './compositions/task-launch';
import { SmsSuccess } from './compositions/sms-success';
import { EmptyTasks } from './compositions/empty-tasks';
import { EmptyAgents } from './compositions/empty-agents';
import { EmptyNotifications } from './compositions/empty-notifications';
import { EmptyLogs } from './compositions/empty-logs';
import { ErrorState } from './compositions/error-state';
import { WarningState } from './compositions/warning-state';
import { RunningGear } from './compositions/running-gear';
import { DownloadProgress } from './compositions/download-progress';
import { LogoHover } from './compositions/logo-hover';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition id="splash" component={Splash} durationInFrames={90} fps={30} width={400} height={400} />
      <Composition id="loading-popup" component={LoadingPopup} durationInFrames={60} fps={30} width={200} height={200} />
      <Composition id="login-hero" component={LoginHero} durationInFrames={60} fps={30} width={400} height={300} />
      <Composition id="pull-refresh" component={PullRefresh} durationInFrames={60} fps={30} width={100} height={100} />
      <Composition id="step-complete" component={StepComplete} durationInFrames={40} fps={30} width={60} height={60} />
      <Composition id="step-active" component={StepActive} durationInFrames={30} fps={30} width={60} height={60} />
      <Composition id="task-launch" component={TaskLaunch} durationInFrames={60} fps={30} width={200} height={200} />
      <Composition id="sms-success" component={SmsSuccess} durationInFrames={30} fps={30} width={100} height={100} />
      <Composition id="empty-tasks" component={EmptyTasks} durationInFrames={60} fps={30} width={200} height={200} />
      <Composition id="empty-agents" component={EmptyAgents} durationInFrames={60} fps={30} width={200} height={200} />
      <Composition id="empty-notifications" component={EmptyNotifications} durationInFrames={60} fps={30} width={200} height={200} />
      <Composition id="empty-logs" component={EmptyLogs} durationInFrames={60} fps={30} width={200} height={200} />
      <Composition id="error-state" component={ErrorState} durationInFrames={30} fps={30} width={200} height={200} />
      <Composition id="warning-state" component={WarningState} durationInFrames={30} fps={30} width={200} height={200} />
      <Composition id="running-gear" component={RunningGear} durationInFrames={60} fps={30} width={60} height={60} />
      <Composition id="download-progress" component={DownloadProgress} durationInFrames={60} fps={30} width={120} height={120} />
      <Composition id="logo-hover" component={LogoHover} durationInFrames={20} fps={30} width={60} height={60} />
    </>
  );
};
