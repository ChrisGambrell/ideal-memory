import { Anchor, Button, Center, Container, PasswordInput, Stack, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { z } from "zod";

export default function SignUp() {
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validate: zodResolver(
      z.object({
        name: z.string().min(2),
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
            <Title order={2}>Sign up</Title>
          </Center>
          <TextInput label="Full name" placeholder="Your name" {...form.getInputProps("name")} />
          <TextInput label="Email address" placeholder="you@example.com" {...form.getInputProps("email")} />
          <PasswordInput label="Password" {...form.getInputProps("password")} />
          <Anchor component={Link} href="/sign-in">
            Already have an account? Sign in
          </Anchor>
          <Button type="submit">Sign up</Button>
        </Stack>
      </form>
    </Container>
  );
}
