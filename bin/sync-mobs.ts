import { PrismaClient } from "@prisma/client";
import {
	getAllData,
	mobDefinitionToDatabaseMob,
} from "~/utils/fo-data/service";
import { db } from "../src/server/db/db";
const prisma = new PrismaClient();

const mobs = await getAllData("mobs");

console.log("Found:", mobs.length);

for (const gameMob of mobs) {
	const dbMob = await db.mob.findFirst({
		where: {
			inGameId: gameMob.id,
		},
	});
	if (!dbMob) {
		console.log("[!] Skipping", gameMob.t.en.n);
		continue;
	}

	console.log("Updating", gameMob.t.en.n);

	const { factionId, ...rest } = mobDefinitionToDatabaseMob(gameMob);

	const now = Date.now().toString();
	await prisma.mob.update({
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
		where: {
			id: dbMob.id,
		},
	});

	const dropTuples = gameMob.d ?? [];
	if (dropTuples.length % 2 !== 0) {
		throw new Error("Invalid drop tuple length");
	}

	const drops = [] as {
		itemInGameId: number;
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
		});
	}

	if (drops.length > 0) {
		console.log(`Updating ${drops.length} drops for ${gameMob.t.en.n}`);

		await Promise.all(
			drops.map(async ({ itemInGameId, dropRate }) => {
				const { id: itemId } = await db.item.findFirstOrThrow({
					where: {
						inGameId: itemInGameId,
					},
				});
				const mobId = dbMob.id;

				return prisma.loot.upsert({
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
							itemId,
							mobId,
						},
					},
				});
			}),
		);
	}
}

await prisma.$connect();