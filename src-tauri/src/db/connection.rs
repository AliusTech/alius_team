use rusqlite::Connection;
use std::sync::Mutex;
use tauri::Manager;

/// Thread-safe wrapper around a SQLite database connection.
pub struct DbState(pub Mutex<Connection>);

/// Opens (or creates) the SQLite database and runs schema migrations.
pub fn init_db(app: &tauri::AppHandle) -> Result<DbState, String> {
    let app_dir = app
        .path()
        .app_data_dir()
        .map_err(|e| format!("Failed to get app data dir: {}", e))?;

    std::fs::create_dir_all(&app_dir)
        .map_err(|e| format!("Failed to create app dir: {}", e))?;

    let db_path = app_dir.join("alius.db");
    let conn = Connection::open(db_path)
        .map_err(|e| format!("Failed to open database: {}", e))?;

    // Enable foreign key constraints
    conn.execute_batch("PRAGMA foreign_keys = ON;")
        .map_err(|e| format!("Failed to enable foreign keys: {}", e))?;

    // Create tables
    crate::db::schema::create_tables(&conn)?;

    Ok(DbState(Mutex::new(conn)))
}