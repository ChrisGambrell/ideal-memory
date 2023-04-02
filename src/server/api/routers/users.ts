import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const usersRouter = createTRPCRouter({
  create: publicProcedure
    .input(z.object({ firstName: z.string().min(1), lastName: z.string().min(1), email: z.string().email(), password: z.string().min(6) }))
    .mutation(async ({ ctx, input }) => {
      const existingUser = await ctx.prisma.user.findUnique({ where: { email: input.email } });
      if (existingUser) throw new TRPCError({ code: "BAD_REQUEST", message: "User already exists with that email" });

      const image = `https://api.dicebear.com/6.x/initials/svg?seed=${input.firstName.slice(0, 1)}${input.lastName.slice(0, 1)}${
        input.email
      }`;
      const newUser = await ctx.prisma.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          password: await bcrypt.hash(input.password, 10),
          image,
        },
      });

      return newUser;
    }),
});
