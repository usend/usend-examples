import type { APIRoute } from 'astro';
import { Usend } from '@usend/node';

export const prerender = false;

const usend = new Usend(import.meta.env.USEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  const { email, message } = await request.json();

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: ['support@acme.com'],
    reply_to: email,
    subject: 'Contact form',
    text: message,
  });

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 502 });
  }
  return new Response(JSON.stringify({ id: data.id }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
