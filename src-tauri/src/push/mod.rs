//! WebSocket push notification client with automatic reconnection.

pub mod client;
pub mod commands;

pub use client::PushClient;

pub struct PushState(pub PushClient);

impl PushState {
    pub fn new() -> Self {
        Self(PushClient::new())
    }
}
