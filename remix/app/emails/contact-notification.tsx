import { Body, Html, Text } from '@react-email/components';

export function ContactNotification({ email, message }: { email: string; message: string }) {
  return (
    <Html>
      <Body style={{ fontFamily: 'sans-serif' }}>
        <Text>New message from {email}:</Text>
        <Text>{message}</Text>
      </Body>
    </Html>
  );
}
