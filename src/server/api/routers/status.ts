import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const statusRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.status.findMany({ where: { OR: [{ userId: null }, { userId: ctx.session.user.id }] } })
  ),

  create: protectedProcedure
    .input(z.object({ label: z.string().min(1) }))
    .mutation(({ ctx, input }) => ctx.prisma.status.create({ data: { label: input.label, userId: ctx.session.user.id } })),
});
