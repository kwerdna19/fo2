import { writeFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import {
	getAllData,
	mobDefinitionToDatabaseMob,
} from "~/utils/fo-data/service";
import { getSlugFromName } from "~/utils/misc";

// const zones = await getAllData("zones");

// writeFileSync(
// 	"./bin/fo-data.json",
// 	JSON.stringify({ items, mobs, zones }, null, 2),
// );

// const items = await getAllData("items");
const items = await getAllData("items");

const prisma = new PrismaClient();

console.log("Total items found:", items.length);

let processed = 0;

for (const gameItem of items) {
	if (gameItem.t.en.n.endsWith("(UNUSED)")) {
		continue;
	}
	processed++;

	const foundItem = await prisma.item.findFirst({
		where: {
			OR: [
				{
					name: gameItem.t.en.n,
				},
				{
					spriteUrl: `/sprites/item/${gameItem.sfn}-icon.png`,
				},
			],
		},
		select: {
			id: true,
			name: true,
		},
	});

	if (!foundItem) {
		console.log("item not found.", gameItem.t.en.n);
	}
}

console.log("Processed:", processed);

await prisma.$connect();
