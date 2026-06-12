//! SQLite database layer — connection management, schema, models, and Tauri commands.

pub mod connection;
pub mod schema;
pub mod models;
pub mod commands;

pub use connection::DbState;
pub use connection::init_db;