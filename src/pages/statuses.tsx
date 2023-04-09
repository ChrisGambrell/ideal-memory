import { Container, createStyles, rem, Stack, Text, Title } from "@mantine/core";
import { useDebouncedState, useDebouncedValue, useListState } from "@mantine/hooks";
import { IconGripVertical } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { api } from "~/utils/api";

const useStyles = createStyles((theme) => ({
  item: {
    display: "flex",
    alignItems: "center",
    borderRadius: theme.radius.md,
    border: `${rem(1)} solid ${theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]}`,
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    paddingLeft: `calc(${theme.spacing.xl} - ${theme.spacing.md})`, // to offset drag handle
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },

  symbol: {
    fontSize: rem(30),
    fontWeight: 700,
    width: rem(60),
  },

  dragHandle: {
    ...theme.fn.focusStyles(),
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[6],
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
  },
}));

export default function Statuses() {
  const { data: statuses = [] } = api.status.getAll.useQuery();
  const { mutate: reorderStatuses } = api.status.reorder.useMutation();
  //   const data = [
  //     {
  //       position: 6,
  //       mass: 12.011,
  //       symbol: "C",
  //       name: "Carbon",
  //     },
  //     {
  //       position: 7,
  //       mass: 14.007,
  //       symbol: "N",
  //       name: "Nitrogen",
  //     },
  //     {
  //       position: 39,
  //       mass: 88.906,
  //       symbol: "Y",
  //       name: "Yttrium",
  //     },
  //     {
  //       position: 56,
  //       mass: 137.33,
  //       symbol: "Ba",
  //       name: "Barium",
  //     },
  //     {
  //       position: 58,
  //       mass: 140.12,
  //       symbol: "Ce",
  //       name: "Cerium",
  //     },
  //   ];

  const { classes, cx } = useStyles();
  const [state, handlers] = useListState(statuses);
  const [reordered] = useState(state);

  useEffect(() => {
    handlers.setState(statuses);
  }, [statuses]);

  useEffect(() => {
    if (reordered !== state) reorderStatuses(state.map(({ id, label }, order) => ({ id, label, order })));
  }, [reordered, state]);

  const items = state.map((item, index) => (
    <Draggable key={item.id} index={index} draggableId={item.id}>
      {(provided, snapshot) => (
        <div
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
          {...provided.draggableProps}
          ref={provided.innerRef}
        >
          <div {...provided.dragHandleProps} className={classes.dragHandle}>
            <IconGripVertical size="1.05rem" stroke={1.5} />
          </div>
          <Text className={classes.symbol}>{item.label}</Text>
          {/* <div>
            <Text>{item.name}</Text>
            <Text color="dimmed" size="sm">
              Position: {item.position} • Mass: {item.mass}
            </Text>
          </div> */}
        </div>
      )}
    </Draggable>
  ));

  return (
    <Container mt={16} size="xs">
      <Stack>
        <Title order={2}>Statuses</Title>
        <DragDropContext
          onDragEnd={({ destination, source }) => {
            handlers.reorder({ from: source.index, to: destination?.index || 0 });
            // console.log(asdf);
            // console.log(state);
          }}
        >
          <Droppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Stack>
    </Container>
  );
}
