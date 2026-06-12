use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct NotificationData {
    pub id: String,
    pub title: String,
    pub body: String,
    #[serde(default = "default_category")]
    pub category: String,
    #[serde(default = "default_priority")]
    pub priority: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub action_url: Option<String>,
    #[serde(default)]
    pub is_read: bool,
    pub created_at: i64,
    #[serde(default)]
    pub received_at: i64,
}

fn default_category() -> String {
    "system".to_string()
}

fn default_priority() -> String {
    "normal".to_string()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn round_trips_with_all_fields() {
        let n = NotificationData {
            id: "n1".to_string(),
            title: "Title".to_string(),
            body: "Body".to_string(),
            category: "task".to_string(),
            priority: "high".to_string(),
            action_url: Some("/app/tasks/1".to_string()),
            is_read: false,
            created_at: 100,
            received_at: 200,
        };
        let json = serde_json::to_string(&n).unwrap();
        let back: NotificationData = serde_json::from_str(&json).unwrap();
        assert_eq!(back.id, n.id);
        assert_eq!(back.category, "task");
        assert_eq!(back.priority, "high");
        assert_eq!(back.action_url, n.action_url);
    }

    #[test]
    fn deserializes_minimal_json_with_defaults() {
        let json = r#"{"id":"n1","title":"T","body":"B","created_at":1}"#;
        let n: NotificationData = serde_json::from_str(json).unwrap();
        assert_eq!(n.category, "system");
        assert_eq!(n.priority, "normal");
        assert!(n.action_url.is_none());
        assert!(!n.is_read);
        assert_eq!(n.received_at, 0);
    }
}
