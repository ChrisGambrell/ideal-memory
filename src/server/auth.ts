import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type DefaultSession, type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { z } from "zod";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      image: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  // id: string;
  // ...other properties
  // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        const user = await prisma.user.findUnique({ where: { id: token.sub } });
        if (!user) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "User not found for session" });

        delete session.user.name;
        session.user.id = user.id;
        session.user.firstName = user.firstName;
        session.user.lastName = user.lastName;
        // session.user.role = user.role; <-- put other properties on the session here
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  secret: env.NEXTAUTH_SECRET,
  pages: { signIn: "/sign-in" },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password", placeholder: "" },
      },
      async authorize(credentials) {
        const input = z.object({ email: z.string().email(), password: z.string().min(1) }).parse(credentials);

        const user = await prisma.user.findUnique({ where: { email: input.email } });
        if (!user) throw new TRPCError({ code: "NOT_FOUND", message: "User does not exist" });

        if (!(await bcrypt.compare(input.password, user.password)))
          throw new TRPCError({ code: "BAD_REQUEST", message: "Incorrect password" });
        else return user;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: { req: GetServerSidePropsContext["req"]; res: GetServerSidePropsContext["res"] }) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};

export async function verifyAuth(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);
  console.log(session);
  if (!session) {
    return {
      redirect: {
        destination: `/sign-in?callbackUrl=${ctx.resolvedUrl}`,
        permanent: false,
      },
    };
  } else return { props: { session } };
}
