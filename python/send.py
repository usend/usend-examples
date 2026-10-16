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
