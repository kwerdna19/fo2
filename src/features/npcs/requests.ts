import type { Prisma } from "@prisma/client";
import type { SearchParams } from "nuqs/parsers";
import type { z } from "zod";
import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import { db } from "~/server/db";
import schema from "~/server/db/json-schema.json";
import { getSlugFromName } from "~/utils/misc";
import type { npcSchema } from "./schemas";
import { npcSearchFilterSchema, npcSearchParamCache } from "./search-params";

const requiredFields = schema.definitions.Npc.required;
const searchFields = ["name", "slug"];

export async function getAllNpcs(searchParams: SearchParams) {
	const input = npcSearchFilterSchema
		.and(baseDataTableQuerySchema)
		.parse(npcSearchParamCache.parse(searchParams));

	const { page, per_page, sort, sort_dir, query } = input;

	const pageIndex = page - 1;

	const isSortFieldRequired = requiredFields.includes(sort);

	const conditions: Prisma.NpcWhereInput[] = [];

	if (query) {
		conditions.push({
			OR: searchFields.map((f) => ({
				[f]: {
					contains: query,
				},
			})),
		});
	}

	const where =
		conditions.length === 1
			? conditions[0]
			: conditions.length > 1
				? {
						AND: conditions,
					}
				: {};

	const data = await db.npc.findMany({
		orderBy: {
			[sort]: isSortFieldRequired
				? sort_dir
				: { sort: sort_dir, nulls: "last" },
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
		where,
		take: per_page,
		skip: pageIndex * per_page,
	});

	const totalCount = await db.npc.count({ where });

	return {
		data,
		totalCount,
		page: pageIndex + 1,
		totalPages: Math.ceil(totalCount / per_page),
	};
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
