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
	const filePath = path.resolve("./prisma", "schema.prisma");

	if (!fs.existsSync(filePath)) {
		return new NextResponse("Not found", {
			status: 404,
		});
	}

	const schema = fs.readFileSync(filePath, { encoding: "utf-8" });
	const response = new NextResponse(schema);

	return setCorsHeaders(response);
}
