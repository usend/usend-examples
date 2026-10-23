# Send with Hono

Send email from a Hono app with the uSend SDK, on Node, Bun, Deno or Workers.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/hono

Hono runs on many runtimes; the uSend SDK uses only `fetch`, so the same code works on all of them. You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install

```bash
npm install hono @usend/node
```

## 2. Write the app

`src/index.ts`

```ts
import { Hono } from 'hono';
import { Usend } from '@usend/node';

type Bindings = { USEND_API_KEY: string };
const app = new Hono<{ Bindings: Bindings }>();

app.post('/send', async (c) => {
  const usend = new Usend(c.env.USEND_API_KEY);
  const { email } = await c.req.json<{ email: string }>();

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    html: '<p>Thanks for signing up.</p>',
  });

  if (error) return c.json({ error }, 502);
  return c.json({ id: data.id });
});

export default app;
```

On Cloudflare Workers `c.env` holds your secrets. On Node, use `process.env.USEND_API_KEY` instead (with `@hono/node-server`'s `serve`).

## 3. Run it

```bash
# Cloudflare Workers
npx wrangler secret put USEND_API_KEY
npx wrangler dev

# Then
curl -X POST localhost:8787/send -H 'Content-Type: application/json' -d '{"email":"you@example.com"}'
```

## Notes

- Create the client inside the handler when your runtime exposes secrets per request (Workers), or once at startup on Node.
- Check `error.statusCode`: `429` means you hit a [rate or quota limit](https://usend.et/docs/api-reference/rate-limits), and the `retry-after` header tells you how long to wait.

More fields: [Send emails](https://usend.et/docs/sending/emails).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
