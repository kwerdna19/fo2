import { PrismaClient } from "@prisma/client";
import {
	getAllData,
	mobDefinitionToDatabaseMob,
} from "~/utils/fo-data/service";
const prisma = new PrismaClient();

const { id: highestId } = await prisma.mob.findFirstOrThrow({
	orderBy: {
		id: "desc",
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

	const createdMob = await prisma.mob.create({
		data: {
			...rest,
			faction: {
				connectOrCreate: {
					create: {
						name: "Unknown Faction",
						id: factionId,
					},
					where: {
						id: factionId,
					},
				},
			},
		},
	});

	const dropTuples = gameMob.d ?? [];
	if (dropTuples.length % 2 !== 0) {
		throw new Error("Invalid drop tuple length");
	}

	const dropMap = {} as Record<number, number[]>;

	for (let i = 0; i < dropTuples.length; i += 2) {
		const itemInGameId = dropTuples[i];
		const dropRate = dropTuples[i + 1];
		if (typeof itemInGameId !== "number" || typeof dropRate !== "number") {
			throw new Error("Invalid drop tuple");
		}

		if (dropMap[itemInGameId]) {
			dropMap[itemInGameId].push(dropRate);
		} else {
			dropMap[itemInGameId] = [dropRate];
		}
	}

	const drops = Object.entries(dropMap).map(([inGameItemId, dropRates]) => ({
		inGameItemId: Number(inGameItemId),
		dropRates: dropRates,
	}));

	if (drops.length > 0) {
		console.log(`Creating ${drops.length} drops for ${gameMob.t.en.n}`);

		const mobId = createdMob.id;

		for (const { inGameItemId, dropRates } of drops) {
			const { id: itemId } = await prisma.item.findUniqueOrThrow({
				where: { id: inGameItemId },
				select: { id: true },
			});

			const dropRate = dropRates[0] as number;
			const count = dropRates.length;

			await prisma.loot.upsert({
				create: {
					mobId,
					itemId,
					dropRate,
					count,
				},
				update: {
					dropRate,
					count,
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
