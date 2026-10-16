# Send with Astro

Send email from an Astro endpoint or action with the usend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/astro

Astro needs server rendering (an adapter, or `output: 'server'`) for endpoints that run on request. You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install

```bash
npm install @usend/node
```

`.env.example`

```bash
USEND_API_KEY=us_123456789
```

## 2. API endpoint

`src/pages/api/send.ts`

```ts
import type { APIRoute } from 'astro';
import { Usend } from '@usend/node';

export const prerender = false;

const usend = new Usend(import.meta.env.USEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const { email, message } = await request.json();

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: ['support@acme.com'],
    reply_to: email,
    subject: 'Contact form',
    text: message,
  });

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 502 });
  }
  return new Response(JSON.stringify({ id: data.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
```

Variables without the `PUBLIC_` prefix stay on the server.

## 3. Call it from a page

`src/pages/contact.astro`

```astro
<form id="contact">
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <button>Send</button>
</form>

<script>
  document.getElementById('contact')!.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.target as HTMLFormElement));
    const res = await fetch('/api/send', { method: 'POST', body: JSON.stringify(data) });
    alert(res.ok ? 'Sent' : 'Something went wrong');
  });
</script>
```

Keep the `from` address fixed on your verified domain. Next: [Send emails](https://usend.et/docs/sending/emails).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
