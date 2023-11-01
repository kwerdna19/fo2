import {
  createTRPCProxyClient,
  loggerLink,
  unstable_httpBatchStreamLink,
} from "@trpc/client";
import { createServerSideHelpers } from '@trpc/react-query/server';
import { headers } from "next/headers";

import { appRouter, type AppRouter } from "~/server/api/root";
import { getUrl, transformer } from "./shared";
import { db } from "~/server/db";

export const api = createTRPCProxyClient<AppRouter>({
  transformer,
  links: [
    loggerLink({
      enabled: (op) =>
        process.env.NODE_ENV === "development" ||
        (op.direction === "down" && op.result instanceof Error),
    }),
    unstable_httpBatchStreamLink({
      url: getUrl(),
      headers() {
        const heads = new Map(headers());
        heads.set("x-trpc-source", "rsc");
        return Object.fromEntries(heads);
      },
    }),
  ],
});

export const staticApi = createServerSideHelpers({
  router: appRouter,
  ctx: {
    db,
    session: null
  },
  transformer,
});