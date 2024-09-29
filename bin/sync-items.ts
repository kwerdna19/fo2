import { PrismaClient } from "@prisma/client";
import {
	getAllData,
	itemDefinitionToDatabaseItem,
} from "~/utils/fo-data/service";
import { db } from "../src/server/db/db";

const prisma = new PrismaClient();

const allItems = await getAllData("items");

console.log("Found:", allItems.length);

for (const gameItem of allItems) {
	const dbItem = await db.item.findFirst({
		where: {
			id: gameItem.id,
		},
	});

	if (!dbItem) {
		console.log("Skipping", gameItem.t.en.n);
		continue;
	}

	const { boxIds, ...rest } = itemDefinitionToDatabaseItem(gameItem);

	console.log("Updating", gameItem.t.en.n);
	await prisma.item.update({
		where: {
			id: gameItem.id,
		},
		data: {
			...rest,
			boxItems: boxIds && {
				connect: boxIds.map((b) => ({ id: b })),
			},
		},
	});
}

await prisma.$connect();
