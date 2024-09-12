import "server-only";

import { createHydrationHelpers } from "@trpc/react-query/rsc";
import { headers } from "next/headers";
import { cache } from "react";

import { type AppRouter, createCaller } from "~/server/api/root";
import { createAnonTRPCContext, createTRPCContext } from "~/server/api/trpc";
import { createQueryClient } from "./query-client";

/**
 * This wraps the `createTRPCContext` helper and provides the required context for the tRPC API when
 * handling a tRPC call from a React Server Component.
 */
const createContext = cache(() => {
	const heads = new Headers(headers());
	heads.set("x-trpc-source", "rsc");

	return createTRPCContext({
		headers: heads,
	});
});

const createAnonContext = cache(() => {
	return createAnonTRPCContext({
		headers: new Headers(),
	});
});

const getQueryClient = cache(createQueryClient);
const caller = createCaller(createContext);

const anonCaller = createCaller(createAnonContext);

export const { trpc: api, HydrateClient } = createHydrationHelpers<AppRouter>(
	caller,
	getQueryClient,
);

export const { trpc: anonApi } = createHydrationHelpers<AppRouter>(
	anonCaller,
	getQueryClient,
);
