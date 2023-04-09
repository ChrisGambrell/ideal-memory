import { Anchor, Button, Center, Container, Group, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";
import { api } from "~/utils/api";

export default function SignUp() {
  const router = useRouter();

  const form = useForm({
    initialValues: {
      root: "",
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    },
    validate: zodResolver(
      z.object({
        firstName: z.string().min(1),
        lastName: z.string().min(1),
        email: z.string().email(),
        password: z.string().min(6),
      })
    ),
  });

  const { mutate: signUp, isLoading: loadingSignUp } = api.users.create.useMutation({
    onSuccess: () => router.push("/sign-in"),
    onError: (error) => form.setFieldError("root", error.message),
  });

  const handleSubmit = (values: typeof form.values) => signUp(values);

  return (
    <Container mt={16} size="xs">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="sm">
          <Center>
            <Title order={2}>Sign up</Title>
          </Center>
          <Group grow>
            <TextInput label="First name" placeholder="Your first name" {...form.getInputProps("firstName")} />
            <TextInput label="Last name" placeholder="Your last name" {...form.getInputProps("lastName")} />
          </Group>
          <TextInput label="Email address" placeholder="you@example.com" {...form.getInputProps("email")} />
          <PasswordInput label="Password" {...form.getInputProps("password")} />
          {form.errors.root && (
            <Text c="red" size="sm">
              {form.errors.root}
            </Text>
          )}
          <Anchor component={Link} href="/sign-in">
            Already have an account? Sign in
          </Anchor>
          <Button loading={loadingSignUp} type="submit">
            Sign up
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
