import { writeFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import type { ItemDefinition } from "~/utils/fo-data/schema";
import {
	getAllData,
	itemDefinitionToDatabaseItem,
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

console.log("Total items found in data file:", items.length);

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

	// const foundItems = await prisma.item.findMany({
	// 	where: {
	// 		inGameId: gameItem.id,
	// 	},
	// 	select: {
	// 		id: true,
	// 		name: true,
	// 	},
	// });

	// if (foundItems.length !== 1) {
	// 	console.log(
	// 		"More or less than 1 item found",
	// 		gameItem.t.en.n,
	// 		foundItems.length,
	// 	);
	// }

	// if (foundItems.length === 0) {
	// 	console.log("Not found, creating", gameItem.t.en.n);
	// 	await prisma.item.create({
	// 		data: itemDefinitionToDatabaseItem(gameItem),
	// 	});
	// }

	// if (foundItems.length === 1) {
	// 	console.log("1 Item found. Updating", gameItem.t.en.n);

	// 	await prisma.item.update({
	// 		where: {
	// 			// biome-ignore lint/style/noNonNullAssertion: <explanation>
	// 			id: foundItems[0]!.id,
	// 		},
	// 		data: itemDefinitionToDatabaseItem(gameItem),
	// 	});
	// }
}
console.log("Processed data items:", processed);

const dbitems = await prisma.item.findMany();
console.log("Total items found in database:", dbitems.length);

// for (const dbItem of dbitems) {
// 	const gameItem = items.find((i) => i.t.en.n === dbItem.name);
// 	if (!gameItem) {
// 		console.log("Game Item not found in game data for", dbItem.name);
// 	}
// }

const inGameFileNotInDb = items.filter(
	(i) => !dbitems.some((dbi) => dbi.name === i.t.en.n),
);

console.log({ inGameFileNotInDb: inGameFileNotInDb.map((i) => i.t.en.n) });

await prisma.$connect();
