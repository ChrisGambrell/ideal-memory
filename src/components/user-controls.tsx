import { Button, Group, Title } from "@mantine/core";
import { signOut } from "next-auth/react";
import { useUser } from "~/utils/hooks";

export default function UserControls() {
  const user = useUser();

  return (
    <Group position="apart">
      <Title order={2}>Welcome, {user.firstName}</Title>
      <Button color="red" variant="outline" onClick={() => void signOut()}>
        Sign out
      </Button>
    </Group>
  );
}
