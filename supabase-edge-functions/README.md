# Send with Supabase Edge Functions

Send email from a Supabase Edge Function with fetch and a secret.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/supabase-edge-functions

Edge Functions run on Deno. You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys).

## 1. Create the function and secret

```bash
supabase functions new send-email
supabase secrets set USEND_API_KEY=us_123456789
```

## 2. Write it

`supabase/functions/send-email/index.ts`

```ts
Deno.serve(async (req) => {
  const { email } = await req.json();

  const res = await fetch('https://api.usend.et/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${Deno.env.get('USEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Acme <hello@acme.com>',
      to: [email],
      subject: 'Welcome to Acme',
      html: '<p>Thanks for signing up.</p>',
    }),
  });

  const body = await res.json();
  return new Response(JSON.stringify(body), {
    status: res.ok ? 200 : 502,
    headers: { 'Content-Type': 'application/json' },
  });
});
```

A successful response is `{ "id": "..." }`. An error is `{ "statusCode", "name", "message" }`. See [Errors](https://usend.et/docs/api-reference/errors).

## 3. Serve and deploy

```bash
supabase functions serve --env-file .env
curl -X POST http://localhost:54321/functions/v1/send-email \
  -H "Authorization: Bearer $SUPABASE_ANON_KEY" \
  -H 'Content-Type: application/json' -d '{"email":"you@example.com"}'

supabase functions deploy send-email
```

The `Authorization` header here is Supabase's, not usend's: it lets the caller reach your function.

## Sending auth emails through usend

To send Supabase Auth emails (confirmations, magic links) through usend, you do not need a function: use SMTP. See [Supabase Auth with SMTP](https://usend.et/docs/smtp-guides/supabase-auth).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
