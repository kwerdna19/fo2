import { RestApiHandler } from "@zenstackhq/server/api";
import { NextRequestHandler } from "@zenstackhq/server/next";

import { enhance } from "@zenstackhq/runtime";
import type { NextRequest } from "next/server";
import { API_URL } from "~/server/api";
import { db } from "~/server/db";

// create an enhanced Prisma client with user context
function getPrisma(req: NextRequest) {
	// no auth - so this is public resources only?
	return enhance(db);
}

const handler = NextRequestHandler({
	getPrisma,
	useAppDir: true,
	handler: RestApiHandler({ endpoint: API_URL }),
});

export {
	handler as GET,
	handler as POST,
	handler as PUT,
	handler as PATCH,
	handler as DELETE,
};
