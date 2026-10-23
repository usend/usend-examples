# Send with Express

Send email from an Express route with the uSend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/express

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install

```bash
npm install express @usend/node
```

## 2. Write the server

`server.mjs`

```js
import express from 'express';
import { Usend } from '@usend/node';

const app = express();
app.use(express.json());

const usend = new Usend(process.env.USEND_API_KEY);

app.post('/send', async (req, res) => {
  const { email } = req.body;

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    html: '<p>Thanks for signing up.</p>',
  });

  if (error) return res.status(error.statusCode || 500).json({ error });
  res.json({ id: data.id });
});

app.listen(3000, () => console.log('listening on :3000'));
```

## 3. Run and test

```bash
USEND_API_KEY=us_123456789 node server.mjs
curl -X POST localhost:3000/send -H 'Content-Type: application/json' -d '{"email":"you@example.com"}'
```

## Receive webhooks in the same app

uSend signs webhooks, and verification needs the raw request body, so mount the raw parser on that route only:

```js
import { verifyWebhook } from '@usend/node';

app.post('/webhooks/usend', express.raw({ type: 'application/json' }), async (req, res) => {
  try {
    const event = await verifyWebhook({
      payload: req.body.toString(),
      headers: req.headers,
      secret: process.env.USEND_WEBHOOK_SECRET,
    });
    console.log(event.type);
    res.sendStatus(200);
  } catch {
    res.sendStatus(400);
  }
});
```

Mount this route before `app.use(express.json())` or it will receive a parsed body. See [Verify signatures](https://usend.et/docs/webhooks/verify-signatures).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
