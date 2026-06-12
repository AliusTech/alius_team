use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AgentData {
    pub agent_id: String,
    pub node_id: String,
    pub name: String,
    pub role: String,
    pub status: String,
    pub connection_status: String,
    pub soul_name: String,
    pub soul_version: String,
    pub current_task_id: Option<String>,
    pub current_task_title: Option<String>,
    pub model_name: Option<String>,
    pub tokens_today: i64,
    pub tokens_this_month: i64,
    pub estimated_cost_this_month: Option<f64>,
    pub last_active_at: i64,
    pub created_at: i64,
    pub updated_at: i64,
}