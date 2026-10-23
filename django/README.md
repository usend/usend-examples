# Send with Django

Send email from Django with the uSend SDK, or through SMTP and send_mail.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/django

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). Django can use uSend two ways: the SDK below, or SMTP so `send_mail()` keeps working ([Django with SMTP](https://usend.et/docs/smtp-guides/django)).

## 1. Install and configure

```bash
pip install usend
```

`settings.py`

```python
import os

USEND_API_KEY = os.environ["USEND_API_KEY"]
```

## 2. A helper

`myapp/mail.py`

```python
from django.conf import settings
from usend import Usend

_client = Usend(settings.USEND_API_KEY)

def send_email(to, subject, html, *, idempotency_key=None):
    """Returns the usend email id. Raises usend.UsendError on failure."""
    result = _client.emails.send(
        {
            "from": "Acme <hello@acme.com>",
            "to": [to] if isinstance(to, str) else list(to),
            "subject": subject,
            "html": html,
        },
        idempotency_key=idempotency_key,
    )
    return result["id"]
```

## 3. Use it in a view

`myapp/views.py`

```python
from django.http import JsonResponse
from django.template.loader import render_to_string
from django.views.decorators.http import require_POST
from usend import UsendError

from .mail import send_email

@require_POST
def invite(request):
    email = request.POST["email"]
    html = render_to_string("emails/invite.html", {"inviter": request.user})
    try:
        email_id = send_email(email, "You are invited", html, idempotency_key=f"invite-{email}")
    except UsendError as e:
        return JsonResponse({"error": str(e)}, status=502)
    return JsonResponse({"id": email_id})
```

Run slow or bulk sends from a task queue (Celery, Django-Q, RQ) rather than the request.

## Webhooks

```python
from usend import verify_webhook

def usend_webhook(request):
    event = verify_webhook(request.body.decode(), request.headers, settings.USEND_WEBHOOK_SECRET)
```

Exempt the view from CSRF (`@csrf_exempt`); the signature is its protection. See [Verify signatures](https://usend.et/docs/webhooks/verify-signatures).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
