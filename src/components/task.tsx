import { ActionIcon, Group, Select, Text } from "@mantine/core";
import { type Task } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { api } from "~/utils/api";

export default function Task({ task }: { task: Task }) {
  const ctx = api.useContext();
  const { mutate: updateTask } = api.tasks.updateById.useMutation({ onSuccess: () => ctx.tasks.invalidate() });
  const { mutate: deleteTask, isLoading: loadingDeleteTask } = api.tasks.deleteById.useMutation({
    onSuccess: () => ctx.tasks.invalidate(),
  });

  const handleUpdateTask = (completed: boolean) => updateTask({ id: task.id, data: { completed } });

  return (
    <Group position="apart">
      <Text>{task.body}</Text>
      <Group spacing="xs">
        <Select
          data={["Open", "Closed"]}
          value={task.completed ? "Closed" : "Open"}
          onChange={(value) => handleUpdateTask(value === "Closed" ? true : false)}
        />
        <ActionIcon color="red" loading={loadingDeleteTask} size="sm" variant="subtle" onClick={() => deleteTask({ id: task.id })}>
          <IconTrash size="0.875rem" />
        </ActionIcon>
      </Group>
    </Group>
  );
}
