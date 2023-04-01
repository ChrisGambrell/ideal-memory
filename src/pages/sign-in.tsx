import { Anchor, Button, Center, Container, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import Link from "next/link";

export default function SignIn() {
  return (
    <Container mt={16} size="xs">
      <Stack spacing="sm">
        <Center>
          <Title order={2}>Sign in</Title>
        </Center>
        <TextInput label="Email address" placeholder="you@example.com" />
        <PasswordInput label="Password" />
        <Anchor component={Link} href="/sign-up">
          Don&apos;t have an account? Sign up
        </Anchor>
        <Button>Sign in</Button>
      </Stack>
    </Container>
  );
}
