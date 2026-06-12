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