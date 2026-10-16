# Send with Elixir

Send email from Elixir with the usend SDK, plain HTTP or SMTP.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/elixir

The usend Elixir SDK has no dependencies (it uses OTP's `:httpc`). You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Dependency

`mix.exs`

```elixir
defp deps do
  [{:usend, "~> 1.0"}]
end
```

```bash
mix deps.get
```

## 2. Send an email

```elixir
client = Usend.new(System.fetch_env!("USEND_API_KEY"))

case Usend.send_email(client, %{
       from: "Acme <hello@acme.com>",
       to: ["ann@example.com"],
       subject: "Hello from usend",
       html: "<p>It works!</p>"
     }) do
  {:ok, %{"id" => id}} -> IO.puts("queued #{id}")
  {:error, %Usend.Error{name: name, message: message}} -> IO.puts("failed: #{name}: #{message}")
end
```

Pass `idempotency_key: Usend.new_idempotency_key()` as the third argument to make retries safe. Rate-limited requests are retried for you.

## Verify a webhook

```elixir
{:ok, event} = Usend.Webhook.verify(raw_body, conn.req_headers, System.fetch_env!("USEND_WEBHOOK_SECRET"), 300)
```

## Plain HTTP and SMTP

You can skip the SDK: `POST https://api.usend.et/emails` with `Authorization: Bearer <key>` works from Req or any HTTP client.

Swoosh can send over SMTP (`smtp.usend.et`, port 587 or 465, username `usend`, your API key as the password; `Usend.smtp_config(client)` returns these settings). See [Send with SMTP](https://usend.et/docs/sending/smtp).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
