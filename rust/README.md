# Send with Rust

Send email from Rust with the usend crate.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/rust

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install

`Cargo.toml`

```toml
[dependencies]
usend = { version = "0.1", features = ["ureq"] }
```

The crate is blocking and needs no async runtime. Its only required dependencies are `serde` and `serde_json`. The `ureq` feature adds the HTTPS transport; use `features = ["reqwest"]` if your project already uses reqwest, or implement the `Transport` trait for your own client.

## 2. Send

`src/main.rs`

```rust
use usend::{Client, Error, SendEmail};

fn main() {
    let client = Client::from_env().expect("set USEND_API_KEY");

    let email = SendEmail::new("Acme <hello@acme.com>", ["ann@example.com"])
        .subject("Hello from usend")
        .html("<p>It works!</p>")
        .idempotency_key("welcome-ann-1");

    match client.emails().send(&email) {
        Ok(sent) => println!("queued {}", sent.id),
        Err(Error::Api(e)) => {
            eprintln!("usend {} {}: {}", e.status_code, e.name, e.message);
            std::process::exit(1);
        }
        Err(e) => {
            eprintln!("failed: {e}");
            std::process::exit(1);
        }
    }
}
```

```bash
USEND_API_KEY=us_123456789 cargo run
```

## Notes

- The client retries `429` (honoring `Retry-After`) and, for requests with an idempotency key, `5xx` ([Idempotency](https://usend.et/docs/sending/idempotency)).
- Attachments: `.attachment(usend::Attachment::new("a.pdf", &bytes))` ([Attachments](https://usend.et/docs/sending/attachments)).
- Webhooks: `usend::verify_webhook(&body, |name| /* header lookup */, secret)` ([Verify signatures](https://usend.et/docs/webhooks/verify-signatures)).
- No crate? The API is one JSON `POST` to `https://api.usend.et/emails` with an `Authorization: Bearer` header, so `reqwest` and `serde_json` work too.

Web framework example: [Axum](https://usend.et/docs/quickstarts/axum). All fields: [Send emails](https://usend.et/docs/sending/emails).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
