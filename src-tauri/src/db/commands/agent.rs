use crate::db::DbState;
use crate::db::models::agent::AgentData;
use chrono::Utc;
use rusqlite::{params, Connection, OptionalExtension};
use tauri::State;

/// Replaces all stored agents with the provided list and updates cache metadata.
pub fn save_agents_inner(conn: &Connection, agents: &[AgentData]) -> Result<(), String> {
    let now = Utc::now().timestamp_millis();

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

    conn.execute(
        "INSERT OR REPLACE INTO cache_meta (key, updated_at) VALUES ('agents', ?1)",
        params![now],
    )
    .map_err(|e| format!("Failed to update cache meta: {}", e))?;

    Ok(())
}

/// Returns all cached agents ordered by last update time.
pub fn get_agents_inner(conn: &Connection) -> Result<Vec<AgentData>, String> {
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

/// Deletes a single agent by ID.
pub fn delete_agent_inner(conn: &Connection, agent_id: &str) -> Result<(), String> {
    conn.execute("DELETE FROM agents WHERE agent_id = ?1", params![agent_id])
        .map_err(|e| format!("Failed to delete agent {}: {}", agent_id, e))?;
    Ok(())
}

/// Deletes multiple agents by ID. Returns the number of deleted rows.
pub fn delete_agents_batch_inner(conn: &Connection, agent_ids: &[String]) -> Result<usize, String> {
    if agent_ids.is_empty() {
        return Ok(0);
    }
    let placeholders: Vec<String> = agent_ids.iter().enumerate().map(|(i, _)| format!("?{}", i + 1)).collect();
    let sql = format!("DELETE FROM agents WHERE agent_id IN ({})", placeholders.join(", "));
    let params: Vec<&dyn rusqlite::ToSql> = agent_ids.iter().map(|id| id as &dyn rusqlite::ToSql).collect();
    let count = conn.execute(&sql, params.as_slice())
        .map_err(|e| format!("Failed to batch delete agents: {}", e))?;
    Ok(count)
}

/// Removes all agents and their cache metadata.
pub fn clear_agents_inner(conn: &Connection) -> Result<(), String> {
    conn.execute("DELETE FROM agents", [])
        .map_err(|e| format!("Failed to clear agents: {}", e))?;
    conn.execute("DELETE FROM cache_meta WHERE key = 'agents'", [])
        .map_err(|e| format!("Failed to clear cache meta: {}", e))?;
    Ok(())
}

/// Returns the timestamp of the last agents cache update, if any.
pub fn get_agents_cache_time_inner(conn: &Connection) -> Result<Option<i64>, String> {
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

/// Replaces all cached agents with the provided list.
#[tauri::command]
pub fn save_agents(db: State<DbState>, agents: Vec<AgentData>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    save_agents_inner(&conn, &agents)
}

/// Returns all cached agents.
#[tauri::command]
pub fn get_agents(db: State<DbState>) -> Result<Vec<AgentData>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    get_agents_inner(&conn)
}

/// Removes all cached agents and resets the cache timestamp.
#[tauri::command]
pub fn clear_agents(db: State<DbState>) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    clear_agents_inner(&conn)
}

/// Deletes a single agent by ID.
#[tauri::command]
pub fn delete_agent(db: State<DbState>, agent_id: String) -> Result<(), String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    delete_agent_inner(&conn, &agent_id)
}

/// Deletes multiple agents by their IDs.
#[tauri::command]
pub fn delete_agents_batch(db: State<DbState>, agent_ids: Vec<String>) -> Result<usize, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    delete_agents_batch_inner(&conn, &agent_ids)
}

