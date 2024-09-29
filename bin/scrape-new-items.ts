import { PrismaClient } from "@prisma/client";
import {
	getAllData,
	itemDefinitionToDatabaseItem,
} from "~/utils/fo-data/service";

const prisma = new PrismaClient();

const { id: highestId } = await prisma.item.findFirstOrThrow({
	orderBy: {
		id: "desc",
	},
});

const newItems = await getAllData("items", highestId);

console.log("Found:", newItems.length);

for (const gameItem of newItems) {
	if (gameItem.t.en.n.endsWith("(UNUSED)") || gameItem.t.en.n === "TODO") {
		console.log("Skipping", gameItem.t.en.n);
		continue;
	}

	const { boxIds, ...rest } = itemDefinitionToDatabaseItem(gameItem);

	console.log("Creating", gameItem.t.en.n);
	await prisma.item.create({
		data: {
			...rest,
			boxItems: boxIds && {
				connect: boxIds.map((b) => ({ id: b })),
			},
		},
	});
}

await prisma.$connect();
