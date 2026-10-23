# Send with Go

Send email from Go with the uSend Go SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/go

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install

```bash
go get usend.et/sdk/go
```

The SDK uses only the standard library.

## 2. Send

`main.go`

```go
package main

import (
	"context"
	"errors"
	"fmt"
	"os"

	usend "usend.et/sdk/go"
)

func main() {
	client, err := usend.New(os.Getenv("USEND_API_KEY"))
	if err != nil {
		panic(err)
	}

	res, err := client.Emails.Send(context.Background(), &usend.SendEmailParams{
		From:    "Acme <hello@acme.com>",
		To:      []string{"ann@example.com"},
		Subject: "Hello from usend",
		HTML:    "<p>It works!</p>",
	}, usend.WithIdempotencyKey("welcome-ann-1"))
	if err != nil {
		var apiErr *usend.Error
		if errors.As(err, &apiErr) {
			fmt.Printf("usend %d %s: %s\n", apiErr.StatusCode, apiErr.Name, apiErr.Message)
		} else {
			fmt.Println("failed:", err)
		}
		os.Exit(1)
	}
	fmt.Println("queued", res.ID)
}
```

```bash
USEND_API_KEY=us_123456789 go run .
```

## Notes

- The client retries `429` (honoring `Retry-After`) and, for requests with an idempotency key, `5xx` ([Idempotency](https://usend.et/docs/sending/idempotency)). Tune it with `usend.WithMaxRetries`.
- Receiving webhooks? `usend.VerifyWebhook(body, r.Header, secret)` checks the signature over the raw body: [Verify signatures](https://usend.et/docs/webhooks/verify-signatures).
- SMTP instead of the API: `client.SMTPConfig(587)` returns the host, port and credentials ([SMTP](https://usend.et/docs/sending/smtp)).
- No SDK? The API is one JSON `POST` to `https://api.usend.et/emails` with an `Authorization: Bearer` header, so `net/http` works too.

More fields: [Send emails](https://usend.et/docs/sending/emails). Rust version: [Send with Rust](https://usend.et/docs/quickstarts/rust).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
