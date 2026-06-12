use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SessionData {
    pub access_token: String,
    pub refresh_token: String,
    pub expires_at: i64,
    pub user: UserData,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct UserData {
    pub id: String,
    pub phone: String,
    pub name: Option<String>,
    pub email: Option<String>,
    pub avatar: Option<String>,
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn session_data_round_trips_with_all_fields() {
        let session = SessionData {
            access_token: "a".to_string(),
            refresh_token: "r".to_string(),
            expires_at: 123,
            user: UserData {
                id: "u1".to_string(),
                phone: "100".to_string(),
                name: Some("Alice".to_string()),
                email: Some("a@b.c".to_string()),
                avatar: Some("img".to_string()),
            },
        };
        let json = serde_json::to_string(&session).unwrap();
        let back: SessionData = serde_json::from_str(&json).unwrap();
        assert_eq!(back.access_token, session.access_token);
        assert_eq!(back.refresh_token, session.refresh_token);
        assert_eq!(back.expires_at, session.expires_at);
        assert_eq!(back.user.id, session.user.id);
        assert_eq!(back.user.name, session.user.name);
    }

    #[test]
    fn session_data_round_trips_with_none_optionals() {
        let session = SessionData {
            access_token: "a".to_string(),
            refresh_token: "r".to_string(),
            expires_at: 0,
            user: UserData {
                id: "u".to_string(),
                phone: "1".to_string(),
                name: None,
                email: None,
                avatar: None,
            },
        };
        let json = serde_json::to_string(&session).unwrap();
        let back: SessionData = serde_json::from_str(&json).unwrap();
        assert!(back.user.name.is_none());
        assert!(back.user.email.is_none());
        assert!(back.user.avatar.is_none());
    }

    #[test]
    fn deserializes_from_typical_json() {
        let json = r#"{"access_token":"at","refresh_token":"rt","expires_at":99,"user":{"id":"u","phone":"p"}}"#;
        let session: SessionData = serde_json::from_str(json).unwrap();
        assert_eq!(session.access_token, "at");
        assert_eq!(session.user.id, "u");
        assert!(session.user.name.is_none());
    }
}