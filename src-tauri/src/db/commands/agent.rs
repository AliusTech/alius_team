use crate::db::DbState;
use crate::db::models::agent::AgentData;
use chrono::Utc;
use rusqlite::{params, OptionalExtension};
use tauri::State;

#[tauri::command]
pub fn save_agents(db: State<DbState>, agents: Vec<AgentData>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    let now = Utc::now().timestamp_millis();

    // 清空旧数据后插入新数据
    conn.execute("DELETE FROM agents", [])
        .map_err(|e| format!("Failed to clear agents: {}", e))?;

    for agent in agents {
        conn.execute(
            r#"
            INSERT INTO agents (
                agent_id, node_id, name, role, status, connection_status,
                soul_name, soul_version, current_task_id, current_task_title,
                model_name, tokens_today, tokens_this_month, estimated_cost_this_month,
                last_active_at, created_at, updated_at
            ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17)
            "#,
            params![
                agent.agent_id,
                agent.node_id,
                agent.name,
                agent.role,
                agent.status,
                agent.connection_status,
                agent.soul_name,
                agent.soul_version,
                agent.current_task_id,
                agent.current_task_title,
                agent.model_name,
                agent.tokens_today,
                agent.tokens_this_month,
                agent.estimated_cost_this_month,
                agent.last_active_at,
                agent.created_at,
                agent.updated_at,
            ],
        )
        .map_err(|e| format!("Failed to save agent {}: {}", agent.agent_id, e))?;
    }

    // 更新缓存元数据
    conn.execute(
        "INSERT OR REPLACE INTO cache_meta (key, updated_at) VALUES ('agents', ?1)",
        params![now],
    )
    .map_err(|e| format!("Failed to update cache meta: {}", e))?;

    Ok(())
}

#[tauri::command]
pub fn get_agents(db: State<DbState>) -> Result<Vec<AgentData>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let mut stmt = conn
        .prepare(
            r#"
            SELECT agent_id, node_id, name, role, status, connection_status,
                   soul_name, soul_version, current_task_id, current_task_title,
                   model_name, tokens_today, tokens_this_month, estimated_cost_this_month,
                   last_active_at, created_at, updated_at
            FROM agents ORDER BY updated_at DESC
            "#,
        )
        .map_err(|e| format!("Failed to prepare statement: {}", e))?;

    let agents = stmt
        .query_map([], |row| {
            Ok(AgentData {
                agent_id: row.get(0)?,
                node_id: row.get(1)?,
                name: row.get(2)?,
                role: row.get(3)?,
                status: row.get(4)?,
                connection_status: row.get(5)?,
                soul_name: row.get(6)?,
                soul_version: row.get(7)?,
                current_task_id: row.get(8)?,
                current_task_title: row.get(9)?,
                model_name: row.get(10)?,
                tokens_today: row.get(11)?,
                tokens_this_month: row.get(12)?,
                estimated_cost_this_month: row.get(13)?,
                last_active_at: row.get(14)?,
                created_at: row.get(15)?,
                updated_at: row.get(16)?,
            })
        })
        .map_err(|e| format!("Failed to query agents: {}", e))?
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| format!("Failed to collect agents: {}", e))?;

    Ok(agents)
}

#[tauri::command]
pub fn clear_agents(db: State<DbState>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    conn.execute("DELETE FROM agents", [])
        .map_err(|e| format!("Failed to clear agents: {}", e))?;
    conn.execute("DELETE FROM cache_meta WHERE key = 'agents'", [])
        .map_err(|e| format!("Failed to clear cache meta: {}", e))?;
    Ok(())
}

#[tauri::command]
pub fn get_agents_cache_time(db: State<DbState>) -> Result<Option<i64>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;

    let result: Option<i64> = conn
        .query_row(
            "SELECT updated_at FROM cache_meta WHERE key = 'agents'",
            [],
            |row| row.get(0),
        )
        .optional()
        .map_err(|e| format!("Failed to get cache time: {}", e))?;

    Ok(result)
}