# Send with AWS Lambda

Send email from an AWS Lambda function with the usend SDK.

Part of [usend examples](https://github.com/usend/usend-examples). Step-by-step guide: https://usend.et/docs/quickstarts/aws-lambda

You need a [verified domain](https://usend.et/docs/domains/verify) and an [API key](https://usend.et/docs/api-keys). This uses the Node.js 20 runtime or newer.

## 1. Package the function

```bash
mkdir usend-lambda && cd usend-lambda
npm init -y
npm install @usend/node
```

`index.mjs`

```js
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
```

The client is created outside the handler, so warm invocations reuse it.

## 2. Deploy

```bash
zip -r function.zip index.mjs node_modules package.json
aws lambda create-function --function-name usend-send \
  --runtime nodejs20.x --handler index.handler \
  --role arn:aws:iam::123456789012:role/lambda-basic \
  --zip-file fileb://function.zip \
  --environment "Variables={USEND_API_KEY=us_123456789}"
```

For anything beyond a test, store the key in AWS Secrets Manager or SSM Parameter Store and read it at cold start, instead of a plain environment variable.

## 3. Invoke

```bash
aws lambda invoke --function-name usend-send \
  --cli-binary-format raw-in-base64-out \
  --payload '{"body":"{\"email\":\"you@example.com\"}"}' out.json && cat out.json
```

## Tips

- Await the call before returning: Lambda freezes the environment when the handler returns.
- If the function is triggered by a queue (SQS, EventBridge), pass an [idempotency key](https://usend.et/docs/sending/idempotency) built from the message ID so retries never send twice.
- The function needs outbound internet access to `api.usend.et` (a NAT gateway if it runs in a VPC).

## Environment

Create an [API key](https://usend.et/docs/api-keys) and a [verified domain](https://usend.et/docs/domains/verify), then set `USEND_API_KEY` (starts with `us_`); copy any `.env*.example` file to its real name first. Never put the key in browser code.

## License

MIT
