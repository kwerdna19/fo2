import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const npcs = await prisma.npc.findMany({
	select: {
		id: true,
		name: true,
		spriteName: true,
	},
	where: {},
});

console.log(npcs);

// for (const npc of npcs) {
// 	console.log("updating", npc.name);

// 	if (!npc.spriteUrl.includes("/sprites/npc/")) {
// 		console.log("skipping", npc);
// 		continue;
// 	}

// 	await prisma.npc.update({
// 		where: {
// 			id: npc.id,
// 		},
// 		data: {
// 			spriteName: npc.spriteUrl
// 				.replace("/sprites/npc/", "")
// 				.replace(".png", ""),
// 		},
// 	});
// }
