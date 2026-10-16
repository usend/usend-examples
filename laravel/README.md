# Send with Laravel

Send email from Laravel with the usend PHP SDK, or through SMTP and the Mail facade.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/laravel

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). There are two ways to use usend from Laravel. The SDK calls the API directly (templates, batches, scheduling, idempotency); SMTP keeps your existing `Mail::` code. For SMTP see [Laravel with SMTP](https://usend.et/docs/smtp-guides/laravel).

## Option 1: the PHP SDK

```bash
composer require usend/usend
```

`config/services.php`

```php
'usend' => ['key' => env('USEND_API_KEY')],
```

`app/Providers/AppServiceProvider.php`

```php
public function register(): void
{
    $this->app->singleton(\Usend\Client::class, fn () => new \Usend\Client(config('services.usend.key')));
}
```

`app/Jobs/SendWelcome.php`

```php
public function handle(\Usend\Client $usend): void
{
    $usend->emails->send([
        'from' => 'Acme <hello@acme.com>',
        'to' => [$this->user->email],
        'subject' => 'Welcome',
        'html' => view('emails.welcome', ['user' => $this->user])->render(),
    ], "welcome-{$this->user->id}");
}
```

The idempotency key makes a retried queue job safe: usend returns the first result instead of sending again. See [Idempotency](https://usend.et/docs/sending/idempotency). A failure throws `\Usend\UsendException`.

To receive webhooks, call `\Usend\Webhook::verify($request->getContent(), $request->headers->all(), config('services.usend.webhook_secret'))` in a route excluded from CSRF protection.

## Option 2: SMTP and the Mail facade

`.env.example`

```ini
MAIL_MAILER=smtp
MAIL_HOST=smtp.usend.et
MAIL_PORT=587
MAIL_USERNAME=usend
MAIL_PASSWORD=us_123456789
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=hello@acme.com
MAIL_FROM_NAME=Acme
```

Your API key is the password. Mail sent this way shows up in your dashboard logs like any API send.

## Without the SDK

Laravel's HTTP client also works: `Http::withToken(env('USEND_API_KEY'))->post('https://api.usend.et/emails', [...])`.

Next: [Send emails](https://usend.et/docs/sending/emails).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
