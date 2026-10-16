import express from 'express';
import { Usend } from '@usend/node';

const app = express();
app.use(express.json());

const usend = new Usend(process.env.USEND_API_KEY);

app.post('/send', async (req, res) => {
  const { email } = req.body;

  const { data, error } = await usend.emails.send({
    from: 'Acme <hello@acme.com>',
    to: [email],
    subject: 'Welcome to Acme',
    html: '<p>Thanks for signing up.</p>',
  });

  if (error) return res.status(error.statusCode || 500).json({ error });
  res.json({ id: data.id });
});

app.listen(3000, () => console.log('listening on :3000'));
