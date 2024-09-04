import { writeFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import type { ItemDefinition } from "~/utils/fo-data/schema";
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

const toProcess = [] as ItemDefinition[];

const duplicateRemovalMap: Record<string, number> = {
	"Fanny Pack": 1,
	Satchel: 14,
};

for (const gameItem of items) {
	const expectedId = duplicateRemovalMap[gameItem.t.en.n];

	if (
		gameItem.t.en.n.endsWith("(UNUSED)") ||
		(typeof expectedId === "number" && expectedId !== gameItem.id)
	) {
		continue;
	}
	processed++;
	toProcess.push(gameItem);

	// const foundItem = await prisma.item.findFirst({
	// 	where: {
	// 		OR: [
	// 			{
	// 				name: gameItem.t.en.n,
	// 			},
	// 			{
	// 				spriteUrl: `/sprites/item/${gameItem.sfn}-icon.png`,
	// 			},
	// 		],
	// 	},
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 	},
	// });

	// if (!foundItem) {
	// 	console.log("Item not found.", gameItem.t.en.n);
	// }
}

const grouped = toProcess.reduce(
	(acc, item) => {
		const key = item.t.en.n;
		acc[key] = acc[key] ?? [];
		acc[key].push(item);
		return acc;
	},
	{} as Record<string, ItemDefinition[]>,
);

console.log(
	Object.keys(grouped).filter((k) => grouped[k] && grouped[k].length > 1),
);

// console.log("Processed:", processed);

await prisma.$connect();
