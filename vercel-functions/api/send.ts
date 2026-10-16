import { Usend } from '@usend/node';

const usend = new Usend(process.env.USEND_API_KEY);

export async function POST(request: Request) {
  const { email } = await request.json();

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    html: '<p>Thanks for signing up.</p>',
  });

  if (error) return Response.json({ error }, { status: 502 });
  return Response.json({ id: data.id });
}
