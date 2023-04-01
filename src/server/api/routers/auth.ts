import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const authRouter = createTRPCRouter({
  signIn: publicProcedure
    .input(z.object({ id: z.string().cuid(), data: z.object({ completed: z.boolean().optional() }) }))
    .mutation(async ({ ctx, input }) => {
      const taskToUpdate = await ctx.prisma.task.findUnique({ where: { id: input.id } });
      if (!taskToUpdate) throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });

      const updatedTask = await ctx.prisma.task.update({ data: input.data, where: { id: input.id } });
      return updatedTask;
    }),

  signUp: publicProcedure
    .input(z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(6) }))
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findUnique({ where: { email: input.email } });
      if (existingUser) throw new TRPCError({ code: "BAD_REQUEST", message: "User already exists with that email" });

      const image = `https://api.dicebear.com/6.x/initials/svg?seed=${input.name}${input.email}`;
      const newUser = await ctx.prisma.user.create({
        data: { name: input.name, email: input.email, password: await bcrypt.hash(input.password, 10), image },
      });

      return newUser;
    }),
});
