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
