import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const tasksRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.task.findMany({ where: { authorId: ctx.session.user.id }, orderBy: { createdAt: "desc" } })
  ),

  create: protectedProcedure
    .input(z.object({ body: z.string().min(1) }))
    .mutation(({ ctx, input }) => ctx.prisma.task.create({ data: { body: input.body, authorId: ctx.session.user.id } })),

  // TODO: Check by user id to update
  updateById: protectedProcedure
    .input(z.object({ id: z.string().cuid(), data: z.object({ completed: z.boolean().optional() }) }))
    .mutation(async ({ ctx, input }) => {
      const taskToUpdate = await ctx.prisma.task.findUnique({ where: { id: input.id } });
      if (!taskToUpdate) throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });

      const updatedTask = await ctx.prisma.task.update({ data: input.data, where: { id: input.id } });
      return updatedTask;
    }),

  // TODO: Check by user id to delete
  deleteById: protectedProcedure.input(z.object({ id: z.string().cuid() })).mutation(async ({ ctx, input }) => {
    const taskToDelete = await ctx.prisma.task.findUnique({ where: { id: input.id } });
    if (!taskToDelete) throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
    await ctx.prisma.task.delete({ where: { id: input.id } });
  }),
});
