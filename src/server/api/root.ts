import { tasksRouter } from "~/server/api/routers/tasks";
import { createTRPCRouter } from "~/server/api/trpc";
import { statusRouter } from "./routers/status";
import { usersRouter } from "./routers/users";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  status: statusRouter,
  tasks: tasksRouter,
  users: usersRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
