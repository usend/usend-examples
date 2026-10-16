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
