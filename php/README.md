# Send with PHP

Send email from PHP with the uSend SDK, over plain HTTP or over SMTP.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/php

The official PHP SDK has no dependencies and needs PHP 8.1 or newer (`ext-curl` is used when present). You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install and set the key

```bash
composer require usend/usend
export USEND_API_KEY="us_123456789"
```

## 2. Send

`send.php`

```php
<?php
require 'vendor/autoload.php';

$usend = new Usend\Client(getenv('USEND_API_KEY'));

try {
    $email = $usend->emails->send([
        'from' => 'Acme <hello@acme.com>',
        'to' => ['ann@example.com'],
        'subject' => 'Hello from usend',
        'html' => '<p>It works!</p>',
    ], 'welcome-ann-1'); // optional idempotency key
    echo "queued {$email['id']}\n";
} catch (Usend\UsendException $e) {
    fwrite(STDERR, "{$e->getStatusCode()} {$e->getErrorName()}: {$e->getMessage()}\n");
    exit(1);
}
```

```bash
php send.php
```

A failure throws `Usend\UsendException` with the status code, the error name and the message; see [Errors](https://usend.et/docs/api-reference/errors). Rate limits and server errors are retried automatically, and the idempotency key makes a retry safe: see [Idempotency](https://usend.et/docs/sending/idempotency).

## Webhooks

```php
$event = Usend\Webhook::verify(file_get_contents('php://input'), getallheaders(), getenv('USEND_WEBHOOK_SECRET'));
```

It throws `Usend\UsendException` when the signature is wrong. See [Verify signatures](https://usend.et/docs/webhooks/verify-signatures).

## Without the SDK

The API is one JSON request: `POST https://api.usend.et/emails` with an `Authorization: Bearer` header works from cURL, Guzzle or Symfony HttpClient. If your app already uses PHPMailer or `mail()` through an MTA, point it at uSend over SMTP instead (see [PHPMailer](https://usend.et/docs/smtp-guides/phpmailer)): host `smtp.usend.et`, port `465` or `587`, username `usend`, your API key as the password. `$usend->smtpConfig()` returns these settings.

## Next steps

- [Send emails](https://usend.et/docs/sending/emails) for every field.
- [Attachments](https://usend.et/docs/sending/attachments): base64-encode the file in `content`.

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
