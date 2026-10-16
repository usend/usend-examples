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
