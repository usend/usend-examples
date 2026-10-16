# Send with Remix

Send email from a Remix action with the usend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/remix

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). Remix actions and loaders run on the server, which is where the key belongs.

## 1. Install

```bash
npm install @usend/node
```

Put `USEND_API_KEY=us_123456789` in your `.env` file.

## 2. Send from an action

`app/routes/contact.tsx`

```tsx
import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { Usend } from '@usend/node';

const usend = new Usend(process.env.USEND_API_KEY);

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = String(form.get('email') ?? '');
  const message = String(form.get('message') ?? '');

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: ['support@acme.com'],
    reply_to: email,
    subject: 'New contact form message',
    text: message,
  });

  if (error) return json({ ok: false, error: error.message }, { status: 502 });
  return json({ ok: true, id: data.id });
}

export default function Contact() {
  const result = useActionData<typeof action>();
  return (
    <Form method="post">
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
      {result?.ok && <p>Thanks, we got it.</p>}
    </Form>
  );
}
```

## Notes

- Use `reply_to` so a reply to the notification goes to the visitor.
- Never put visitor input in `from`; keep it a fixed address on your verified domain.
- Every send needs one of `html`, `text` or a [template](https://usend.et/docs/sending/templates).

See [Send emails](https://usend.et/docs/sending/emails) for the full list of fields.

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
