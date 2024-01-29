import NextAuth, { type DefaultSession } from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import Discord from "next-auth/providers/discord";

import { type User } from "@prisma/client";
import { env } from "~/env.mjs";
import { db } from "~/server/db";

export const {
	handlers: { GET, POST },
	auth,
	signIn,
	signOut,
} = NextAuth({
	callbacks: {
		session: ({ session, ...data }) => {
			if ("user" in data) {
				return {
					...session,
					user: {
						...session.user,
						...data.user,
					},
				};
			}

			return session;
		},
	},
	adapter: PrismaAdapter(db),
	providers: [
		Discord({
			clientId: env.DISCORD_CLIENT_ID,
			clientSecret: env.DISCORD_CLIENT_SECRET,
		}),
	],
});

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the "session"
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
	interface Session extends DefaultSession {
		user: User;
	}

	// interface User {
	//   // ...other properties
	//   // role: UserRole;
	// }
}
