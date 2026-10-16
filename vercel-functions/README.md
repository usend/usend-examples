# Send with Vercel Functions

Send email from a Vercel serverless function with the usend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/vercel-functions

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install

```bash
npm install @usend/node
```

## 2. Add the key as an environment variable

```bash
vercel env add USEND_API_KEY
```

Or add it in the project's **Settings → Environment Variables**. Use a [`sending_access` key](https://usend.et/docs/api-keys#permissions), and a separate key for Preview and Production.

## 3. The function

`api/send.ts`

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

  if (error) return Response.json({ error }, { status: 502 });
  return Response.json({ id: data.id });
}
```

This is a Web-standard handler: it works in a plain Vercel project (`api/` folder) and in a Next.js route handler. For a Next.js app see [Send with Next.js](https://usend.et/docs/quickstarts/nextjs).

## 4. Deploy and test

```bash
vercel deploy
curl -X POST https://your-project.vercel.app/api/send \
  -H 'Content-Type: application/json' -d '{"email":"you@example.com"}'
```

## Tips

- Await the send inside the function. Serverless functions can be frozen as soon as they respond, so a fire-and-forget request may never leave.
- Use an [idempotency key](https://usend.et/docs/sending/idempotency) if your function can be retried, so a retry does not send twice.
- Receive delivery events with a [webhook](https://usend.et/docs/webhooks/introduction) pointing at another function.

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
