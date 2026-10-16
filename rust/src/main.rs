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
