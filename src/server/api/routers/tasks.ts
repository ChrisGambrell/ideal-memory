import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => ctx.prisma.task.findMany({ orderBy: { createdAt: "desc" } })),

  updateById: publicProcedure
    .input(z.object({ id: z.string().cuid(), data: z.object({ completed: z.boolean().optional() }) }))
    .mutation(async ({ ctx, input }) => {
      const taskToUpdate = await ctx.prisma.task.findUnique({ where: { id: input.id } });
      if (!taskToUpdate) throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });

      const updatedTask = await ctx.prisma.task.update({ data: input.data, where: { id: input.id } });
      return updatedTask;
    }),

  deleteById: publicProcedure.input(z.object({ id: z.string().cuid() })).mutation(async ({ ctx, input }) => {
    const taskToDelete = await ctx.prisma.task.findUnique({ where: { id: input.id } });
    if (!taskToDelete) throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
    await ctx.prisma.task.delete({ where: { id: input.id } });
  }),
});
