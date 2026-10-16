# Send with Next.js

Send email from a Next.js route handler or server action with the usend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/nextjs

Send from the server only: an API key must never reach the browser. This page uses the App Router. You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install

```bash
npm install @usend/node
```

## 2. Add the key

`.env.local.example`

```bash
USEND_API_KEY=us_123456789
```

Do not prefix it with `NEXT_PUBLIC_`: that would put it in the browser bundle.

## 3. Route handler

`app/api/send/route.ts`

```ts
import { Usend } from '@usend/node';

const usend = new Usend(process.env.USEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    html: '<p>Thanks for signing up.</p>',
  });

  if (error) return Response.json({ error }, { status: error.statusCode || 500 });
  return Response.json({ id: data.id });
}
```

## Or a server action

`app/actions.ts`

```ts
'use server';
import { Usend } from '@usend/node';

const usend = new Usend(process.env.USEND_API_KEY);

export async function sendWelcome(email: string) {
  const { error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    text: 'Thanks for signing up.',
  });
  return { ok: !error };
}
```

> **Note**
> Calling the usend API from client-side code does not work by design: the API answers cross-origin browser requests only for the usend dashboard. See [CORS](https://usend.et/docs/guides/cors).

Test it with `curl -X POST localhost:3000/api/send -d '{"email":"you@example.com"}'`. In the [sandbox](https://usend.et/docs/sending/sandbox-and-limits), send to a verified member of your organization.

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
