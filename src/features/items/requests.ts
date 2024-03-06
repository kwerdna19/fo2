import { type EquippableType, Unit } from "@prisma/client";
import { type z } from "zod";
import { db } from "~/server/db";
import { equipmentSlotConfig } from "~/utils/fo";
import { getSlugFromName } from "~/utils/misc";
import { type itemSchema } from "./schemas";

export async function getAllItems() {
	return db.item.findMany({
		orderBy: {
			slug: "asc",
		},
		include: {
			droppedBy: {
				include: {
					mob: true,
				},
				orderBy: {
					mob: {
						level: "asc",
					},
				},
			},
			soldBy: {
				include: {
					npc: true,
				},
				orderBy: {
					price: "asc",
				},
			},
			// craftedBy: {
			// 	include: {
			// 		npc: true,
			// 	},
			// 	orderBy: {
			// 		durationMinutes: "asc",
			// 	},
			// },
		},
	});
}

export async function getAllEquipment() {
	return db.item.findMany({
		orderBy: {
			slug: "asc",
		},
		where: {
			equip: {
				in: Object.keys(equipmentSlotConfig) as EquippableType[],
			},
		},
	});
}

export async function getAllItemsQuick() {
	return db.item.findMany({
		orderBy: {
			slug: "asc",
		},
		select: {
			id: true,
			name: true,
			spriteUrl: true,
			slug: true,
		},
	});
}

export async function getItemById(id: string) {
	return db.item.findUniqueOrThrow({
		where: {
			id,
		},
		include: {
			droppedBy: {
				include: {
					mob: true,
				},
				orderBy: {
					mob: {
						level: "asc",
					},
				},
			},
		},
	});
}

export async function getItemBySlug(slug: string) {
	return db.item.findUnique({
		where: {
			slug,
		},
		include: {
			droppedBy: {
				include: {
					mob: true,
				},
				orderBy: {
					dropRate: "desc",
				},
			},
			soldBy: {
				include: {
					npc: true,
				},
			},
			craftedBy: {
				include: {
					npc: true,
				},
				orderBy: {
					durationMinutes: "asc",
				},
			},
		},
	});
}

export async function createItem(input: z.infer<typeof itemSchema>) {
	const {
		name,
		droppedBy,
		equip,
		soldBy,
		craftedBy,
		battlePassTiers,
		...rest
	} = input;

	return db.item.create({
		data: {
			name,
			equip: equip as EquippableType,
			slug: getSlugFromName(name),
			droppedBy: droppedBy && {
				createMany: {
					data: droppedBy,
				},
			},
			soldBy: soldBy && {
				createMany: {
					data: soldBy,
				},
			},
			craftedBy: craftedBy && {
				createMany: {
					data: craftedBy,
				},
			},
			battlePassTiers: battlePassTiers && {
				createMany: {
					data: battlePassTiers,
				},
			},
			...rest,
		},
	});
}

export async function updateItem(id: string, data: z.infer<typeof itemSchema>) {
	const {
		name,
		droppedBy,
		equip,
		soldBy,
		craftedBy,
		battlePassTiers,
		...rest
	} = data;

	let updated = await db.item.update({
		where: {
			id,
		},
		data: {
			name,
			equip: equip as EquippableType,
			slug: getSlugFromName(name),
			updatedAt: new Date(),
			...rest,
			droppedBy: droppedBy && {
				upsert: droppedBy.map((d) => ({
					create: d,
					update: d,
					where: {
						mobId_itemId: {
							mobId: d.mobId,
							itemId: id,
						},
					},
				})),
			},
			soldBy: soldBy && {
				upsert: soldBy.map((d) => ({
					create: d,
					update: d,
					where: {
						npcId_itemId: {
							npcId: d.npcId,
							itemId: id,
						},
					},
				})),
			},
			craftedBy: craftedBy && {
				upsert: craftedBy.map((d) => ({
					create: d,
					update: d,
					where: {
						npcId_itemId: {
							npcId: d.npcId,
							itemId: id,
						},
					},
				})),
			},
			battlePassTiers: battlePassTiers && {
				upsert: battlePassTiers.map((p) => ({
					create: p,
					update: p,
					where: {
						battlePassId_tier: p,
						itemId: id,
					},
				})),
			},
		},
		include: {
			droppedBy: true,
			soldBy: true,
			craftedBy: true,
			battlePassTiers: true,
		},
	});

	const dropsToRemove = updated.droppedBy.filter((updatedDrop) => {
		return !droppedBy?.find((inputDrop) => {
			return (
				inputDrop.mobId === updatedDrop.mobId &&
				inputDrop.dropRate === updatedDrop.dropRate
			);
		});
	});

	const salesToRemove = updated.soldBy.filter((updatedSale) => {
		return !soldBy?.find((inputSale) => {
			return (
				inputSale.npcId === updatedSale.npcId &&
				inputSale.price === updatedSale.price &&
				inputSale.unit === updatedSale.unit
			);
		});
	});

	const craftsToRemove = updated.craftedBy.filter((updatedCraft) => {
		return !craftedBy?.find((inputCraft) => {
			return (
				inputCraft.npcId === updatedCraft.npcId &&
				inputCraft.price === updatedCraft.price &&
				inputCraft.unit === updatedCraft.unit &&
				inputCraft.durationMinutes === updatedCraft.durationMinutes
			);
		});
	});

	const tiersToRemove = updated.battlePassTiers.filter((updatedTier) => {
		return !battlePassTiers?.find((inputTier) => {
			return (
				inputTier.battlePassId === updatedTier.battlePassId &&
				inputTier.tier === updatedTier.tier
			);
		});
	});

	if (
		dropsToRemove.length ||
		salesToRemove.length ||
		craftsToRemove.length ||
		tiersToRemove.length
	) {
		updated = await db.item.update({
			where: {
				id,
			},
			data: {
				droppedBy: {
					delete: dropsToRemove.map((item) => ({
						mobId_itemId: {
							mobId: item.mobId,
							itemId: id,
						},
					})),
				},
				soldBy: {
					delete: salesToRemove.map((s) => ({
						npcId_itemId: {
							npcId: s.npcId,
							itemId: id,
						},
					})),
				},
				craftedBy: {
					delete: craftsToRemove.map((s) => ({
						npcId_itemId: {
							npcId: s.npcId,
							itemId: id,
						},
					})),
				},
				battlePassTiers: {
					delete: tiersToRemove.map((t) => ({
						battlePassId_tier: {
							battlePassId: t.battlePassId,
							tier: t.tier,
						},
						itemId: id,
					})),
				},
			},
			include: {
				droppedBy: true,
				soldBy: true,
				craftedBy: true,
				battlePassTiers: true,
			},
		});
	}

	return updated;
}

export async function deleteItem(id: string) {
	return db.item.delete({
		where: { id },
	});
}
