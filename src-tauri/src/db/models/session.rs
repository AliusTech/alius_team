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