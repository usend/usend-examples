import { Usend } from '@usend/node';

const usend = new Usend(process.env.USEND_API_KEY);

const { data, error } = await usend.emails.send({
  from: 'Acme <hello@acme.com>',
  to: ['ann@example.com'],
  subject: 'Hello from usend',
  html: '<p>It works!</p>',
});

if (error) {
  console.error(error.statusCode, error.name, error.message);
  process.exit(1);
}
console.log('queued', data.id);
