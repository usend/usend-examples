import { Usend } from '@usend/node';

const usend = new Usend(Bun.env.USEND_API_KEY);

Bun.serve({
  port: 3000,
  async fetch(req) {
    if (req.method !== 'POST') return new Response('POST only', { status: 405 });
    const { email } = await req.json();
    const { data, error } = await usend.emails.send({
      from: 'Acme <hello@acme.com>',
      to: [email],
      subject: 'Welcome',
      text: 'Thanks for signing up.',
    });
    return Response.json(error ? { error } : { id: data.id }, { status: error ? 502 : 200 });
  },
});
