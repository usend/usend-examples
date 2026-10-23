# Send with SvelteKit

Send email from a SvelteKit form action with the uSend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/sveltekit

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Install

```bash
npm install @usend/node
```

## 2. Add the key

`.env.example`

```bash
USEND_API_KEY=us_123456789
```

Import it from `$env/static/private`, which SvelteKit refuses to bundle into client code.

## 3. Form action

`src/routes/contact/+page.server.ts`

```ts
import { fail } from '@sveltejs/kit';
import { Usend } from '@usend/node';
import { USEND_API_KEY } from '$env/static/private';
import type { Actions } from './$types';

const usend = new Usend(USEND_API_KEY);

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '');
    const message = String(form.get('message') ?? '');

    const { error } = await usend.emails.send({
      from: 'Acme <hello@acme.com>',
      to: ['support@acme.com'],
      reply_to: email,
      subject: 'New contact form message',
      text: message,
    });

    if (error) return fail(502, { message: error.message });
    return { success: true };
  },
};
```

## 4. The form

`src/routes/contact/+page.svelte`

```svelte
<script lang="ts">
  import { enhance } from '$app/forms';
  let { form } = $props();
</script>

<form method="POST" use:enhance>
  <input name="email" type="email" required />
  <textarea name="message" required></textarea>
  <button>Send</button>
  {#if form?.success}<p>Thanks, we got it.</p>{/if}
  {#if form?.message}<p>{form.message}</p>{/if}
</form>
```

For plain HTTP use `fetch('https://api.usend.et/emails', ...)` as in [Send with Node.js](https://usend.et/docs/quickstarts/nodejs#plain-http-instead). More fields: [Send emails](https://usend.et/docs/sending/emails).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
