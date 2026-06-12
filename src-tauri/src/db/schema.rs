use rusqlite::Connection;

pub fn create_tables(conn: &Connection) -> Result<(), String> {
    conn.execute_batch(
        r#"
        -- sessions 表（存储用户会话，单例模式）
        CREATE TABLE IF NOT EXISTS sessions (
            id INTEGER PRIMARY KEY CHECK (id = 1),
            access_token TEXT NOT NULL,
            refresh_token TEXT NOT NULL,
            expires_at INTEGER NOT NULL,
            user_id TEXT NOT NULL,
            user_phone TEXT NOT NULL,
            user_name TEXT,
            user_email TEXT,
            user_avatar TEXT,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );

        -- agents 表（缓存 API 返回的 agent 列表）
        CREATE TABLE IF NOT EXISTS agents (
            agent_id TEXT PRIMARY KEY,
            node_id TEXT NOT NULL,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'idle',
            connection_status TEXT NOT NULL DEFAULT 'disconnected',
            soul_name TEXT NOT NULL,
            soul_version TEXT NOT NULL,
            current_task_id TEXT,
            current_task_title TEXT,
            model_name TEXT,
            tokens_today INTEGER NOT NULL DEFAULT 0,
            tokens_this_month INTEGER NOT NULL DEFAULT 0,
            estimated_cost_this_month REAL,
            last_active_at INTEGER NOT NULL,
            created_at INTEGER NOT NULL,
            updated_at INTEGER NOT NULL
        );

        -- 缓存元数据表（跟踪缓存更新时间）
        CREATE TABLE IF NOT EXISTS cache_meta (
            key TEXT PRIMARY KEY,
            updated_at INTEGER NOT NULL
        );
        "#,
    )
    .map_err(|e| format!("Failed to create tables: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;
    use rusqlite::Connection;

    fn setup() -> Connection {
        let conn = Connection::open_in_memory().unwrap();
        create_tables(&conn).unwrap();
        conn
    }

    #[test]
    fn create_tables_is_idempotent() {
        let conn = Connection::open_in_memory().unwrap();
        create_tables(&conn).unwrap();
        create_tables(&conn).unwrap();
    }

    #[test]
    fn sessions_table_exists() {
        let conn = setup();
        let count: i64 = conn
            .query_row("SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='sessions'", [], |row| row.get(0))
            .unwrap();
        assert_eq!(count, 1);
    }

    #[test]
    fn agents_table_exists() {
        let conn = setup();
        let count: i64 = conn
            .query_row("SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='agents'", [], |row| row.get(0))
            .unwrap();
        assert_eq!(count, 1);
    }

    #[test]
    fn cache_meta_table_exists() {
        let conn = setup();
        let count: i64 = conn
            .query_row("SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='cache_meta'", [], |row| row.get(0))
            .unwrap();
        assert_eq!(count, 1);
    }

    #[test]
    fn sessions_rejects_non_singleton_id() {
        let conn = setup();
        let result = conn.execute(
            "INSERT INTO sessions (id, access_token, refresh_token, expires_at, user_id, user_phone, created_at, updated_at) VALUES (2, 'a', 'r', 1, 'u', 'p', 1, 1)",
            [],
        );
        assert!(result.is_err());
    }

    #[test]
    fn sessions_accepts_singleton_id() {
        let conn = setup();
        let result = conn.execute(
            "INSERT INTO sessions (id, access_token, refresh_token, expires_at, user_id, user_phone, created_at, updated_at) VALUES (1, 'a', 'r', 1, 'u', 'p', 1, 1)",
            [],
        );
        assert!(result.is_ok());
    }

    #[test]
    fn agents_default_status_is_idle() {
        let conn = setup();
        conn.execute(
            "INSERT INTO agents (agent_id, node_id, name, role, soul_name, soul_version, last_active_at, created_at, updated_at) VALUES ('a1', 'n1', 'A', 'r', 's', '1', 1, 1, 1)",
            [],
        )
        .unwrap();
        let status: String = conn
            .query_row("SELECT status FROM agents WHERE agent_id = 'a1'", [], |row| row.get(0))
            .unwrap();
        assert_eq!(status, "idle");
    }

    #[test]
    fn agents_default_connection_status_is_disconnected() {
        let conn = setup();
        conn.execute(
            "INSERT INTO agents (agent_id, node_id, name, role, soul_name, soul_version, last_active_at, created_at, updated_at) VALUES ('a1', 'n1', 'A', 'r', 's', '1', 1, 1, 1)",
            [],
        )
        .unwrap();
        let cs: String = conn
            .query_row("SELECT connection_status FROM agents WHERE agent_id = 'a1'", [], |row| row.get(0))
            .unwrap();
        assert_eq!(cs, "disconnected");
    }

    #[test]
    fn agents_default_tokens_are_zero() {
        let conn = setup();
        conn.execute(
            "INSERT INTO agents (agent_id, node_id, name, role, soul_name, soul_version, last_active_at, created_at, updated_at) VALUES ('a1', 'n1', 'A', 'r', 's', '1', 1, 1, 1)",
            [],
        )
        .unwrap();
        let (today, month): (i64, i64) = conn
            .query_row("SELECT tokens_today, tokens_this_month FROM agents WHERE agent_id = 'a1'", [], |row| {
                Ok((row.get(0)?, row.get(1)?))
            })
            .unwrap();
        assert_eq!(today, 0);
        assert_eq!(month, 0);
    }
}