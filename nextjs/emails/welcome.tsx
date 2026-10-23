import { Body, Button, Container, Head, Heading, Html, Preview, Text } from '@react-email/components';

export function WelcomeEmail({ name }: { name: string }) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to Acme, {name}</Preview>
      <Body style={{ fontFamily: 'sans-serif', backgroundColor: '#ffffff' }}>
        <Container>
          <Heading>Welcome, {name}</Heading>
          <Text>Thanks for signing up. Your account is ready.</Text>
          <Button href="https://acme.com/dashboard" style={{ background: '#111', color: '#fff', padding: '12px 20px' }}>
            Open your dashboard
          </Button>
        </Container>
      </Body>
    </Html>
  );
}
