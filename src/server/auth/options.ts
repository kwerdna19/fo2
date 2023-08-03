import { type AuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "~/env.mjs"
import { prisma } from "~/server/db";
import { type User } from "@prisma/client";

const adapter = PrismaAdapter(prisma)

// adapter.getSessionAndUser = async (sessionToken: string) => {
//   const userAndSession = await prisma.session.findUnique({
//     where: { sessionToken },
//     include: {
//       user: true
//     },
//   })
//   if (!userAndSession) return null
//   const { user, ...session } = userAndSession
//   return { user, session }
// }

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
// adapter.getUser = async (id) => prisma.user.findUnique({ where: { id } })

export const authOptions: AuthOptions = {
  adapter,
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    session({ session, user }) {
      // is this valid?
      if (session && user) {
        session.user = user as User
      }
      return session
    },
  }
}