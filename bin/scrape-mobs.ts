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
		itemInGameId: number;
		mobInGameId: number;
		dropRate: number;
	}[];
	for (let i = 0; i < dropTuples.length; i += 2) {
		const itemInGameId = dropTuples[i];
		const dropRate = dropTuples[i + 1];
		if (typeof itemInGameId !== "number" || typeof dropRate !== "number") {
			throw new Error("Invalid drop tuple");
		}
		drops.push({
			itemInGameId,
			dropRate,
			mobInGameId: createdMob.inGameId,
		});
	}

	if (drops.length > 0) {
		console.log(`Creating ${drops.length} drops for ${gameMob.t.en.n}`);

		await Promise.all(
			drops.map(async ({ itemInGameId, dropRate, mobInGameId }) => {
				return prisma.loot.create({
					data: {
						mob: {
							connect: {
								inGameId: mobInGameId,
							},
						},
						item: {
							connect: {
								inGameId: itemInGameId,
							},
						},
						dropRate,
					},
				});
			}),
		);
	}
}

await prisma.$connect();
