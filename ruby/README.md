# Send with Ruby

Send email from Ruby with the uSend gem, over plain HTTP or over SMTP.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/ruby

The official gem uses only the Ruby standard library and needs Ruby 3.0 or newer. You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install and set the key

```bash
gem install usend
export USEND_API_KEY="us_123456789"
```

## 2. Send

`send.rb`

```ruby
require "usend"

usend = Usend::Client.new(api_key: ENV["USEND_API_KEY"])

begin
  email = usend.emails.send_email(
    {
      from: "Acme <hello@acme.com>",
      to: ["ann@example.com"],
      subject: "Hello from usend",
      html: "<p>It works!</p>"
    },
    idempotency_key: "welcome-ann-1" # optional
  )
  puts "queued #{email["id"]}"
rescue Usend::Error => e
  warn "#{e.status_code} #{e.name}: #{e.message}"
  exit 1
end
```

```bash
ruby send.rb
```

A failure raises `Usend::Error` with `status_code`, `name` and `message`; see [Errors](https://usend.et/docs/api-reference/errors). Rate limits and server errors are retried automatically, and the idempotency key makes a retry safe: see [Idempotency](https://usend.et/docs/sending/idempotency).

## Webhooks

```ruby
event = Usend::Webhook.verify(payload: raw_body, headers: headers, secret: ENV["USEND_WEBHOOK_SECRET"])
```

It raises `Usend::Error` when the signature is wrong. See [Verify signatures](https://usend.et/docs/webhooks/verify-signatures).

## Without the gem

The API is one JSON request: `POST https://api.usend.et/emails` with an `Authorization: Bearer` header works from `Net::HTTP` or any HTTP client. You can also send over [SMTP](https://usend.et/docs/sending/smtp) with the `mail` gem or `net-smtp`: host `smtp.usend.et`, port `465` or `587`, username `usend`, your API key as the password. `usend.smtp_settings` returns these settings.

## Next steps

- [Send emails](https://usend.et/docs/sending/emails) for every field.
- [Attachments](https://usend.et/docs/sending/attachments): base64-encode the file in `content`.

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
