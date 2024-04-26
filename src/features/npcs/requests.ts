import type { z } from "zod";
import { db } from "~/server/db";
import { getSlugFromName } from "~/utils/misc";
import type { npcSchema } from "./schemas";

export async function getAllNpcs() {
	return db.npc.findMany({
		orderBy: {
			name: "asc",
		},
		include: {
			items: {
				include: {
					item: true,
				},
				orderBy: [
					{
						unit: "desc",
					},
					{
						price: "asc",
					},
				],
			},
			locations: {
				include: {
					area: true,
				},
			},
			crafts: {
				include: {
					item: true,
				},
				orderBy: [
					{
						unit: "desc",
					},
					{
						price: "asc",
					},
				],
			},
		},
	});
}

export async function getNpcById(id: string) {
	return db.npc.findUniqueOrThrow({
		where: {
			id,
		},
		include: {
			items: {
				include: {
					item: true,
				},
			},
			locations: {
				include: {
					area: true,
				},
			},
		},
	});
}

export async function getNpcBySlug(slug: string) {
	return db.npc.findUnique({
		where: {
			slug,
		},
		include: {
			items: {
				include: {
					item: true,
				},
			},
			locations: {
				include: {
					area: true,
				},
			},
			crafts: {
				include: {
					item: true,
				},
			},
		},
	});
}

export async function getAllNpcsQuick() {
	return db.npc.findMany({
		orderBy: {
			name: "asc",
		},
		select: {
			id: true,
			name: true,
			spriteUrl: true,
		},
	});
}

export async function createNpc(input: z.infer<typeof npcSchema>) {
	const { name, items, locations, crafts, ...rest } = input;

	return db.npc.create({
		data: {
			name,
			slug: getSlugFromName(name),
			locations: locations && {
				createMany: {
					data: locations,
				},
			},
			items: items && {
				createMany: {
					data: items,
				},
			},
			crafts: crafts && {
				createMany: {
					data: crafts,
				},
			},
			...rest,
		},
	});
}

export async function updateNpc(id: string, data: z.infer<typeof npcSchema>) {
	const { items, locations, crafts, ...fields } = data;

	let updated = await db.npc.update({
		where: {
			id,
		},
		data: {
			...fields,
			slug: getSlugFromName(fields.name),
			updatedAt: new Date(),
			items: items && {
				upsert: items.map((d) => ({
					create: d,
					update: d,
					where: {
						npcId_itemId: {
							itemId: d.itemId,
							npcId: id,
						},
					},
				})),
			},
			locations: locations && {
				upsert: locations.map((l) => ({
					create: l,
					update: l,
					where: {
						areaId_x_y_npcId: {
							...l,
							npcId: id,
						},
					},
				})),
			},
			crafts: crafts && {
				upsert: crafts.map(({ ingredients, ...c }) => ({
					create: c,
					update: c,
					where: {
						npcId_itemId: {
							npcId: id,
							itemId: c.itemId,
						},
					},
				})),
			},
		},
		include: {
			items: true,
			locations: true,
			crafts: true,
		},
	});

	const itemsToRemove = updated.items.filter((updatedItem) => {
		return !items?.find((inputItem) => {
			return (
				inputItem.itemId === updatedItem.itemId &&
				inputItem.price === updatedItem.price &&
				inputItem.unit === updatedItem.unit
			);
		});
	});

	const locationsToRemove = updated.locations.filter((updatedLocation) => {
		return !locations?.find((inputLocation) => {
			return (
				updatedLocation.areaId === inputLocation.areaId &&
				updatedLocation.x === inputLocation.x &&
				updatedLocation.y === inputLocation.y
			);
		});
	});

	const craftsToRemove = updated.crafts.filter((updatedCraft) => {
		return !crafts?.find((inputCraft) => {
			return (
				updatedCraft.durationMinutes === inputCraft.durationMinutes &&
				updatedCraft.itemId === inputCraft.itemId &&
				updatedCraft.price === inputCraft.price &&
				updatedCraft.unit === inputCraft.unit
			);
		});
	});

	if (
		itemsToRemove.length ||
		locationsToRemove.length ||
		craftsToRemove.length
	) {
		updated = await db.npc.update({
			where: {
				id,
			},
			data: {
				items: {
					delete: itemsToRemove.map((item) => ({
						npcId_itemId: {
							npcId: id,
							itemId: item.itemId,
						},
					})),
				},
				locations: {
					delete: locationsToRemove.map((l) => ({
						id: l.id,
					})),
				},
				crafts: {
					delete: craftsToRemove.map((c) => ({
						npcId_itemId: {
							npcId: id,
							itemId: c.itemId,
						},
					})),
				},
			},
			include: {
				items: true,
				locations: true,
				crafts: true,
			},
		});
	}

	return updated;
}

export async function deleteNpc(id: string) {
	return db.npc.delete({
		where: { id },
	});
}
