# Send with Java

Send email from Java 11+ with the usend SDK, plain HTTP or SMTP.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/java

The usend Java SDK has no dependencies (it uses the JDK's `java.net.http` client). You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install

`pom.xml`

```xml
<dependency>
  <groupId>et.usend</groupId>
  <artifactId>usend</artifactId>
  <version>1.0.0</version>
</dependency>
```

## 2. Send an email

`SendEmail.java`

```java
import et.usend.Usend;
import et.usend.UsendException;
import java.util.List;
import java.util.Map;

public class SendEmail {
    public static void main(String[] args) {
        Usend usend = new Usend(System.getenv("USEND_API_KEY"));
        try {
            Map<String, Object> sent = usend.emails.send(Map.of(
                "from", "Acme <hello@acme.com>",
                "to", List.of("ann@example.com"),
                "subject", "Hello from usend",
                "html", "<p>It works!</p>"));
            System.out.println("queued: " + sent.get("id"));
        } catch (UsendException e) {
            System.err.println("failed " + e.getStatusCode() + " " + e.getErrorName() + ": " + e.getMessage());
            System.exit(1);
        }
    }
}
```

Responses are plain `Map` and `List` values. Pass an idempotency key to make retries safe: `usend.emails.send(email, Usend.newIdempotencyKey())`. Rate-limited requests are retried for you.

## Verify a webhook

```java
Map<String, Object> event = Webhook.verify(rawBody, headers, System.getenv("USEND_WEBHOOK_SECRET"));
```

## Plain HTTP, Spring and SMTP

You can skip the SDK: `POST https://api.usend.et/emails` with `Authorization: Bearer <key>` works from any HTTP client, such as the JDK's `HttpClient`.

Spring Boot's `JavaMailSender` can use usend over SMTP: set `spring.mail.host=smtp.usend.et`, `spring.mail.port=587`, `spring.mail.username=usend`, `spring.mail.password=<API key>` and `spring.mail.properties.mail.smtp.starttls.enable=true`. `usend.smtpConfig()` returns these settings. See [Send with SMTP](https://usend.et/docs/sending/smtp).

All fields: [Send emails](https://usend.et/docs/sending/emails). Retries: [Idempotency](https://usend.et/docs/sending/idempotency).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
