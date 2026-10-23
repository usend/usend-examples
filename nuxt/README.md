# Send with Nuxt

Send email from a Nuxt server route with the uSend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/nuxt

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). Nitro server routes run on the server only.

## 1. Install

```bash
npm install @usend/node
```

## 2. Configure the key

`nuxt.config.ts`

```ts
export default defineNuxtConfig({
  runtimeConfig: {
    usendApiKey: '', // private: set NUXT_USEND_API_KEY in the environment
  },
});
```

`.env.example`

```bash
NUXT_USEND_API_KEY=us_123456789
```

Keys under `runtimeConfig` but outside `public` are never sent to the browser.

## 3. Server route

`server/api/send.post.ts`

```ts
import { Usend } from '@usend/node';

export default defineEventHandler(async (event) => {
  const { usendApiKey } = useRuntimeConfig(event);
  const usend = new Usend(usendApiKey);
  const { email } = await readBody(event);

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    html: '<p>Thanks for signing up.</p>',
  });

  if (error) {
    throw createError({ statusCode: error.statusCode || 500, statusMessage: error.message });
  }
  return { id: data.id };
});
```

## 4. Call it from a page

`pages/index.vue`

```vue
<script setup lang="ts">
const email = ref('');
async function send() {
  await $fetch('/api/send', { method: 'POST', body: { email: email.value } });
}
</script>

<template>
  <form @submit.prevent="send">
    <input v-model="email" type="email" required />
    <button>Send welcome email</button>
  </form>
</template>
```

Your page talks to your own route; the route talks to uSend. Next: [Send emails](https://usend.et/docs/sending/emails).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
