import { Anchor, Button, Center, Container, PasswordInput, Stack, Text, TextInput, Title } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { z } from "zod";

export default function SignIn() {
  const router = useRouter();
  const { callbackUrl } = router.query;
  const [loadingSignIn, setLoadingSignIn] = useState(false);

  const form = useForm({
    initialValues: { root: "", email: "", password: "" },
    validate: zodResolver(
      z.object({
        email: z.string().email(),
        password: z.string().min(1),
      })
    ),
  });

  const handleSubmit = async (values: typeof form.values) => {
    setLoadingSignIn(true);

    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });

    setLoadingSignIn(false);
    if (res?.error) form.setFieldError("root", res.error);
    else void router.push((callbackUrl as string) ?? "/");
  };

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
