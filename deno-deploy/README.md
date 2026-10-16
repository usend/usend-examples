# Send with Deno Deploy

Send email from Deno Deploy using fetch and an environment variable.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/deno-deploy

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). Deno needs no SDK: `fetch` is built in.

## 1. Write the server

`main.ts`

```ts
const apiKey = Deno.env.get('USEND_API_KEY');

async function sendEmail(to: string) {
  const res = await fetch('https://api.usend.et/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Acme <hello@acme.com>',
      to: [to],
      subject: 'Hello from Deno',
      html: '<p>It works!</p>',
    }),
  });
  return { ok: res.ok, body: await res.json() };
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('POST only', { status: 405 });
  const { email } = await req.json();
  const { ok, body } = await sendEmail(email);
  return Response.json(body, { status: ok ? 200 : 502 });
});
```

On success the body is `{ "id": "..." }`; on failure it is `{ "statusCode", "name", "message" }`.

## 2. Run locally

```bash
USEND_API_KEY=us_123456789 deno run --allow-net --allow-env main.ts
curl -X POST localhost:8000 -d '{"email":"you@example.com"}'
```

## 3. Deploy

```bash
deno deploy --prod
```

Add `USEND_API_KEY` as an environment variable in the project's settings on Deno Deploy, not in the code.

## Using the SDK

The SDK also runs on Deno through npm specifiers:

```ts
import { Usend } from 'npm:@usend/node';

const usend = new Usend(Deno.env.get('USEND_API_KEY'));
const { data, error } = await usend.emails.send({
  from: 'Acme <hello@acme.com>',
  to: ['ann@example.com'],
  subject: 'Hello',
  text: 'Hi',
});
```

See [Send emails](https://usend.et/docs/sending/emails) for every field, and [Errors](https://usend.et/docs/api-reference/errors) for the error names.

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
