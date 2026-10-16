import { Hono } from 'hono';
import { Usend } from '@usend/node';

type Bindings = { USEND_API_KEY: string };
const app = new Hono<{ Bindings: Bindings }>();

app.post('/send', async (c) => {
  const usend = new Usend(c.env.USEND_API_KEY);
  const { email } = await c.req.json<{ email: string }>();

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    html: '<p>Thanks for signing up.</p>',
  });

  if (error) return c.json({ error }, 502);
  return c.json({ id: data.id });
});

export default app;
