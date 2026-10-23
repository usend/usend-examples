# Send with Next.js

Send email from a Next.js route handler or server action with the uSend SDK.

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

## 4. Send a React Email component

Write the email as a React component with [React Email](https://react.email) and pass it as `react`. The uSend SDK renders it to HTML on your server before the request, exactly like Resend's SDK, so existing React Email templates work unchanged.

```bash
npm install @react-email/components @react-email/render
```

`emails/welcome.tsx`

```tsx
import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components';

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Acme, {name}</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#ffffff' }}>
        <Container>
          <Heading>Welcome, {name}</Heading>
          <Text>Thanks for signing up. Your account is ready.</Text>
          <Button href="https://acme.com/dashboard" style={{ background: '#111', color: '#fff', padding: '12px 20px' }}>
            Open your dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
```

`app/api/welcome/route.tsx`

```tsx
import { Usend } from '@usend/node';
import { WelcomeEmail } from '../../../emails/welcome';

const usend = new Usend(process.env.USEND_API_KEY);

export async function POST(request: Request) {
  const { email, name } = await request.json();

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    react: <WelcomeEmail name={name} />,
  });

  if (error) return Response.json({ error }, { status: error.statusCode || 500 });
  return Response.json({ id: data.id });
}
```

The file must end in `.tsx` because it contains JSX. `react` is never sent to the API: it becomes `html` (and replaces any `html` you also pass). Add `text` yourself if you want a plain-text part. `react` works the same in `usend.batch.send`, `usend.broadcasts.create` / `update` and `usend.templates.create` / `update`. Without `@react-email/render` installed, a send with `react` throws an error that says to install it.

> **Note**
> Calling the uSend API from client-side code does not work by design: the API answers cross-origin browser requests only for the uSend dashboard. See [CORS](https://usend.et/docs/guides/cors).

Test it with `curl -X POST localhost:3000/api/send -d '{"email":"you@example.com"}'` (or `/api/welcome` with `"name"` for the React Email version). In the [sandbox](https://usend.et/docs/sending/sandbox-and-limits), send to a verified member of your organization.

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
