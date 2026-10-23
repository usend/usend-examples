# Send with Cloudflare Workers

Send email from a Cloudflare Worker with fetch and a secret.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/cloudflare-workers

Workers have no Node.js APIs by default, but the uSend SDK only needs `fetch`, so it works. You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Create the project and secret

```bash
npm create cloudflare@latest usend-worker
cd usend-worker
npm install @usend/node
npx wrangler secret put USEND_API_KEY
```

For local development, put `USEND_API_KEY=us_123456789` in `.dev.vars`.

## 2. The Worker

`src/index.ts`

```ts
import { Usend } from '@usend/node';

interface Env {
  USEND_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') return new Response('POST only', { status: 405 });

    const usend = new Usend(env.USEND_API_KEY);
    const { email } = (await request.json()) as { email: string };

    const { data, error } = await usend.emails.send({
      from: 'Acme <hello@acme.com>',
      to: [email],
      subject: 'Welcome to Acme',
      html: '<p>Thanks for signing up.</p>',
    });

    if (error) return Response.json({ error }, { status: 502 });
    return Response.json({ id: data.id });
  },
};
```

## 3. Run and deploy

```bash
npx wrangler dev
curl -X POST localhost:8787 -d '{"email":"you@example.com"}'
npx wrangler deploy
```

## Without the SDK

```ts
const res = await fetch('https://api.usend.et/emails', {
  method: 'POST',
  headers: { Authorization: `Bearer ${env.USEND_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ from: 'Acme <hello@acme.com>', to: ['ann@example.com'], subject: 'Hi', text: 'Hi' }),
});
```

> **Note**
> Do not let browsers call the uSend API directly with your key. Always go through your Worker. See [CORS](https://usend.et/docs/guides/cors).

If you want a send to continue after the response, wrap it in `ctx.waitUntil(...)`. Next: [Send emails](https://usend.et/docs/sending/emails).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
