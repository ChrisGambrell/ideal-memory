import { Anchor, Button, Center, Container, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/router";
import { z } from "zod";
import { api } from "~/utils/api";

export default function SignIn() {
  const router = useRouter();

  const form = useForm({
    initialValues: { root: "", email: "", password: "" },
    validate: zodResolver(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    ),
  });

  const { mutate: signIn, isLoading: loadingSignIn } = api.auth.signIn.useMutation({
    onSuccess: () => router.push("/"),
    onError: (error) => form.setFieldError("root", error.message),
  });

  const handleSubmit = (values: typeof form.values) => signIn(values);

  return (
    <Container mt={16} size="xs">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack spacing="sm">
          <Center>
            <Title order={2}>Sign in</Title>
          </Center>
          <TextInput label="Email address" placeholder="you@example.com" {...form.getInputProps("email")} />
          <PasswordInput label="Password" {...form.getInputProps("password")} />
          {form.errors.root && (
            <Text c="red" size="sm">
              {form.errors.root}
            </Text>
          )}
          <Anchor component={Link} href="/sign-up">
            Don&apos;t have an account? Sign up
          </Anchor>
          <Button loading={loadingSignIn} type="submit">
            Sign in
          </Button>
        </Stack>
      </form>
    </Container>
  );
}
