import { type EquippableType, SkillType, Unit } from "@prisma/client";
import { type z } from "zod";
import { db } from "~/server/db";
import { getSlugFromName } from "~/utils/misc";
import { skillSchema } from "./schemas";

export async function getAllSkills() {
	return db.skill.findMany({
		orderBy: {
			name: "asc",
		},
		include: {
			items: true,
		},
	});
}

export async function getSkillById(id: string) {
	return db.skill.findUniqueOrThrow({
		where: {
			id,
		},
		include: {
			items: true,
		},
	});
}

export async function getSkillBySlug(slug: string) {
	return db.skill.findUniqueOrThrow({
		where: {
			slug,
		},
		include: {
			items: true,
		},
	});
}

export async function createSkill(input: z.infer<typeof skillSchema>) {
	const { name, rank, type, items, ...rest } = input;

	return db.skill.create({
		data: {
			name,
			rank,
			type: type as SkillType,
			slug: `${getSlugFromName(name)}-${rank}`,
			items: items && {
				connect: items,
			},
			...rest,
		},
	});
}

export async function updateSkill(
	id: string,
	data: z.infer<typeof skillSchema>,
) {
	const { name, rank, type, items, ...rest } = data;

	let updated = await db.skill.update({
		where: {
			id,
		},
		data: {
			name,
			rank,
			type: type as SkillType,
			slug: `${getSlugFromName(name)}-${rank}`,
			updatedAt: new Date(),
			...rest,
			items: items && {
				connect: items,
			},
		},
		include: {
			items: true,
		},
	});

	const itemsToRemove = updated.items.filter((item) => {
		return !items?.find((inputItem) => {
			return inputItem.id === item.id;
		});
	});

	if (itemsToRemove.length) {
		updated = await db.skill.update({
			where: {
				id,
			},
			data: {
				items: {
					disconnect: itemsToRemove,
				},
			},
			include: {
				items: true,
			},
		});
	}

	return updated;
}
