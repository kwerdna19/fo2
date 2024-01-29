import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { setCorsHeaders } from "~/utils/server";

// 1 day
export const revalidate = 86400;

export function OPTIONS() {
	const response = new Response(null, {
		status: 204,
	});
	return setCorsHeaders(response);
}

export function GET() {
	const filePath = path.resolve("./prisma", "json-schema.json");

	if (!fs.existsSync(filePath)) {
		return new NextResponse("Not found", {
			status: 404,
		});
	}

	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const schema = JSON.parse(fs.readFileSync(filePath, { encoding: "utf-8" }));
	const response = NextResponse.json(schema);

	return setCorsHeaders(response);
}
