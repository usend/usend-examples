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
