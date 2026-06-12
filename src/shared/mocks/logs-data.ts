export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug';
  source: string;
  message: string;
}

export const logs: LogEntry[] = [
  { id: '1', timestamp: '2024-06-11 10:32:15', level: 'info', source: 'NewsBot', message: '每日 AI 新闻推送任务完成，共推送 5 条新闻' },
  { id: '2', timestamp: '2024-06-11 10:30:02', level: 'info', source: 'ReportBot', message: '周报生成任务启动，正在收集数据' },
  { id: '3', timestamp: '2024-06-11 10:28:44', level: 'error', source: 'ScrapeBot', message: '数据抓取失败：目标网站返回 403 Forbidden' },
  { id: '4', timestamp: '2024-06-11 10:25:00', level: 'warn', source: 'ScrapeBot', message: '抓取速率接近限制，自动降速至 2 req/s' },
  { id: '5', timestamp: '2024-06-11 10:20:33', level: 'info', source: 'MailBot', message: '邮件摘要推送完成，处理 12 封未读邮件' },
  { id: '6', timestamp: '2024-06-11 10:15:10', level: 'debug', source: 'CodeBot', message: '连接代码仓库成功，等待 PR 事件' },
  { id: '7', timestamp: '2024-06-11 10:10:05', level: 'info', source: 'ChatBot', message: '睡前故事生成完成，字数 1,234' },
  { id: '8', timestamp: '2024-06-11 10:05:00', level: 'error', source: 'ScrapeBot', message: '代理连接超时，自动重试中（第 2 次）' },
  { id: '9', timestamp: '2024-06-11 10:00:00', level: 'info', source: 'System', message: '所有 Agent 已完成初始化，系统就绪' },
  { id: '10', timestamp: '2024-06-11 09:55:30', level: 'warn', source: 'System', message: 'Token 消耗已达日配额 80%，请关注用量' },
];
