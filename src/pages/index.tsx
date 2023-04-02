import { Container, Divider, Group, Stack, Text, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { Fragment, useState } from "react";
import { z } from "zod";
import Controls from "~/components/controls";
import Task from "~/components/task";
import UserControls from "~/components/user-controls";
import { verifyAuth } from "~/server/auth";
import { api } from "~/utils/api";

export default function Home() {
  const [completedFilter, setCompletedFilter] = useState<boolean | null>(null);
  const [taskFilter, setTaskFilter] = useState("");

  const form = useForm({ initialValues: { body: "" }, validate: zodResolver(z.object({ body: z.string().min(1) })) });

  const ctx = api.useContext();
  const { data: tasks = [], isLoading: loadingTasks } = api.tasks.getAll.useQuery();
  const { mutate: createTask, isLoading: loadingCreateTask } = api.tasks.create.useMutation({
    onSuccess: () => ctx.tasks.invalidate(),
    onError: (error) => form.setFieldError("body", error.message),
  });

  const filteredTasks = tasks
    .filter(({ completed }) => (completedFilter === null ? true : completed === completedFilter))
    .filter(({ body }) => body.toLowerCase().includes(taskFilter.toLowerCase()));

  const handleSubmit = (values: typeof form.values) => createTask(values);

  if (loadingTasks) return <div>Loading tasks...</div>;
  return (
    <Container mt={16} size="xs">
      <Stack spacing="xl">
        <UserControls />
        <Controls
          completedFilter={completedFilter}
          setCompletedFilter={setCompletedFilter}
          taskFilter={taskFilter}
          setTaskFilter={setTaskFilter}
        />
        <Stack spacing="xs">
          {filteredTasks.length > 0 ? (
            filteredTasks.map((task, i) => (
              <Fragment key={task.id}>
                <Task task={task} />
                {i !== filteredTasks.length - 1 && <Divider my={4} />}
              </Fragment>
            ))
          ) : (
            <Group position="center">
              <Text c="gray">Nothing here!</Text>
            </Group>
          )}
        </Stack>
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput disabled={loadingCreateTask} placeholder="New task..." {...form.getInputProps("body")} />
        </form>
      </Stack>
    </Container>
  );
}

export const getServerSideProps = verifyAuth;
