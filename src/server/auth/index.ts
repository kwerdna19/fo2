import NextAuth, { type DefaultSession  } from "next-auth"

import { PrismaAdapter } from "@auth/prisma-adapter"
import Discord from "next-auth/providers/discord"

import { env } from "~/env.mjs"
import { db } from "~/server/db";
import { type User } from "@prisma/client";

export const {
  handlers: { GET, POST },
  auth,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  signIn,
  // eslint-disable-next-line @typescript-eslint/unbound-method
  signOut,
} = NextAuth({
  callbacks: {
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...user,
          ...session.user,
        },
      }
    },
  },
  adapter: PrismaAdapter(db),
  providers: [
    Discord({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    })
  ],
})

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: User & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

