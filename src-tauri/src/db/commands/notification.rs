use crate::db::DbState;
use crate::db::models::notification::NotificationData;
use chrono::Utc;
use rusqlite::{params, Connection};
use tauri::State;

/// Inserts or replaces a notification record.
pub fn save_notification_inner(conn: &Connection, n: &NotificationData) -> Result<(), String> {
    conn.execute(
        r#"
        INSERT OR REPLACE INTO notifications (
            id, title, body, category, priority, action_url,
            is_read, created_at, received_at
        ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)
        "#,
        params![
            n.id,
            n.title,
            n.body,
            n.category,
            n.priority,
            n.action_url,
            n.is_read,
            n.created_at,
            if n.received_at > 0 { n.received_at } else { Utc::now().timestamp_millis() },
        ],
    )
    .map_err(|e| format!("Failed to save notification: {}", e))?;
    Ok(())
}

/// Returns notifications ordered by creation time, newest first.
pub fn get_notifications_inner(
    conn: &Connection,
    limit: i64,
    offset: i64,
    unread_only: bool,
) -> Result<Vec<NotificationData>, String> {
    let sql = if unread_only {
        "SELECT id, title, body, category, priority, action_url, is_read, created_at, received_at
         FROM notifications WHERE is_read = 0 ORDER BY created_at DESC LIMIT ?1 OFFSET ?2"
    } else {
        "SELECT id, title, body, category, priority, action_url, is_read, created_at, received_at
         FROM notifications ORDER BY created_at DESC LIMIT ?1 OFFSET ?2"
    };

    let mut stmt = conn
        .prepare(sql)
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let items = stmt
        .query_map(params![limit, offset], |row| {
            Ok(NotificationData {
                id: row.get(0)?,
                title: row.get(1)?,
                body: row.get(2)?,
                category: row.get(3)?,
                priority: row.get(4)?,
                action_url: row.get(5)?,
                is_read: row.get::<_, i64>(6)? != 0,
                created_at: row.get(7)?,
                received_at: row.get(8)?,
            })
        })
        .map_err(|e| format!("Failed to query notifications: {}", e))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect notifications: {}", e))?;

    Ok(items)
}

/// Marks a single notification as read.
pub fn mark_read_inner(conn: &Connection, id: &str) -> Result<(), String> {
    conn.execute(
        "UPDATE notifications SET is_read = 1 WHERE id = ?1",
        params![id],
    )
    .map_err(|e| format!("Failed to mark read: {}", e))?;
    Ok(())
}

/// Marks all notifications as read.
pub fn mark_all_read_inner(conn: &Connection) -> Result<(), String> {
    conn.execute("UPDATE notifications SET is_read = 1", [])
        .map_err(|e| format!("Failed to mark all read: {}", e))?;
    Ok(())
}

/// Deletes a single notification by ID.
pub fn delete_notification_inner(conn: &Connection, id: &str) -> Result<(), String> {
    conn.execute("DELETE FROM notifications WHERE id = ?1", params![id])
        .map_err(|e| format!("Failed to delete notification: {}", e))?;
    Ok(())
}

/// Deletes all notifications.
pub fn clear_all_inner(conn: &Connection) -> Result<(), String> {
    conn.execute("DELETE FROM notifications", [])
        .map_err(|e| format!("Failed to clear notifications: {}", e))?;
    Ok(())
}

/// Returns the count of unread notifications.
pub fn get_unread_count_inner(conn: &Connection) -> Result<i64, String> {
    let count: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM notifications WHERE is_read = 0",
            [],
            |row| row.get(0),
        )
        .map_err(|e| format!("Failed to count unread: {}", e))?;
    Ok(count)
}

/// Persists a notification received from the push service.
#[tauri::command]
pub fn save_notification(db: State<DbState>, notification: NotificationData) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    save_notification_inner(&conn, &notification)
}

/// Returns paginated notifications, optionally filtered to unread only.
#[tauri::command]
pub fn get_notifications(
    db: State<DbState>,
    limit: Option<i64>,
    offset: Option<i64>,
    unread_only: Option<bool>,
) -> Result<Vec<NotificationData>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    get_notifications_inner(&conn, limit.unwrap_or(50), offset.unwrap_or(0), unread_only.unwrap_or(false))
}

/// Marks a notification as read by ID.
#[tauri::command]
pub fn mark_notification_read(db: State<DbState>, id: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    mark_read_inner(&conn, &id)
}

/// Marks all notifications as read.
#[tauri::command]
pub fn mark_all_notifications_read(db: State<DbState>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    mark_all_read_inner(&conn)
}

/// Deletes a notification by ID.
#[tauri::command]
pub fn delete_notification(db: State<DbState>, id: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    delete_notification_inner(&conn, &id)
}

