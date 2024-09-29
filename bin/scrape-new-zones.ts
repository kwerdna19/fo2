import { PrismaClient } from "@prisma/client";
import {
	getAllData,
	zoneDefinitionToDatabaseArea,
} from "~/utils/fo-data/service";

const prisma = new PrismaClient();

const { id: highestId } = await prisma.area.findFirstOrThrow({
	orderBy: {
		id: "desc",
	},
});

const newZones = await getAllData("zones", highestId);

console.log("Found:", newZones.length);

for (const zone of newZones) {
	const { slug, ...data } = zoneDefinitionToDatabaseArea(zone);

	console.log("Creating", zone.t.en.n);
	await prisma.area.create({
		data: {
			...data,
			spriteUrl: `/maps/${slug}.png`,
		},
	});

	console.log("Stopping...");
	// Only do 1 at a time
	break;
}

await prisma.$connect();
