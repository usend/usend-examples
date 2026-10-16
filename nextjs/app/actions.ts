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