/// Deletes all stored notifications.
#[tauri::command]
pub fn clear_all_notifications(db: State<DbState>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    clear_all_inner(&conn)
}

/// Returns the number of unread notifications.
#[tauri::command]
pub fn get_unread_notification_count(db: State<DbState>) -> Result<i64, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    get_unread_count_inner(&conn)
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::schema::create_tables;
    use rusqlite::Connection;

    fn setup() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        create_tables(&conn).unwrap();
        conn
    }

    fn sample(id: &str, created_at: i64) -> NotificationData {
        NotificationData {
            id: id.to_string(),
            title: format!("Title {}", id),
            body: "Body text".to_string(),
            category: "task".to_string(),
            priority: "normal".to_string(),
            action_url: Some("/app".to_string()),
            is_read: false,
            created_at,
            received_at: created_at,
        }
    }

    #[test]
    fn save_then_get() {
        let conn = setup();
        save_notification_inner(&conn, &sample("n1", 100)).unwrap();
        let got = get_notifications_inner(&conn, 10, 0, false).unwrap();
        assert_eq!(got.len(), 1);
        assert_eq!(got[0].id, "n1");
        assert_eq!(got[0].title, "Title n1");
    }

    #[test]
    fn get_ordered_by_created_at_desc() {
        let conn = setup();
        save_notification_inner(&conn, &sample("old", 100)).unwrap();
        save_notification_inner(&conn, &sample("new", 300)).unwrap();
        save_notification_inner(&conn, &sample("mid", 200)).unwrap();
        let got = get_notifications_inner(&conn, 10, 0, false).unwrap();
        assert_eq!(got[0].id, "new");
        assert_eq!(got[1].id, "mid");
        assert_eq!(got[2].id, "old");
    }

    #[test]
    fn get_unread_only() {
        let conn = setup();
        save_notification_inner(&conn, &sample("n1", 100)).unwrap();
        save_notification_inner(&conn, &sample("n2", 200)).unwrap();
        mark_read_inner(&conn, "n1").unwrap();
        let got = get_notifications_inner(&conn, 10, 0, true).unwrap();
        assert_eq!(got.len(), 1);
        assert_eq!(got[0].id, "n2");
    }

    #[test]
    fn mark_read_updates_flag() {
        let conn = setup();
        save_notification_inner(&conn, &sample("n1", 100)).unwrap();
        mark_read_inner(&conn, "n1").unwrap();
        let got = &get_notifications_inner(&conn, 10, 0, false).unwrap()[0];
        assert!(got.is_read);
    }

    #[test]
    fn mark_all_read() {
        let conn = setup();
        save_notification_inner(&conn, &sample("n1", 100)).unwrap();
        save_notification_inner(&conn, &sample("n2", 200)).unwrap();
        mark_all_read_inner(&conn).unwrap();
        let unread = get_notifications_inner(&conn, 10, 0, true).unwrap();
        assert!(unread.is_empty());
    }

    #[test]
    fn delete_removes_one() {
        let conn = setup();
        save_notification_inner(&conn, &sample("n1", 100)).unwrap();
        save_notification_inner(&conn, &sample("n2", 200)).unwrap();
        delete_notification_inner(&conn, "n1").unwrap();
        let got = get_notifications_inner(&conn, 10, 0, false).unwrap();
        assert_eq!(got.len(), 1);
        assert_eq!(got[0].id, "n2");
    }

    #[test]
    fn clear_all_removes_everything() {
        let conn = setup();
        save_notification_inner(&conn, &sample("n1", 100)).unwrap();
        save_notification_inner(&conn, &sample("n2", 200)).unwrap();
        clear_all_inner(&conn).unwrap();
        assert!(get_notifications_inner(&conn, 10, 0, false).unwrap().is_empty());
    }

    #[test]
    fn unread_count_tracks_state() {
        let conn = setup();
        assert_eq!(get_unread_count_inner(&conn).unwrap(), 0);
        save_notification_inner(&conn, &sample("n1", 100)).unwrap();
        save_notification_inner(&conn, &sample("n2", 200)).unwrap();
        assert_eq!(get_unread_count_inner(&conn).unwrap(), 2);
        mark_read_inner(&conn, "n1").unwrap();
        assert_eq!(get_unread_count_inner(&conn).unwrap(), 1);
    }

    #[test]
    fn save_replaces_existing() {
        let conn = setup();
        let mut n = sample("n1", 100);
        save_notification_inner(&conn, &n).unwrap();
        n.title = "Updated".to_string();
        save_notification_inner(&conn, &n).unwrap();
        let got = get_notifications_inner(&conn, 10, 0, false).unwrap();
        assert_eq!(got.len(), 1);
        assert_eq!(got[0].title, "Updated");
    }
}
