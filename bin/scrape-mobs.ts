import { writeFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import { usePathname } from "next/navigation";
import item from "~/features/items/router";
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
const mobs = await getAllData("mobs");

const prisma = new PrismaClient();

console.log("Total mobs found:", mobs.length);

let processed = 0;

for (const gameMob of mobs) {
	if (
		gameMob.d === null ||
		gameMob.mic === null ||
		gameMob.mac === null ||
		gameMob.sfn.startsWith("enemy-cod-")
	) {
		continue;
	}
	processed++;

	const foundMob = await prisma.mob.findUnique({
		where: {
			inGameId: gameMob.id,
		},
		select: {
			id: true,
			name: true,
		},
	});

	const mobId = foundMob?.id;

	if (!mobId) {
		console.log("mob not found. creating ", gameMob.t.en.n);

		// const created = await prisma.mob.create({
		// 	data: mobDefinitionToDatabaseMob(gameMob),
		// });

		// mobId = created.id;
	} else {
		// await prisma.mob.update({
		// 	where: {
		// 		id: mobId,
		// 	},
		// 	data: mobDefinitionToDatabaseMob(gameMob),
		// });
	}

	const dropTuples = gameMob.d ?? [];

	if (dropTuples.length % 2 !== 0) {
		throw new Error("Invalid drop tuple length");
	}

	const drops = [] as { itemInGameId: number; dropRate: number }[];
	for (let i = 0; i < dropTuples.length; i += 2) {
		const itemInGameId = dropTuples[i];
		const dropRate = dropTuples[i + 1];
		if (typeof itemInGameId !== "number" || typeof dropRate !== "number") {
			throw new Error("Invalid drop tuple");
		}
		drops.push({
			itemInGameId,
			dropRate,
		});
	}
	if (drops.length > 0) {
		console.log(`Upserting ${drops.length} drops for ${gameMob.t.en.n}`);
		const items = await prisma.item.findMany({
			where: {
				inGameId: {
					in: drops.map((d) => d.itemInGameId),
				},
			},
			select: {
				id: true,
				name: true,
				inGameId: true,
			},
		});

		await prisma.mob.update({
			where: {
				id: mobId,
			},
			data: {
				drops: {
					// upsert: items.map((item) => {
					// 	const dropRate = drops.find(
					// 		(d) => d.itemInGameId === item.inGameId,
					// 	)?.dropRate;
					// 	if (typeof dropRate !== "number") {
					// 		throw new Error("Drop rate not found");
					// 	}
					// 	return {
					// 		create: {
					// 			dropRate,
					// 			itemId: item.id,
					// 		},
					// 		update: { dropRate },
					// 		where: {
					// 			mobId_itemId: { mobId, itemId: item.id },
					// 		},
					// 	};
					// }),
				},
			},
		});
	}
}

console.log("Processed:", processed);

await prisma.$connect();
