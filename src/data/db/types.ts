// 数据库中的 Session 结构（与 Rust 端对应）
export interface DbSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: DbUser;
}

export interface DbUser {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatar?: string;
}

// 数据库中的 Agent 结构（与 Rust 端对应）
export interface DbAgent {
  agent_id: string;
  node_id: string;
  name: string;
  role: string;
  status: string;
  connection_status: string;
  soul_name: string;
  soul_version: string;
  current_task_id?: string;
  current_task_title?: string;
  model_name?: string;
  tokens_today: number;
  tokens_this_month: number;
  estimated_cost_this_month?: number;
  last_active_at: number;
  created_at: number;
  updated_at: number;
}