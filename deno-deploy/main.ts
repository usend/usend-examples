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
