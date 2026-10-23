import { Usend } from '@usend/node';
import { WelcomeEmail } from '../../../emails/welcome';

const usend = new Usend(process.env.USEND_API_KEY);

export async function POST(request: Request) {
  const { email, name } = await request.json();

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    react: <WelcomeEmail name={name} />,
  });

  if (error) return Response.json({ error }, { status: error.statusCode || 500 });
  return Response.json({ id: data.id });
}
