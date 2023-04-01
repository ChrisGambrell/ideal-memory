import { ActionIcon, Button, Checkbox, Container, Divider, Group, Menu, Stack, Text, TextInput, Title } from "@mantine/core";
import { IconFilter, IconSquareCheck, IconSquareOff, IconTrash } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { Fragment, useState, type ChangeEvent } from "react";
import { verifyAuth } from "~/server/auth";
import { api } from "~/utils/api";
import { useUser } from "~/utils/hooks";

export default function Home() {
  const [taskFilter, setTaskFilter] = useState("");
  const [completedFilter, setCompletedFilter] = useState<boolean | null>(null);
  const user = useUser();

  const ctx = api.useContext();
  const { data: tasks = [], isLoading: loadingTasks } = api.tasks.getAll.useQuery();
  const { mutate: updateTask } = api.tasks.updateById.useMutation({ onSuccess: () => ctx.tasks.invalidate() });
  const { mutate: deleteTask, isLoading: loadingDeleteTask } = api.tasks.deleteById.useMutation({
    onSuccess: () => ctx.tasks.invalidate(),
  });

  const filteredTasks = tasks
    .filter(({ completed }) => (completedFilter === null ? true : completed === completedFilter))
    .filter(({ body }) => body.toLowerCase().includes(taskFilter.toLowerCase()));

  const toggleTask = (id: string) => (e: ChangeEvent<HTMLInputElement>) => updateTask({ id, data: { completed: e.target.checked } });

  if (loadingTasks) return <div>Loading tasks...</div>;
  return (
    <Container mt={16} size="xs">
      <Stack spacing="xl">
        <Group position="apart">
          <Title order={2}>Welcome, {user.name}</Title>
          <Button color="red" variant="outline" onClick={() => void signOut()}>
            Sign out
          </Button>
        </Group>
        <div className="flex items-center space-x-2">
          <TextInput
            className="flex-1"
            placeholder="Search for tasks..."
            value={taskFilter}
            onChange={(e) => setTaskFilter(e.target.value)}
          />
          <Menu position="bottom-end" shadow="md" width={200}>
            <Menu.Target>
              <ActionIcon className="flex-shrink-0" bg={completedFilter !== null ? "gray.1" : ""} size="lg" variant="default">
                <IconFilter size="1.125rem" />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item
                bg={completedFilter === true ? "gray.1" : ""}
                icon={<IconSquareCheck size={14} />}
                onClick={() => setCompletedFilter((p) => (p === true ? null : true))}
              >
                Show Completed
              </Menu.Item>
              <Menu.Item
                bg={completedFilter === false ? "gray.1" : ""}
                icon={<IconSquareOff size={14} />}
                onClick={() => setCompletedFilter((p) => (p === false ? null : false))}
              >
                Show Incomplete
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        <Stack spacing="xs">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, i) => (
              <Fragment key={task.id}>
                <Group position="apart">
                  <Checkbox key={task.id} label={task.body} checked={task.completed} onChange={toggleTask(task.id)} />
                  <ActionIcon
                    color="red"
                    loading={loadingDeleteTask}
                    size="sm"
                    variant="subtle"
                    onClick={() => deleteTask({ id: task.id })}
                  >
                    <IconTrash size="0.875rem" />
                  </ActionIcon>
                </Group>
                {i !== filteredTasks.length - 1 && <Divider my={4} />}
              </Fragment>
            ))
          ) : (
            <Group position="center">
              <Text c="gray">Nothing here!</Text>
            </Group>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}

export const getServerSideProps = verifyAuth;
