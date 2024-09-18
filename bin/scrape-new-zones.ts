import { PrismaClient } from "@prisma/client";
import {
	getAllData,
	zoneDefinitionToDatabaseArea,
} from "~/utils/fo-data/service";

const prisma = new PrismaClient();

const { inGameId: highestId, region } = await prisma.area.findFirstOrThrow({
	orderBy: {
		inGameId: "desc",
	},
});

const newZones = await getAllData("zones", highestId);

console.log("Found:", newZones.length);

for (const zone of newZones) {
	const data = zoneDefinitionToDatabaseArea(zone);

	console.log("Creating", zone.t.en.n);
	await prisma.area.create({
		data: {
			...data,
			region, // TO REMOVE
			spriteUrl: `/maps/${data.slug}.png`,
		},
	});

	console.log("Stopping...");
	// Only do 1 at a time
	break;
}

await prisma.$connect();
