import { Usend } from '@usend/node';

export default defineEventHandler(async (event) => {
  const { usendApiKey } = useRuntimeConfig(event);
  const usend = new Usend(usendApiKey);
  const { email } = await readBody(event);

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    html: '<p>Thanks for signing up.</p>',
  });

  if (error) {
    throw createError({ statusCode: error.statusCode || 500, statusMessage: error.message });
  }
  return { id: data.id };
});
