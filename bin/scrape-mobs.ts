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

	const foundMob = await prisma.mob.findFirst({
		where: {
			name: gameMob.t.en.n,
		},
		select: {
			id: true,
			name: true,
		},
	});

	if (!foundMob) {
		console.log("mob not found. creating ", gameMob.t.en.n);

		await prisma.mob.create({
			data: mobDefinitionToDatabaseMob(gameMob),
		});
	} else {
		await prisma.mob.update({
			where: {
				id: foundMob.id,
			},
			data: mobDefinitionToDatabaseMob(gameMob),
		});
	}
}

console.log("Processed:", processed);

await prisma.$connect();
