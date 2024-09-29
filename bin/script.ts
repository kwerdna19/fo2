import { writeFileSync } from "fs";
import { PrismaClient } from "@prisma/client";
import item from "~/features/items/router";

const prisma = new PrismaClient();

// writeFileSync(
// 	"./bin/locations-data.json",
// 	JSON.stringify(await prisma.location.findMany({}), null, 2),
// );

// const areas = await prisma.area.findMany();

// for (const area of areas) {
// 	console.log("updating", area.name);

// 	await prisma.newArea.create({
// 		data: {
// 			id: area.inGameId,
// 			name: area.name,
// 			height: area.height,
// 			width: area.width,
// 			globalX: area.globalX,
// 			globalY: area.globalY,
// 			globalZ: area.globalZ,
// 			spawnX: area.spawnX,
// 			spawnY: area.spawnY,
// 			spriteUrl: area.spriteUrl,
// 		},
// 	});
// }

// const locations = await prisma.location.findMany({ include: { area: true } });
// for (const location of locations) {
// 	console.log("updating", location.id);

// 	await prisma.location.update({
// 		where: {
// 			id: location.id,
// 		},
// 		data: {
// 			// factionId: mob.factionInGameId,
// 			newAreaId: location.area.inGameId,
// 		},
// 	});
// }

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const writeData = (name: string, data: any) => {
	writeFileSync(`./bin/data/${name}-data.json`, JSON.stringify(data, null, 2));
};

// writeData(
// 	"mobs",
// 	await prisma.mob.findMany({
// 		include: {
// 			drops: {
// 				include: {
// 					item: true,
// 				},
// 			},
// 			locations: {
// 				include: {
// 					area: true,
// 				},
// 			},
// 			faction: true,
// 		},
// 	}),
// );

// writeData(
// 	"npcs",
// 	await prisma.npc.findMany({
// 		include: {
// 			locations: {
// 				include: {
// 					area: true,
// 				},
// 			},
// 			area: true,
// 			crafts: {
// 				include: {
// 					item: true,
// 					ingredients: true,
// 				},
// 			},
// 			items: {
// 				include: {
// 					item: true,
// 				},
// 			},
// 		},
// 	}),
// );

// writeData(
// 	"battlePasses",
// 	await prisma.battlePass.findMany({
// 		include: {
// 			tiers: true,
// 			item: true,
// 		},
// 	}),
// );

// writeData(
// 	"items",
// 	await prisma.item.findMany({
// 		include: {
// 			area: true,
// 			droppedBy: true,
// 			soldBy: true,
// 			craftedBy: true,
// 			boxItems: true,
// 			box: true,
// 			usages: true,
// 			skillInfo: true,
// 		},
// 	}),
// );

// writeData(
// 	"areas",
// 	await prisma.area.findMany({
// 		include: {
// 			items: true,
// 			skills: true,
// 			npcs: true,
// 			locations: true,
// 			portals: true,
// 		},
// 	}),
// );

// writeData(
// 	"skills",
// 	await prisma.skill.findMany({
// 		include: {
// 			area: true,
// 			items: true,
// 		},
// 	}),
// );

// writeData("factions", await prisma.faction.findMany());

// writeData(
// 	"users",
// 	await prisma.user.findMany({
// 		include: {
// 			accounts: true,
// 			collection: {
// 				include: {
// 					item: true,
// 				},
// 			},
// 			sessions: true,
// 		},
// 	}),
// );
