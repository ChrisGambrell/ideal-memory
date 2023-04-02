import { ActionIcon, Group, Select, Text } from "@mantine/core";
import { type Task } from "@prisma/client";
import { IconTrash } from "@tabler/icons-react";
import { api } from "~/utils/api";

export default function Task({ task }: { task: Task }) {
  const ctx = api.useContext();
  const { data: statuses = [] } = api.status.getAll.useQuery();
  const { mutateAsync: createStatus } = api.status.create.useMutation({ onSuccess: () => ctx.status.invalidate() });
  const { mutate: updateTask } = api.tasks.updateById.useMutation({ onSuccess: () => ctx.tasks.invalidate() });
  const { mutate: deleteTask, isLoading: loadingDeleteTask } = api.tasks.deleteById.useMutation({
    onSuccess: () => ctx.tasks.invalidate(),
  });

  const handleUpdateTask = (statusId: string) => updateTask({ id: task.id, data: { statusId } });
  const handleCreateStatus = async (label: string) => {
    const status = await createStatus({ label });
    handleUpdateTask(status.id);
  };

  return (
    <Group position="apart">
      <Text>{task.body}</Text>
      <Group spacing="xs">
        <Select
          creatable
          data={statuses.map((s) => ({ label: s.label, value: s.id }))}
          searchable
          value={task.statusId}
          onChange={handleUpdateTask}
          getCreateLabel={(query) => `+ Create ${query}`}
          onCreate={handleCreateStatus}
        />
        <ActionIcon color="red" loading={loadingDeleteTask} size="sm" variant="subtle" onClick={() => deleteTask({ id: task.id })}>
          <IconTrash size="0.875rem" />
        </ActionIcon>
      </Group>
    </Group>
  );
}
