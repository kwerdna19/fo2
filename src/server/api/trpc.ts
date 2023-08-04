import { initTRPC, TRPCError } from "@trpc/server";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { prisma } from "~/server/db";
import { getServerAuthSession } from "~/server/auth/util";
import { satisfiesRole } from "../auth/roles";
import { Role } from "@prisma/client";

interface CreateContextOptions {
  session: Session | null;
}

const createInnerTRPCContext = ({ session }: CreateContextOptions) => {
  return {
    session,
    prisma
  };
};


export const createTRPCContext = async (
//   {
//   req,
//   res,
// }: CreateNextContextOptions
) => {
  const session = await getServerAuthSession();
  return createInnerTRPCContext({ session });
};


const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

/** Reusable middleware that enforces users are logged in before running the procedure. */
const enforceUserIsMod = t.middleware(({ ctx, next }) => {
  if (!ctx.session?.user || !satisfiesRole(Role.MODERATOR)(ctx.session.user.role)) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      // infers the `session` as non-nullable
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export const moderatorProcedure = t.procedure.use(enforceUserIsMod);
