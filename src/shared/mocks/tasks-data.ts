export interface TaskItem {
  id: string;
  name: string;
  description: string;
  status: 'running' | 'completed' | 'error' | 'pending';
  agent: string;
  schedule: string;
  lastRun: string;
}

export const tasks: TaskItem[] = [
  { id: '1', name: '每日 AI 新闻推送', description: '关注当天 AI 领域动态，覆盖 AI coding 与其他智能技术', status: 'completed', agent: 'NewsBot', schedule: '每日 08:00', lastRun: '今日 08:00' },
  { id: '2', name: '每日英语单词', description: '推送 5 个高频实用英语单词，含音标与例句', status: 'completed', agent: 'NewsBot', schedule: '每日 07:00', lastRun: '今日 07:00' },
  { id: '3', name: '每周工作周报', description: '自动生成工作周报，总结本周重要任务与进展', status: 'running', agent: 'ReportBot', schedule: '每周五 17:00', lastRun: '运行中' },
  { id: '4', name: '数据抓取任务', description: '定时抓取目标网站数据并清洗入库', status: 'error', agent: 'ScrapeBot', schedule: '每日 06:00', lastRun: '今日 06:00' },
  { id: '5', name: '代码审查助手', description: '自动审查 PR 代码并给出建议', status: 'pending', agent: 'CodeBot', schedule: '触发式', lastRun: '等待触发' },
  { id: '6', name: '邮件摘要推送', description: '每日汇总未读邮件并生成摘要', status: 'completed', agent: 'MailBot', schedule: '每日 09:00', lastRun: '今日 09:00' },
  { id: '7', name: '睡前故事生成', description: '生成 3-5 分钟儿童睡前故事', status: 'completed', agent: 'ChatBot', schedule: '每日 20:00', lastRun: '昨日 20:00' },
  { id: '8', name: '经典电影推荐', description: '每周推荐经典电影，含剧情概要与推荐理由', status: 'pending', agent: 'NewsBot', schedule: '每周六 10:00', lastRun: '等待触发' },
];
