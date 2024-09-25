import { PrismaClient } from "@prisma/client";
import {
	getAllData,
	mobDefinitionToDatabaseMob,
} from "~/utils/fo-data/service";
const prisma = new PrismaClient();

const { inGameId: highestId } = await prisma.mob.findFirstOrThrow({
	orderBy: {
		inGameId: "desc",
	},
});

const mobs = await getAllData("mobs", highestId);

console.log("Found:", mobs.length);

for (const gameMob of mobs) {
	if (gameMob.d === null || gameMob.mic === null || gameMob.mac === null) {
		console.log("Skipping", gameMob.t.en.n);
		continue;
	}

	console.log("Creating", gameMob.t.en.n);

	const { factionId, ...rest } = mobDefinitionToDatabaseMob(gameMob);

	const now = Date.now().toString();
	const createdMob = await prisma.mob.create({
		data: {
			...rest,
			faction: {
				connectOrCreate: {
					create: {
						name: `? (${now})`,
						slug: now,
						inGameId: factionId,
					},
					where: {
						inGameId: factionId,
					},
				},
			},
		},
	});

	const dropTuples = gameMob.d ?? [];
	if (dropTuples.length % 2 !== 0) {
		throw new Error("Invalid drop tuple length");
	}

	const drops = [] as {
		itemId: string;
		dropRate: number;
	}[];
	for (let i = 0; i < dropTuples.length; i += 2) {
		const itemInGameId = dropTuples[i];
		const dropRate = dropTuples[i + 1];
		if (typeof itemInGameId !== "number" || typeof dropRate !== "number") {
			throw new Error("Invalid drop tuple");
		}

		const item = await prisma.item.findUniqueOrThrow({
			where: { inGameId: itemInGameId },
			select: { id: true },
		});

		drops.push({
			itemId: item.id,
			dropRate,
		});
	}

	if (drops.length > 0) {
		console.log(`Creating ${drops.length} drops for ${gameMob.t.en.n}`);

		const mobId = createdMob.id;

		for (const { itemId, dropRate } of drops) {
			await prisma.loot.upsert({
				create: {
					mobId,
					itemId,
					dropRate,
				},
				update: {
					dropRate,
				},
				where: {
					mobId_itemId: {
						mobId,
						itemId,
					},
				},
			});
		}
	}
}

await prisma.$connect();
