# Send with Rails

Send email from Rails with the uSend gem, or through Action Mailer over SMTP.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/rails

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). Use the gem for API features (templates, batches, scheduling, idempotency), or Action Mailer over SMTP so your existing mailers keep working.

## Option 1: the Ruby gem

`Gemfile`

```ruby
gem "usend"
```

`config/initializers/usend.rb`

```ruby
USEND = Usend::Client.new(api_key: ENV.fetch("USEND_API_KEY"))
```

`app/jobs/welcome_email_job.rb`

```ruby
class WelcomeEmailJob < ApplicationJob
  def perform(user)
    USEND.emails.send_email(
      {
        from: "Acme <hello@acme.com>",
        to: [user.email],
        subject: "Welcome",
        html: ApplicationController.render(template: "user_mailer/welcome", locals: { user: user })
      },
      idempotency_key: "welcome-#{user.id}"
    )
  end
end
```

```ruby
WelcomeEmailJob.perform_later(user)
```

The idempotency key makes a retried job safe: uSend returns the first result instead of sending again. See [Idempotency](https://usend.et/docs/sending/idempotency). A failure raises `Usend::Error`.

Verify webhooks in a controller with `Usend::Webhook.verify(payload: request.raw_post, headers: request.headers.to_h, secret: ENV["USEND_WEBHOOK_SECRET"])` and `skip_forgery_protection` for that action.

## Option 2: Action Mailer over SMTP

`config/environments/production.rb`

```ruby
config.action_mailer.delivery_method = :smtp
config.action_mailer.smtp_settings = {
  address: "smtp.usend.et",
  port: 587,
  user_name: "usend",
  password: ENV.fetch("USEND_API_KEY"),
  authentication: :plain,
  enable_starttls_auto: true
}
```

Your API key is the password; `Usend.smtp_settings(api_key: ENV["USEND_API_KEY"], port: 587)` returns the same settings. See [Send with SMTP](https://usend.et/docs/sending/smtp).

## Without the gem

`Net::HTTP` works too: `POST https://api.usend.et/emails` with an `Authorization: Bearer` header and a JSON body.

Next: [Send emails](https://usend.et/docs/sending/emails).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
