# Send with .NET

Send email from .NET 8+ with the uSend SDK, plain HTTP or SMTP.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/dotnet

The uSend .NET SDK uses only `System.Net.Http` and `System.Text.Json`. You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). It targets .NET 8 or newer.

## 1. Install

```bash
dotnet add package Usend
```

## 2. Send an email

`Program.cs`

```csharp
using Usend;

using var usend = new UsendClient(Environment.GetEnvironmentVariable("USEND_API_KEY"));

try
{
    var sent = await usend.Emails.SendAsync(new
    {
        from = "Acme <hello@acme.com>",
        to = new[] { "ann@example.com" },
        subject = "Hello from usend",
        html = "<p>It works!</p>",
    });
    Console.WriteLine($"queued: {sent.GetProperty("id").GetString()}");
}
catch (UsendException e)
{
    Console.Error.WriteLine($"failed {e.StatusCode} {e.ErrorName}: {e.Message}");
}
```

Responses are `JsonElement`s. In ASP.NET Core, register one `UsendClient` as a singleton (or pass your `IHttpClientFactory` client through `UsendClientOptions.HttpClient`). Pass an idempotency key to make retries safe: `SendAsync(email, UsendClient.NewIdempotencyKey())`.

## Verify a webhook

```csharp
var evt = Webhook.Verify(rawBody, headers, Environment.GetEnvironmentVariable("USEND_WEBHOOK_SECRET")!);
```

## Plain HTTP and SMTP

You can skip the SDK: `POST https://api.usend.et/emails` with `Authorization: Bearer <key>` works from `HttpClient`.

`System.Net.Mail.SmtpClient` is obsolete for new code; use MailKit against `smtp.usend.et` port 587 (STARTTLS) or 465 with username `usend` and your API key (`usend.GetSmtpConfig()` returns these settings). See [Send with SMTP](https://usend.et/docs/sending/smtp).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
