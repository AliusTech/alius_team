mod db;
mod watch;
mod push;

use db::commands::{agent, notification, session};
use db::DbState;
use push::PushState;
use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_notification::init())
        .setup(|app| {
            // 初始化数据库
            let db = db::init_db(app.handle())?;
            app.manage(db);

            // 推送客户端 state
            app.manage(PushState::new());

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
            notification::save_notification,
            notification::get_notifications,
            notification::mark_notification_read,
            notification::mark_all_notifications_read,
            notification::delete_notification,
            notification::clear_all_notifications,
            notification::get_unread_notification_count,
            watch::commands::send_to_watch,
            push::commands::start_push_client,
            push::commands::stop_push_client,
            push::commands::is_push_connected,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
