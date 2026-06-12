use crate::db::DbState;
use crate::db::commands::notification::save_notification_inner;
use crate::db::models::notification::NotificationData;
use chrono::Utc;
use futures_util::{SinkExt, StreamExt};
use serde::Deserialize;
use std::sync::Arc;
use tauri::{AppHandle, Emitter, Manager};
use tauri_plugin_notification::NotificationExt;
use tokio::sync::Mutex;
use tokio_tungstenite::{connect_async, tungstenite::Message};

const RECONNECT_BASE_MS: u64 = 1000;
const RECONNECT_MAX_MS: u64 = 30000;

#[derive(Debug, Deserialize)]
struct PushPayload {
    #[serde(flatten)]
    notification: NotificationData,
}

pub struct PushClient {
    handle: Arc<Mutex<Option<tokio::task::JoinHandle<()>>>>,
}

impl PushClient {
    pub fn new() -> Self {
        Self {
            handle: Arc::new(Mutex::new(None)),
        }
    }

    pub async fn is_running(&self) -> bool {
        self.handle.lock().await.is_some()
    }

    pub async fn start(&self, app: AppHandle, url: String, token: String) {
        let mut guard = self.handle.lock().await;
        if guard.is_some() {
            return;
        }

        let task = tokio::spawn(run_loop(app, url, token));
        *guard = Some(task);
    }

    pub async fn stop(&self) {
        let mut guard = self.handle.lock().await;
        if let Some(handle) = guard.take() {
            handle.abort();
        }
    }
}

async fn run_loop(app: AppHandle, url: String, token: String) {
    let mut delay_ms = RECONNECT_BASE_MS;

    loop {
        let full_url = format!("{}?token={}", url, token);
        log::info!("[push] connecting to {}", url);

        match connect_async(&full_url).await {
            Ok((ws_stream, _)) => {
                log::info!("[push] connected");
                delay_ms = RECONNECT_BASE_MS;

                let (mut write, mut read) = ws_stream.split();

                while let Some(msg_result) = read.next().await {
                    match msg_result {
                        Ok(Message::Text(text)) => {
                            handle_text_message(&app, &text);
                        }
                        Ok(Message::Binary(data)) => {
                            if let Ok(text) = String::from_utf8(data.to_vec()) {
                                handle_text_message(&app, &text);
                            }
                        }
                        Ok(Message::Ping(_)) => {
                            let _ = write.send(Message::Pong(Vec::new().into())).await;
                        }
                        Ok(Message::Close(_)) => {
                            log::info!("[push] server closed connection");
                            break;
                        }
                        Ok(_) => {}
                        Err(e) => {
                            log::warn!("[push] read error: {}", e);
                            break;
                        }
                    }
                }
            }
            Err(e) => {
                log::warn!("[push] connect failed: {}", e);
            }
        }

        log::info!("[push] reconnecting in {}ms", delay_ms);
        tokio::time::sleep(tokio::time::Duration::from_millis(delay_ms)).await;
        delay_ms = (delay_ms * 2).min(RECONNECT_MAX_MS);
    }
}

fn handle_text_message(app: &AppHandle, text: &str) {
    let payload: PushPayload = match serde_json::from_str(text) {
        Ok(p) => p,
        Err(e) => {
            log::debug!("[push] failed to parse message: {}", e);
            return;
        }
    };

    let mut notification = payload.notification;
    if notification.received_at == 0 {
        notification.received_at = Utc::now().timestamp_millis();
    }

    persist_and_emit(app, &notification);
    show_system_notification(app, &notification);
}

fn persist_and_emit(app: &AppHandle, notification: &NotificationData) {
    if let Some(db_state) = app.try_state::<DbState>() {
        match db_state.0.lock() {
            Ok(conn) => {
                if let Err(e) = save_notification_inner(&conn, notification) {
                    log::warn!("[push] failed to save notification: {}", e);
                }
            }
            Err(e) => {
                log::warn!("[push] db lock error: {}", e);
            }
        }
    }

    if let Err(e) = app.emit("notification:received", notification) {
        log::warn!("[push] failed to emit event: {}", e);
    }
}

fn show_system_notification(app: &AppHandle, notification: &NotificationData) {
    let builder = app
        .notification()
        .builder()
        .title(&notification.title)
        .body(&notification.body);

    if let Err(e) = builder.show() {
        log::warn!("[push] failed to show system notification: {}", e);
    }
}

pub fn build_websocket_url(base: &str) -> String {
    let base = base.trim_end_matches('/');
    if base.starts_with("https://") {
        format!("wss://{}/ws/notifications", &base[8..])
    } else if base.starts_with("http://") {
        format!("ws://{}/ws/notifications", &base[7..])
    } else if base.starts_with("wss://") || base.starts_with("ws://") {
        format!("{}/ws/notifications", base)
    } else {
        format!("wss://{}/ws/notifications", base)
    }
}
