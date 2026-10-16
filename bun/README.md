# Send with Bun

Send email from Bun with the usend SDK or plain fetch.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/bun

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install

```bash
bun add @usend/node
```

Bun loads `.env` files automatically:

`.env.example`

```bash
USEND_API_KEY=us_123456789
```

## 2. Send

`send.ts`

```ts
import { Usend } from '@usend/node';

const usend = new Usend(Bun.env.USEND_API_KEY);

const { data, error } = await usend.emails.send({
  from: 'Acme <hello@acme.com>',
  to: ['ann@example.com'],
  subject: 'Hello from Bun',
  html: '<p>It works!</p>',
});

console.log(error ?? data);
```

```bash
bun run send.ts
```

## A small HTTP server

`server.ts`

```ts
import { Usend } from '@usend/node';

const usend = new Usend(Bun.env.USEND_API_KEY);

Bun.serve({
  port: 3000,
  async fetch(req) {
    if (req.method !== 'POST') return new Response('POST only', { status: 405 });
    const { email } = await req.json();
    const { data, error } = await usend.emails.send({
      from: 'Acme <hello@acme.com>',
      to: [email],
      subject: 'Welcome',
      text: 'Thanks for signing up.',
    });
    return Response.json(error ? { error } : { id: data.id }, { status: error ? 502 : 200 });
  },
});
```

## Without the SDK

```ts
const res = await fetch('https://api.usend.et/emails', {
  method: 'POST',
  headers: { Authorization: `Bearer ${Bun.env.USEND_API_KEY}`, 'Content-Type': 'application/json' },
  body: JSON.stringify({ from: 'Acme <hello@acme.com>', to: ['ann@example.com'], subject: 'Hi', text: 'Hi' }),
});
```

See [Send emails](https://usend.et/docs/sending/emails) for all fields.

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
