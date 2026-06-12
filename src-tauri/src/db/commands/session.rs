use crate::db::DbState;
use crate::db::models::session::{SessionData, UserData};
use chrono::Utc;
use rusqlite::{params, Connection, OptionalExtension};
use tauri::State;

/// Persists the session data, replacing any existing row.
pub fn save_session_inner(conn: &Connection, session: &SessionData) -> Result<(), String> {
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

/// Returns the stored session, if any.
pub fn get_session_inner(conn: &Connection) -> Result<Option<SessionData>, String> {
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

/// Deletes the stored session.
pub fn clear_session_inner(conn: &Connection) -> Result<(), String> {
    conn.execute("DELETE FROM sessions WHERE id = 1", [])
        .map_err(|e| format!("Failed to clear session: {}", e))?;
    Ok(())
}

/// Updates the access token and expiry for the current session.
pub fn update_access_token_inner(
    conn: &Connection,
    access_token: &str,
    expires_at: i64,
) -> Result<(), String> {
    let now = Utc::now().timestamp_millis();

    conn.execute(
        "UPDATE sessions SET access_token = ?1, expires_at = ?2, updated_at = ?3 WHERE id = 1",
        params![access_token, expires_at, now],
    )
    .map_err(|e| format!("Failed to update access token: {}", e))?;

    Ok(())
}

/// Persists the current user session.
#[tauri::command]
pub fn save_session(db: State<DbState>, session: SessionData) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    save_session_inner(&conn, &session)
}

/// Returns the stored session, if any.
#[tauri::command]
pub fn get_session(db: State<DbState>) -> Result<Option<SessionData>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    get_session_inner(&conn)
}

/// Deletes the stored session.
#[tauri::command]
pub fn clear_session(db: State<DbState>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    clear_session_inner(&conn)
}

/// Updates the access token and expiry for the current session.
#[tauri::command]
pub fn update_access_token(
    db: State<DbState>,
    access_token: String,
    expires_at: i64,
) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    update_access_token_inner(&conn, &access_token, expires_at)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::schema::create_tables;
    use rusqlite::Connection;

    fn setup_db() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        create_tables(&conn).unwrap();
        conn
    }

    fn sample_session() -> SessionData {
        SessionData {
            access_token: "access-123".to_string(),
            refresh_token: "refresh-456".to_string(),
            expires_at: 2_000_000_000_000,
            user: UserData {
                id: "u1".to_string(),
                phone: "13800000000".to_string(),
                name: Some("Alice".to_string()),
                email: Some("alice@example.com".to_string()),
                avatar: Some("https://img/a.png".to_string()),
            },
        }
    }

    #[test]
    fn get_returns_none_when_empty() {
        let conn = setup_db();
        assert!(get_session_inner(&conn).unwrap().is_none());
    }

    #[test]
    fn save_then_get() {
        let conn = setup_db();
        let session = sample_session();
        save_session_inner(&conn, &session).unwrap();
        let got = get_session_inner(&conn).unwrap().unwrap();
        assert_eq!(got.access_token, "access-123");
        assert_eq!(got.refresh_token, "refresh-456");
        assert_eq!(got.expires_at, 2_000_000_000_000);
        assert_eq!(got.user.id, "u1");
        assert_eq!(got.user.phone, "13800000000");
        assert_eq!(got.user.name.as_deref(), Some("Alice"));
    }

    #[test]
    fn save_replaces_existing() {
        let conn = setup_db();
        let mut session = sample_session();
        save_session_inner(&conn, &session).unwrap();

        session.access_token = "new-token".to_string();
        session.user.name = Some("Bob".to_string());
        save_session_inner(&conn, &session).unwrap();

        let got = get_session_inner(&conn).unwrap().unwrap();
        assert_eq!(got.access_token, "new-token");
        assert_eq!(got.user.name.as_deref(), Some("Bob"));
    }

    #[test]
    fn clear_removes_session() {
        let conn = setup_db();
        save_session_inner(&conn, &sample_session()).unwrap();
        assert!(get_session_inner(&conn).unwrap().is_some());

        clear_session_inner(&conn).unwrap();
        assert!(get_session_inner(&conn).unwrap().is_none());
    }

    #[test]
    fn update_access_token_changes_token_and_expiry() {
        let conn = setup_db();
        save_session_inner(&conn, &sample_session()).unwrap();

        update_access_token_inner(&conn, "rotated-token", 3_000_000_000_000).unwrap();

        let got = get_session_inner(&conn).unwrap().unwrap();
        assert_eq!(got.access_token, "rotated-token");
        assert_eq!(got.expires_at, 3_000_000_000_000);
        assert_eq!(got.refresh_token, "refresh-456");
    }

    #[test]
    fn update_access_token_noop_when_no_session() {
        let conn = setup_db();
        update_access_token_inner(&conn, "x", 100).unwrap();
        assert!(get_session_inner(&conn).unwrap().is_none());
    }

    #[test]
    fn handles_none_optional_fields() {
        let conn = setup_db();
        let session = SessionData {
            access_token: "a".to_string(),
            refresh_token: "r".to_string(),
            expires_at: 100,
            user: UserData {
                id: "u2".to_string(),
                phone: "100".to_string(),
                name: None,
                email: None,
                avatar: None,
            },
        };
        save_session_inner(&conn, &session).unwrap();
        let got = get_session_inner(&conn).unwrap().unwrap();
        assert!(got.user.name.is_none());
        assert!(got.user.email.is_none());
        assert!(got.user.avatar.is_none());
    }
}
