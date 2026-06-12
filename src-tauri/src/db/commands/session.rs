use crate::db::DbState;
use crate::db::models::session::{SessionData, UserData};
use chrono::Utc;
use rusqlite::{params, OptionalExtension};
use tauri::State;

#[tauri::command]
pub fn save_session(db: State<DbState>, session: SessionData) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let now = Utc::now().timestamp_millis();

    conn.execute(
        r#"
        INSERT OR REPLACE INTO sessions (
            id, access_token, refresh_token, expires_at,
            user_id, user_phone, user_name, user_email, user_avatar,
            created_at, updated_at
        ) VALUES (
            1, ?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8,
            COALESCE((SELECT created_at FROM sessions WHERE id = 1), ?9),
            ?10
        )
        "#,
        params![
            session.access_token,
            session.refresh_token,
            session.expires_at,
            session.user.id,
            session.user.phone,
            session.user.name,
            session.user.email,
            session.user.avatar,
            now,
            now,
        ],
    )
    .map_err(|e| format!("Failed to save session: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn get_session(db: State<DbState>) -> Result<Option<SessionData>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            r#"
            SELECT access_token, refresh_token, expires_at,
                   user_id, user_phone, user_name, user_email, user_avatar
            FROM sessions WHERE id = 1
            "#,
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let result = stmt
        .query_row([], |row| {
            Ok(SessionData {
                access_token: row.get(0)?,
                refresh_token: row.get(1)?,
                expires_at: row.get(2)?,
                user: UserData {
                    id: row.get(3)?,
                    phone: row.get(4)?,
                    name: row.get(5)?,
                    email: row.get(6)?,
                    avatar: row.get(7)?,
                },
            })
        })
        .optional()
        .map_err(|e| format!("Failed to get session: {}", e))?;

    Ok(result)
}

#[tauri::command]
pub fn clear_session(db: State<DbState>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM sessions WHERE id = 1", [])
        .map_err(|e| format!("Failed to clear session: {}", e))?;
    Ok(())
}

#[tauri::command]
pub fn update_access_token(
    db: State<DbState>,
    access_token: String,
    expires_at: i64,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let now = Utc::now().timestamp_millis();

    conn.execute(
        "UPDATE sessions SET access_token = ?1, expires_at = ?2, updated_at = ?3 WHERE id = 1",
        params![access_token, expires_at, now],
    )
    .map_err(|e| format!("Failed to update access token: {}", e))?;

    Ok(())
}