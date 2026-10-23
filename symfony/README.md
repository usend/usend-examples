# Send with Symfony

Send email from Symfony with the uSend PHP SDK, or through Symfony Mailer over SMTP.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/symfony

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). Use the SDK for API features (templates, batches, scheduling, idempotency), or Symfony Mailer over SMTP so existing `MailerInterface` code keeps working.

## Option 1: the PHP SDK

```bash
composer require usend/usend
```

`config/services.yaml`

```yaml
services:
    Usend\Client:
        arguments:
            $apiKey: '%env(USEND_API_KEY)%'
```

`src/Service/Welcome.php`

```php
use Usend\Client;

final class Welcome
{
    public function __construct(private Client $usend) {}

    public function send(string $to): void
    {
        $this->usend->emails->send([
            'from' => 'Acme <hello@acme.com>',
            'to' => [$to],
            'subject' => 'Welcome',
            'html' => '<p>It works!</p>',
        ], 'welcome-' . md5($to));
    }
}
```

A failure throws `Usend\UsendException`; rate limits and server errors are retried, and the idempotency key makes a retry safe. See [Idempotency](https://usend.et/docs/sending/idempotency). Verify webhooks with `Usend\Webhook::verify($request->getContent(), $request->headers->all(), $secret)`.

## Option 2: Symfony Mailer over SMTP

`.env.local.example`

```ini
MAILER_DSN=smtps://usend:us_123456789@smtp.usend.et:465
```

Port `465` is implicit TLS (`smtps`); for STARTTLS use `smtp://usend:us_123456789@smtp.usend.et:587`. Your API key is the password; URL-encode it if it has special characters (`$usend->smtpConfig()['dsn']` does this). See [Send with SMTP](https://usend.et/docs/sending/smtp).

## Without the SDK

Symfony's `HttpClient` works too: `POST https://api.usend.et/emails` with an `Authorization: Bearer` header and a JSON body.

Next: [Send emails](https://usend.et/docs/sending/emails).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
