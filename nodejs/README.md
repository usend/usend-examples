# Send with Node.js

Send your first email from a Node.js script with the uSend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/nodejs

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). The SDK needs Node.js 18 or newer and has no dependencies.

## 1. Install

```bash
npm install @usend/node
```

## 2. Set your API key

```bash
export USEND_API_KEY="us_123456789"
```

## 3. Send

Create `send.mjs`:

`send.mjs`

```js
import { Usend } from '@usend/node';

const usend = new Usend(process.env.USEND_API_KEY);

const { data, error } = await usend.emails.send({
  from: 'Acme <hello@acme.com>',
  to: ['ann@example.com'],
  subject: 'Hello from usend',
  html: '<p>It works!</p>',
});

if (error) {
  console.error(error.statusCode, error.name, error.message);
  process.exit(1);
}
console.log('queued', data.id);
```

```bash
node send.mjs
```

Every SDK method resolves to `{ data, error }`; exactly one of them is `null`, so you never need `try/catch` around API errors.

## Plain HTTP instead

```js
const res = await fetch('https://api.usend.et/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${process.env.USEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ from: 'Acme <hello@acme.com>', to: ['ann@example.com'], subject: 'Hello', html: '<p>Hi</p>' }),
});
console.log(await res.json());
```

## Next steps

- [Send emails](https://usend.et/docs/sending/emails) for every field (cc, bcc, tags, headers, scheduling).
- [Attachments](https://usend.et/docs/sending/attachments) and [templates](https://usend.et/docs/sending/templates).
- [Webhooks](https://usend.et/docs/webhooks/introduction) to follow delivery.

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
