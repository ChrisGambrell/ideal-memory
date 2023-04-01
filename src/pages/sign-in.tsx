import { Anchor, Button, Center, Container, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { z } from "zod";

export default function SignIn() {
  const form = useForm({
    initialValues: { email: "", password: "" },
    validate: zodResolver(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
      })
    ),
  });

  const handleSubmit = (values: typeof form.values) => console.log(values);

  return (
    <Container mt={16} size="xs">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="sm">
          <Center>
            <Title order={2}>Sign in</Title>
          </Center>
          <TextInput label="Email address" placeholder="you@example.com" {...form.getInputProps("email")} />
          <PasswordInput label="Password" {...form.getInputProps("password")} />
          <Anchor component={Link} href="/sign-up">
            Don&apos;t have an account? Sign up
          </Anchor>
          <Button type="submit">Sign in</Button>
        </Stack>
      </form>
    </Container>
  );
}
