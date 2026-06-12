/** Database representation of a session (mirrors Rust side). */
export interface DbSession {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: DbUser;
}

/** Database representation of a user. */
export interface DbUser {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  avatar?: string;
}

/** Database representation of an agent (mirrors Rust side). */
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