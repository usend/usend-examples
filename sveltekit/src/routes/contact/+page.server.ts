import { fail } from '@sveltejs/kit';
import { Usend } from '@usend/node';
import { USEND_API_KEY } from '$env/static/private';
import type { Actions } from './$types';

const usend = new Usend(USEND_API_KEY);

export const actions: Actions = {
  default: async ({ request }) => {
    const form = await request.formData();
    const email = String(form.get('email') ?? '');
    const message = String(form.get('message') ?? '');

    const { error } = await usend.emails.send({
      from: 'Acme <hello@acme.com>',
      to: ['support@acme.com'],
      reply_to: email,
      subject: 'New contact form message',
      text: message,
    });

    if (error) return fail(502, { message: error.message });
    return { success: true };
  },
};
