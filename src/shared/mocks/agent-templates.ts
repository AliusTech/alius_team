export interface AgentTemplate {
  id: string;
  name: string;
  specialty: string;
  description: string;
  model: string;
  capabilities: string[];
  tags: string[];
  iconBgColor: string;
  iconEmoji: string;
}

export const agentTemplates: AgentTemplate[] = [
  {
    id: 'frontend-dev',
    name: '前端开发者',
    specialty: 'UI/UX 实现',
    description: '专注于前端界面开发，熟悉 React、Vue、Angular 等主流框架',
    model: 'Sonnet 4.6',
    capabilities: ['代码', '设计', '重构'],
    tags: ['前端', 'React', 'CSS', 'Astro'],
    iconBgColor: '#e0ebff',
    iconEmoji: '💻',
  },
  {
    id: 'code-reviewer',
    name: '代码审查者',
    specialty: '质量控制',
    description: '深入分析代码质量，发现潜在问题并提供改进建议',
    model: 'Sonnet 4.6',
    capabilities: ['审查', '分析', '建议'],
    tags: ['代码审查', '质量', '最佳实践'],
    iconBgColor: '#e0f2fe',
    iconEmoji: '🔍',
  },
  {
    id: 'data-analyst',
    name: '数据分析师',
    specialty: '数据洞察',
    description: '擅长数据挖掘与分析，将复杂数据转化为可操作的洞察',
    model: 'Opus 4.8',
    capabilities: ['分析', '可视化', '建模'],
    tags: ['数据', 'Python', 'SQL', '统计'],
    iconBgColor: '#ede9fe',
    iconEmoji: '📊',
  },
  {
    id: 'architect',
    name: '架构师',
    specialty: '系统设计',
    description: '负责整体系统架构设计，确保系统的可扩展性和稳定性',
    model: 'Opus 4.8',
    capabilities: ['设计', '规划', '评审'],
    tags: ['架构', '微服务', 'DDD', '云原生'],
    iconBgColor: '#fef9c3',
    iconEmoji: '🏗️',
  },
  {
    id: 'content-creator',
    name: '内容创作者',
    specialty: '文案撰写',
    description: '擅长各类文案撰写，从技术文档到营销内容均可胜任',
    model: 'Sonnet 4.6',
    capabilities: ['写作', '编辑', '翻译'],
    tags: ['文案', '技术文档', 'SEO', '多语言'],
    iconBgColor: '#dcfce7',
    iconEmoji: '✍️',
  },
  {
    id: 'test-engineer',
    name: '测试工程师',
    specialty: '自动化测试',
    description: '编写和维护自动化测试套件，确保代码质量和功能稳定性',
    model: 'Haiku 4.5',
    capabilities: ['测试', '自动化', '报告'],
    tags: ['测试', 'Jest', 'Cypress', 'E2E'],
    iconBgColor: '#fee2e2',
    iconEmoji: '🧪',
  },
  {
    id: 'support-agent',
    name: '客服代理',
    specialty: '一线支持',
    description: '处理用户问题和工单，提供快速准确的技术支持',
    model: 'Haiku 4.5',
    capabilities: ['支持', '沟通', '解决'],
    tags: ['客服', '工单', 'FAQ', '用户支持'],
    iconBgColor: '#e0f2fe',
    iconEmoji: '🎧',
  },
  {
    id: 'devops-engineer',
    name: '运维工程师',
    specialty: '部署运维',
    description: '负责 CI/CD 流水线搭建、容器编排和基础设施管理',
    model: 'Sonnet 4.6',
    capabilities: ['部署', '监控', '优化'],
    tags: ['DevOps', 'Docker', 'K8s', 'CI/CD'],
    iconBgColor: '#e0ebff',
    iconEmoji: '⚙️',
  },
];
