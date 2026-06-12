use serde::Serialize;
use tauri::{AppHandle, Emitter};

#[derive(Debug, thiserror::Error)]
pub enum WatchError {
    #[error("Watch not available")]
    NotAvailable,
    #[error("Failed to encode data: {0}")]
    Encoding(#[from] serde_json::Error),
    #[error("Emit failed: {0}")]
    Emit(#[from] tauri::Error),
}

impl Serialize for WatchError {
    fn serialize<S: serde::Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        serializer.serialize_str(self.to_string().as_str())
    }
}

/// Send data payload to the paired Apple Watch via WatchBridge.
/// The actual delivery is handled by the Swift WatchConnectivity layer.
#[tauri::command]
pub async fn send_to_watch(app: AppHandle, data: String) -> Result<(), WatchError> {
    // Validate JSON
    let _: serde_json::Value = serde_json::from_str(&data)?;

    // Store the payload so the Swift WatchBridge can read it.
    // On iOS, the Swift side observes this and calls WCSession.updateApplicationContext.
    app.emit("watch:send", data)?;

    Ok(())
}

/// Called by the Swift WatchBridge when a message is received from the watch.
/// The frontend listens via the `watch:message` event.
#[tauri::command]
pub async fn emit_watch_message(app: AppHandle, message: String) -> Result<(), WatchError> {
    let _: serde_json::Value = serde_json::from_str(&message)?;
    app.emit("watch:message", message)?;
    Ok(())
}
