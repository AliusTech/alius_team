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

#[cfg(test)]
mod tests {
    use super::*;

    fn sample() -> AgentData {
        AgentData {
            agent_id: "a1".to_string(),
            node_id: "n1".to_string(),
            name: "A".to_string(),
            role: "r".to_string(),
            status: "idle".to_string(),
            connection_status: "connected".to_string(),
            soul_name: "s".to_string(),
            soul_version: "1".to_string(),
            current_task_id: Some("t1".to_string()),
            current_task_title: Some("task".to_string()),
            model_name: Some("gpt-4".to_string()),
            tokens_today: 10,
            tokens_this_month: 100,
            estimated_cost_this_month: Some(1.5),
            last_active_at: 1,
            created_at: 2,
            updated_at: 3,
        }
    }

    #[test]
    fn round_trips_with_all_fields() {
        let agent = sample();
        let json = serde_json::to_string(&agent).unwrap();
        let back: AgentData = serde_json::from_str(&json).unwrap();
        assert_eq!(back.agent_id, agent.agent_id);
        assert_eq!(back.tokens_today, agent.tokens_today);
        assert_eq!(back.estimated_cost_this_month, agent.estimated_cost_this_month);
        assert_eq!(back.current_task_id, agent.current_task_id);
    }

    #[test]
    fn round_trips_with_none_optionals() {
        let mut agent = sample();
        agent.current_task_id = None;
        agent.current_task_title = None;
        agent.model_name = None;
        agent.estimated_cost_this_month = None;
        let json = serde_json::to_string(&agent).unwrap();
        let back: AgentData = serde_json::from_str(&json).unwrap();
        assert!(back.current_task_id.is_none());
        assert!(back.model_name.is_none());
        assert!(back.estimated_cost_this_month.is_none());
    }

    #[test]
    fn deserializes_from_minimal_json() {
        let json = r#"{"agent_id":"a","node_id":"n","name":"x","role":"r","status":"idle","connection_status":"disconnected","soul_name":"s","soul_version":"1","tokens_today":0,"tokens_this_month":0,"last_active_at":1,"created_at":1,"updated_at":1}"#;
        let agent: AgentData = serde_json::from_str(json).unwrap();
        assert_eq!(agent.agent_id, "a");
        assert!(agent.current_task_id.is_none());
    }
}