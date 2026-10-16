# Send with Phoenix

Send email from a Phoenix app through SMTP and Swoosh, or with the usend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/phoenix

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). Phoenix apps use Swoosh for mail; point it at usend over SMTP, or call the API with the usend SDK.

## Option 1: Swoosh over SMTP

`config/runtime.exs`

```elixir
config :my_app, MyApp.Mailer,
  adapter: Swoosh.Adapters.SMTP,
  relay: "smtp.usend.et",
  port: 587,
  username: "usend",
  password: System.fetch_env!("USEND_API_KEY"),
  ssl: false,
  tls: :always,
  auth: :always
```

For port 465 use `port: 465, ssl: true, tls: :never`. Existing `MyApp.Mailer.deliver/1` calls keep working. Settings: [Send with SMTP](https://usend.et/docs/sending/smtp).

## Option 2: the usend SDK

Add `{:usend, "~> 1.0"}` to your deps, then:

`lib/my_app/notifier.ex`

```elixir
defmodule MyApp.Notifier do
  def welcome(user) do
    client = Usend.new(System.fetch_env!("USEND_API_KEY"))

    Usend.send_email(
      client,
      %{
        from: "Acme <hello@acme.com>",
        to: [user.email],
        subject: "Welcome to Acme",
        html: "<p>Hi #{Plug.HTML.html_escape(user.name)}, welcome aboard.</p>"
      },
      idempotency_key: "welcome-#{user.id}"
    )
  end
end
```

Call it from a controller, or from an Oban job so a slow request never blocks your page. You can also call `POST https://api.usend.et/emails` with Req or any HTTP client.

### Webhooks

Verification needs the exact raw body. Cache it with a `body_reader` on `Plug.Parsers`, then:

```elixir
case Usend.Webhook.verify(conn.assigns.raw_body, conn.req_headers, secret, 300) do
  {:ok, event} ->
    handle(event)
    send_resp(conn, 200, "ok")

  {:error, _} ->
    send_resp(conn, 400, "invalid signature")
end
```

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