/// Returns the timestamp when the agent cache was last updated.
#[tauri::command]
pub fn get_agents_cache_time(db: State<DbState>) -> Result<Option<i64>, String> {
    let conn = db.0.lock().map_err(|e| e.to_string())?;
    get_agents_cache_time_inner(&conn)
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

    fn sample_agent(id: &str, updated_at: i64) -> AgentData {
        AgentData {
            agent_id: id.to_string(),
            node_id: "node-1".to_string(),
            name: format!("Agent {}", id),
            role: "developer".to_string(),
            status: "idle".to_string(),
            connection_status: "connected".to_string(),
            soul_name: "soul".to_string(),
            soul_version: "1.0.0".to_string(),
            current_task_id: None,
            current_task_title: None,
            model_name: Some("gpt-4".to_string()),
            tokens_today: 100,
            tokens_this_month: 2000,
            estimated_cost_this_month: Some(1.5),
            last_active_at: 1000,
            created_at: 500,
            updated_at,
        }
    }

    #[test]
    fn get_returns_empty_when_no_agents() {
        let conn = setup_db();
        assert!(get_agents_inner(&conn).unwrap().is_empty());
    }

    #[test]
    fn save_multiple_then_get_all() {
        let conn = setup_db();
        let agents = vec![
            sample_agent("a1", 100),
            sample_agent("a2", 200),
            sample_agent("a3", 300),
        ];
        save_agents_inner(&conn, &agents).unwrap();

        let got = get_agents_inner(&conn).unwrap();
        assert_eq!(got.len(), 3);
    }

    #[test]
    fn save_clears_old_before_insert() {
        let conn = setup_db();
        save_agents_inner(&conn, &[sample_agent("a1", 100), sample_agent("a2", 200)]).unwrap();
        assert_eq!(get_agents_inner(&conn).unwrap().len(), 2);

        save_agents_inner(&conn, &[sample_agent("a3", 300)]).unwrap();
        let got = get_agents_inner(&conn).unwrap();
        assert_eq!(got.len(), 1);
        assert_eq!(got[0].agent_id, "a3");
    }

    #[test]
    fn get_ordered_by_updated_at_desc() {
        let conn = setup_db();
        let agents = vec![
            sample_agent("old", 100),
            sample_agent("new", 900),
            sample_agent("mid", 500),
        ];
        save_agents_inner(&conn, &agents).unwrap();

        let got = get_agents_inner(&conn).unwrap();
        assert_eq!(got[0].agent_id, "new");
        assert_eq!(got[1].agent_id, "mid");
        assert_eq!(got[2].agent_id, "old");
    }

    #[test]
    fn fields_round_trip() {
        let conn = setup_db();
        let agent = sample_agent("a1", 12345);
        save_agents_inner(&conn, &[agent]).unwrap();

        let got = &get_agents_inner(&conn).unwrap()[0];
        assert_eq!(got.agent_id, "a1");
        assert_eq!(got.node_id, "node-1");
        assert_eq!(got.name, "Agent a1");
        assert_eq!(got.role, "developer");
        assert_eq!(got.status, "idle");
        assert_eq!(got.connection_status, "connected");
        assert_eq!(got.soul_name, "soul");
        assert_eq!(got.soul_version, "1.0.0");
        assert_eq!(got.model_name.as_deref(), Some("gpt-4"));
        assert_eq!(got.tokens_today, 100);
        assert_eq!(got.tokens_this_month, 2000);
        assert_eq!(got.estimated_cost_this_month, Some(1.5));
        assert_eq!(got.updated_at, 12345);
    }

    #[test]
    fn none_optionals_round_trip() {
        let conn = setup_db();
        let mut agent = sample_agent("a1", 100);
        agent.current_task_id = None;
        agent.current_task_title = None;
        agent.model_name = None;
        agent.estimated_cost_this_month = None;
        save_agents_inner(&conn, &[agent]).unwrap();

        let got = &get_agents_inner(&conn).unwrap()[0];
        assert!(got.current_task_id.is_none());
        assert!(got.current_task_title.is_none());
        assert!(got.model_name.is_none());
        assert!(got.estimated_cost_this_month.is_none());
    }

    #[test]
    fn clear_removes_all_agents() {
        let conn = setup_db();
        save_agents_inner(&conn, &[sample_agent("a1", 100)]).unwrap();
        assert!(!get_agents_inner(&conn).unwrap().is_empty());

        clear_agents_inner(&conn).unwrap();
        assert!(get_agents_inner(&conn).unwrap().is_empty());
    }

    #[test]
    fn clear_resets_cache_time() {
        let conn = setup_db();
        save_agents_inner(&conn, &[sample_agent("a1", 100)]).unwrap();
        assert!(get_agents_cache_time_inner(&conn).unwrap().is_some());

        clear_agents_inner(&conn).unwrap();
        assert!(get_agents_cache_time_inner(&conn).unwrap().is_none());
    }

    #[test]
    fn cache_time_none_before_first_save() {
        let conn = setup_db();
        assert!(get_agents_cache_time_inner(&conn).unwrap().is_none());
    }

    #[test]
    fn cache_time_set_after_save() {
        let conn = setup_db();
        save_agents_inner(&conn, &[sample_agent("a1", 100)]).unwrap();
        let t = get_agents_cache_time_inner(&conn).unwrap();
        assert!(t.is_some());
        assert!(t.unwrap() > 0);
    }

    #[test]
    fn delete_removes_single_agent() {
        let conn = setup_db();
        save_agents_inner(&conn, &[sample_agent("a1", 100), sample_agent("a2", 200)]).unwrap();
        delete_agent_inner(&conn, "a1").unwrap();
        let got = get_agents_inner(&conn).unwrap();
        assert_eq!(got.len(), 1);
        assert_eq!(got[0].agent_id, "a2");
    }

    #[test]
    fn delete_nonexistent_is_noop() {
        let conn = setup_db();
        save_agents_inner(&conn, &[sample_agent("a1", 100)]).unwrap();
        delete_agent_inner(&conn, "unknown").unwrap();
        assert_eq!(get_agents_inner(&conn).unwrap().len(), 1);
    }

    #[test]
    fn batch_delete_removes_multiple() {
        let conn = setup_db();
        save_agents_inner(&conn, &[sample_agent("a1", 100), sample_agent("a2", 200), sample_agent("a3", 300)]).unwrap();
        let count = delete_agents_batch_inner(&conn, &["a1".to_string(), "a3".to_string()]).unwrap();
        assert_eq!(count, 2);
        let got = get_agents_inner(&conn).unwrap();
        assert_eq!(got.len(), 1);
        assert_eq!(got[0].agent_id, "a2");
    }

    #[test]
    fn batch_delete_empty_is_noop() {
        let conn = setup_db();
        save_agents_inner(&conn, &[sample_agent("a1", 100)]).unwrap();
        let count = delete_agents_batch_inner(&conn, &[]).unwrap();
        assert_eq!(count, 0);
        assert_eq!(get_agents_inner(&conn).unwrap().len(), 1);
    }
}
