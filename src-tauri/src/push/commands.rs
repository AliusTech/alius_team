use super::client::build_websocket_url;
use super::PushState;
use crate::db::DbState;
use crate::db::commands::session::get_session_inner;
use tauri::{AppHandle, State};

/// Starts the WebSocket push notification client.
#[tauri::command]
pub async fn start_push_client(
    app: AppHandle,
    db: State<'_, DbState>,
    push: State<'_, PushState>,
) -> Result<(), String> {
    let ws_base = std::env::var("ALIUS_WS_BASE_URL")
        .unwrap_or_else(|_| "wss://api.alius.tech".to_string());

    let token = {
        let conn = db.0.lock().map_err(|e| e.to_string())?;
        match get_session_inner(&conn)? {
            Some(session) => session.access_token,
            None => return Err("No session found".to_string()),
        }
    };

    let url = build_websocket_url(&ws_base);
    push.0.start(app, url, token).await;
    Ok(())
}

/// Stops the WebSocket push notification client.
#[tauri::command]
pub async fn stop_push_client(push: State<'_, PushState>) -> Result<(), String> {
    push.0.stop().await;
    Ok(())
}

/// Returns whether the push client is currently connected.
#[tauri::command]
pub async fn is_push_connected(push: State<'_, PushState>) -> Result<bool, String> {
    Ok(push.0.is_running().await)
}
