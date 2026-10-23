# Send with Flask

Send email from a Flask view with the uSend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/flask

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install

```bash
pip install flask usend
```

## 2. The app

`app.py`

```python
from flask import Flask, jsonify, request
from usend import Usend, UsendError

app = Flask(__name__)
usend = Usend()  # reads USEND_API_KEY from the environment

@app.post("/send")
def send():
    data = request.get_json(force=True)
    try:
        email = usend.emails.send({
            "from": "Acme <hello@acme.com>",
            "to": [data["email"]],
            "subject": "Welcome to Acme",
            "html": "<p>Thanks for signing up.</p>",
        })
    except UsendError as e:
        return jsonify(error=str(e)), 502
    return jsonify(id=email["id"])
```

## 3. Run and test

```bash
export USEND_API_KEY="us_123456789"
flask --app app run
curl -X POST localhost:5000/send -d '{"email":"you@example.com"}'
```

## Webhooks

The SDK verifies signatures; pass the raw body, not parsed JSON:

```python
from usend import verify_webhook

@app.post("/webhooks/usend")
def webhook():
    try:
        event = verify_webhook(request.get_data(as_text=True), request.headers, WEBHOOK_SECRET)
    except Exception:
        return "", 400
    print(event["type"])
    return "", 200
```

See [Verify signatures](https://usend.et/docs/webhooks/verify-signatures).

## Tips

- Sending inside a request blocks the response for one HTTP round trip. For bulk or non-critical mail, hand it to a task queue such as Celery or RQ.
- Keep `from` fixed on your verified domain.

More fields: [Send emails](https://usend.et/docs/sending/emails).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
