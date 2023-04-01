import { Anchor, Button, Center, Container, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import Link from "next/link";

export default function SignUp() {
  return (
    <Container mt={16} size="xs">
      <Stack spacing="sm">
        <Center>
          <Title order={2}>Sign up</Title>
        </Center>
        <TextInput label="Full name" placeholder="Your name" />
        <TextInput label="Email address" placeholder="you@example.com" />
        <PasswordInput label="Password" />
        <Anchor component={Link} href="/sign-in">
          Already have an account? Sign in
        </Anchor>
        <Button>Sign up</Button>
      </Stack>
    </Container>
  );
}
