import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const statusRouter = createTRPCRouter({
  getAll: protectedProcedure.query(({ ctx }) =>
    ctx.prisma.status.findMany({ where: { OR: [{ userId: null }, { userId: ctx.session.user.id }] }, orderBy: { order: "asc" } })
  ),

  create: protectedProcedure
    .input(z.object({ label: z.string().min(1) }))
    .mutation(({ ctx, input }) => ctx.prisma.status.create({ data: { label: input.label, userId: ctx.session.user.id, order: 0 } })),

  reorder: protectedProcedure.input(z.object({ id: z.string().cuid(), order: z.number() }).array()).mutation(async ({ ctx, input }) => {
    for (const { id, order } of input) {
      await ctx.prisma.status.update({ where: { id }, data: { order } });
    }
    // await Promise.all(input.map(({ id, order }) => ctx.prisma.status.update({ where: { id }, data: { order } })));
  }),
});
