import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useActionData } from '@remix-run/react';
import { Usend } from '@usend/node';

const usend = new Usend(process.env.USEND_API_KEY);

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData();
  const email = String(form.get('email') ?? '');
  const message = String(form.get('message') ?? '');

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: ['support@acme.com'],
    reply_to: email,
    subject: 'New contact form message',
    text: message,
  });

  if (error) return json({ ok: false, error: error.message }, { status: 502 });
  return json({ ok: true, id: data.id });
}

export default function Contact() {
  const result = useActionData<typeof action>();
  return (
    <Form method="post">
      <input name="email" type="email" required />
      <textarea name="message" required />
      <button type="submit">Send</button>
      {result?.ok && <p>Thanks, we got it.</p>}
    </Form>
  );
}
