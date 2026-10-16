use axum::{
    body::Bytes,
    extract::State,
    http::{HeaderMap, StatusCode},
    routing::post,
    Json, Router,
};
use serde::Deserialize;
use serde_json::{json, Value};
use usend::{Client, SendEmail};

#[derive(Clone)]
struct AppState {
    usend: Client,
    webhook_secret: String,
}

#[derive(Deserialize)]
struct Welcome {
    email: String,
}

async fn send_welcome(State(state): State<AppState>, Json(body): Json<Welcome>) -> (StatusCode, Json<Value>) {
    let email = SendEmail::new("Acme <hello@acme.com>", [body.email])
        .subject("Welcome to Acme")
        .html("<p>Thanks for signing up.</p>");

    let result = tokio::task::spawn_blocking(move || state.usend.emails().send(&email)).await;
    match result {
        Ok(Ok(sent)) => (StatusCode::OK, Json(json!({ "id": sent.id }))),
        Ok(Err(e)) => (StatusCode::BAD_GATEWAY, Json(json!({ "message": e.to_string() }))),
        Err(e) => (StatusCode::INTERNAL_SERVER_ERROR, Json(json!({ "message": e.to_string() }))),
    }
}

// Verify against the raw body: take `Bytes`, not `Json`.
async fn usend_webhook(State(state): State<AppState>, headers: HeaderMap, body: Bytes) -> StatusCode {
    let lookup = |name: &str| headers.get(name).and_then(|v| v.to_str().ok()).map(str::to_string);
    match usend::verify_webhook(&body, lookup, &state.webhook_secret) {
        Ok(event) => {
            println!("event {}", event.event_type); // store it, process it in the background
            StatusCode::OK
        }
        Err(_) => StatusCode::BAD_REQUEST,
    }
}

#[tokio::main]
async fn main() {
    let state = AppState {
        usend: Client::from_env().expect("USEND_API_KEY"),
        webhook_secret: std::env::var("USEND_WEBHOOK_SECRET").unwrap_or_default(),
    };
    let app = Router::new()
        .route("/send", post(send_welcome))
        .route("/webhooks/usend", post(usend_webhook))
        .with_state(state);
    let listener = tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
