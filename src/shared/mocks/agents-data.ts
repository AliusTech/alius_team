export interface AgentItem {
  id: string;
  name: string;
  status: 'running' | 'idle' | 'error';
  todayTasks: number;
  tokenUsage: string;
  lastActive: string;
  description: string;
}

export const agents: AgentItem[] = [
  { id: '1', name: 'NewsBot', status: 'running', todayTasks: 8, tokenUsage: '12.4K', lastActive: '刚刚', description: 'AI 新闻聚合与推送' },
  { id: '2', name: 'ReportBot', status: 'running', todayTasks: 3, tokenUsage: '8.7K', lastActive: '5 分钟前', description: '自动化周报生成' },
  { id: '3', name: 'CodeBot', status: 'idle', todayTasks: 5, tokenUsage: '15.2K', lastActive: '30 分钟前', description: '代码审查与建议' },
  { id: '4', name: 'MailBot', status: 'idle', todayTasks: 2, tokenUsage: '4.1K', lastActive: '1 小时前', description: '邮件摘要与分类' },
  { id: '5', name: 'ScrapeBot', status: 'error', todayTasks: 1, tokenUsage: '6.8K', lastActive: '2 小时前', description: '数据抓取与清洗' },
  { id: '6', name: 'ChatBot', status: 'idle', todayTasks: 5, tokenUsage: '11.1K', lastActive: '15 分钟前', description: '智能客服对话' },
];
