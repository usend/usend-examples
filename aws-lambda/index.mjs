import { Usend } from '@usend/node';

const usend = new Usend(process.env.USEND_API_KEY);

export const handler = async (event) => {
  const { email } = JSON.parse(event.body ?? '{}');

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    html: '<p>Thanks for signing up.</p>',
  });

  return {
    statusCode: error ? 502 : 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(error ?? { id: data.id }),
  };
};
