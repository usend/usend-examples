import { Usend } from '@usend/node';

const usend = new Usend(Bun.env.USEND_API_KEY);

const { data, error } = await usend.emails.send({
  from: 'Acme <hello@acme.com>',
  to: ['ann@example.com'],
  subject: 'Hello from Bun',
  html: '<p>It works!</p>',
});

console.log(error ?? data);
