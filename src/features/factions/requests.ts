import { db } from "~/server/db";

export async function getAllFactionsQuick() {
	return db.faction.findMany({
		select: {
			id: true,
			name: true,
			slug: true,
		},
	});
}
