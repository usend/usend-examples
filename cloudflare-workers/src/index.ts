import { Usend } from '@usend/node';

interface Env {
  USEND_API_KEY: string;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== 'POST') return new Response('POST only', { status: 405 });

    const usend = new Usend(env.USEND_API_KEY);
    const { email } = (await request.json()) as { email: string };

    const { data, error } = await usend.emails.send({
      from: 'Acme <hello@acme.com>',
      to: [email],
      subject: 'Welcome to Acme',
      html: '<p>Thanks for signing up.</p>',
    });

    if (error) return Response.json({ error }, { status: 502 });
    return Response.json({ id: data.id });
  },
};
