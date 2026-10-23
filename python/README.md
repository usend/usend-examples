# Send with Python

Send your first email from Python with the uSend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/python

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). The SDK has no dependencies.

## 1. Install

```bash
pip install usend
```

## 2. Set your API key

```bash
export USEND_API_KEY="us_123456789"
```

## 3. Send

`send.py`

```python
from usend import Usend, UsendError

usend = Usend()  # reads USEND_API_KEY; or Usend("us_...")

try:
    email = usend.emails.send({
        "from": "Acme <hello@acme.com>",
        "to": ["ann@example.com"],
        "subject": "Hello from usend",
        "html": "<p>It works!</p>",
    })
    print("queued", email["id"])
except UsendError as e:
    print("failed:", e)
```

```bash
python send.py
```

Methods return the API's JSON as dicts and raise `UsendError` on failure.

## Idempotent sends

```python
usend.emails.send(payload, idempotency_key="welcome-user-123")
```

A retry with the same key returns the first result instead of sending again. See [Idempotency](https://usend.et/docs/sending/idempotency).

## Attachments

```python
import base64

with open("invoice.pdf", "rb") as f:
    content = base64.b64encode(f.read()).decode()

usend.emails.send({
    "from": "Acme <billing@acme.com>",
    "to": ["ann@example.com"],
    "subject": "Your invoice",
    "text": "Attached.",
    "attachments": [{"filename": "invoice.pdf", "content": content}],
})
```

## SMTP settings

`usend.smtp_settings()` returns the host, port, username and password for any SMTP library. See [Send with SMTP](https://usend.et/docs/sending/smtp).

## Next steps

Framework guides: [Flask](https://usend.et/docs/quickstarts/flask), [FastAPI](https://usend.et/docs/quickstarts/fastapi), [Django](https://usend.et/docs/quickstarts/django). Then [Send emails](https://usend.et/docs/sending/emails).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
