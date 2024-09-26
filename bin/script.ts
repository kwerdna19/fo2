import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const mobs = await prisma.mob.findMany({
	select: {
		id: true,
		name: true,
	},
	where: {},
});

for (const mob of mobs) {
	console.log("updating", mob.name);

	// if (!skill.spriteUrl.includes("/sprites/skill/")) {
	// 	console.log("skipping", skill);
	// 	continue;
	// }

	await prisma.mob.update({
		where: {
			id: mob.id,
		},
		data: {
			// factionId: mob.factionInGameId,
		},
	});
}

// const factions = await prisma.faction.findMany({
// 	// where: {},
// });

// for (const faction of factions) {
// 	console.log("updating", faction.name);

// 	await prisma.faction.update({
// 		where: {
// 			inGameId: faction.inGameId,
// 		},
// 		data: {
// 			id: faction.inGameId,
// 		},
// 	});
// }
