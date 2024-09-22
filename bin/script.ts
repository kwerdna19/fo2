import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const skills = await prisma.skill.findMany({
	select: {
		id: true,
		name: true,
		spriteName: true,
	},
	where: {},
});

console.log(skills);

for (const skill of skills) {
	console.log("updating", skill.name);

	// if (!skill.spriteUrl.includes("/sprites/skill/")) {
	// 	console.log("skipping", skill);
	// 	continue;
	// }

	await prisma.skill.update({
		where: {
			id: skill.id,
		},
		data: {
			spriteName: skill.spriteName.replace("-icon", ""),
		},
	});
}
