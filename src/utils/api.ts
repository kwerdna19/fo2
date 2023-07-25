// import { createTRPCProxyClient, httpBatchLink, loggerLink } from "@trpc/client";
import { type inferRouterInputs, type inferRouterOutputs } from "@trpc/server";
// import superjson from "superjson";
import { appRouter, type AppRouter } from "~/server/api/root";
import { prisma } from '../server/db'

export const getBaseUrl = () => {
  if (typeof window !== "undefined") return ""; // browser should use relative url
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://localhost:${process.env.PORT ?? 3000}`; // dev SSR should use localhost
};

// For now, with NEXTJS App dir, I'll only be calling the routes directly from the server
// @TODO / TBA - replace with client/server solution
export const api = appRouter.createCaller({ prisma })

// createTRPCProxyClient<AppRouter>({
//   transformer: superjson,
//   links: [
//     loggerLink({
//       enabled: (opts) =>
//         process.env.NODE_ENV === "development" ||
//         (opts.direction === "down" && opts.result instanceof Error),
//     }),
//     httpBatchLink({
//       url: `${getBaseUrl()}/api/trpc`,
//       fetch: async (input, init?) => {
//         // const fetch = getFetch();
//         return fetch(input, {
//           ...init,
//           credentials: "include",
//         });
//       },
//     }),
//   ],
// });

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;
