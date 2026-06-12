mod db;
mod watch;

use db::commands::{agent, session};
use db::DbState;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            // 初始化数据库
            let db = db::init_db(app.handle())?;
            app.manage(db);

            // 日志插件（仅 debug）
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            session::save_session,
            session::get_session,
            session::clear_session,
            session::update_access_token,
            agent::save_agents,
            agent::get_agents,
            agent::clear_agents,
            agent::get_agents_cache_time,
            watch::commands::send_to_watch,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}