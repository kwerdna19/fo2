"use server";

import type { Prisma } from "@prisma/client";
import type { SearchParams } from "nuqs/parsers";
import type { z } from "zod";
import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import { db } from "~/server/db";
import schema from "~/server/db/json-schema.json";
import { getSlugFromName } from "~/utils/misc";
import type { mobSchema } from "./schemas";
import { mobSearchFilterSchema, mobSearchParamCache } from "./search-params";

const requiredFields = schema.definitions.Mob.required;
const searchFields = ["name", "desc", "slug"];

export const getAllMobs = async (searchParams: SearchParams) => {
	const input = mobSearchFilterSchema
		.and(baseDataTableQuerySchema)
		.parse(mobSearchParamCache.parse(searchParams));

	const { page, per_page, sort, sort_dir, query, maxLevel, minLevel } = input;

	const pageIndex = page - 1;

	const isSortFieldRequired = requiredFields.includes(sort);

	const conditions: Prisma.MobWhereInput[] = [];

	if (query) {
		conditions.push({
			OR: searchFields.map((f) => ({
				[f]: {
					contains: query,
				},
			})),
		});
	}

	if (typeof minLevel === "number") {
		conditions.push({
			level: {
				gte: minLevel,
			},
		});
	}

	if (typeof maxLevel === "number") {
		conditions.push({
			level: {
				lte: maxLevel,
			},
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

	const data = await db.mob.findMany({
		orderBy: {
			[sort]: isSortFieldRequired
				? sort_dir
				: { sort: sort_dir, nulls: "last" },
		},
		include: {
			drops: {
				include: {
					item: {
						select: {
							slug: true,
							spriteUrl: true,
							name: true,
							sellPrice: true,
						},
					},
				},
				orderBy: {
					item: {
						sellPrice: "asc",
					},
				},
			},
			faction: true,
			locations: {
				select: {
					area: {
						select: {
							id: true,
							slug: true,
							name: true,
						},
					},
				},
			},
		},
		where,
		take: per_page,
		skip: pageIndex * per_page,
	});

	const totalCount = await db.mob.count({ where });

	return {
		data,
		totalCount,
		page: pageIndex + 1,
		totalPages: Math.ceil(totalCount / per_page),
	};
};

export async function getMobById(id: string) {
	return db.mob.findUniqueOrThrow({
		where: {
			id,
		},
		include: {
			drops: {
				include: {
					item: true,
				},
				orderBy: {
					item: {
						sellPrice: "asc",
					},
				},
			},
		},
	});
}

export async function getMobBySlug(slug: string) {
	return db.mob.findUnique({
		where: {
			slug,
		},
		include: {
			drops: {
				include: {
					item: true,
				},
				orderBy: {
					dropRate: "desc",
				},
			},
			locations: true,
		},
	});
}

export async function getAllMobsQuick() {
	return db.mob.findMany({
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

export async function createMob(input: z.infer<typeof mobSchema>) {
	const { name, drops, locations, ...rest } = input;

	return db.mob.create({
		data: {
			name,
			slug: getSlugFromName(name),
			locations: locations && {
				createMany: {
					data: locations,
				},
			},
			drops: drops && {
				createMany: {
					data: drops,
				},
			},
			...rest,
		},
	});
}

export async function updateMob(id: string, data: z.infer<typeof mobSchema>) {
	const { drops, locations, ...fields } = data;

	let updated = await db.mob.update({
		where: {
			id,
		},
		data: {
			...fields,
			slug: getSlugFromName(fields.name),
			updatedAt: new Date(),
			drops: drops && {
				upsert: drops.map(({ itemId, dropRate }) => ({
					create: {
						dropRate,
						itemId,
					},
					update: {
						dropRate,
					},
					where: {
						mobId_itemId: {
							itemId,
							mobId: id,
						},
					},
				})),
			},
			locations: locations && {
				upsert: locations.map((l) => ({
					create: l,
					update: l,
					where: {
						areaId_x_y_mobId: {
							areaId: l.areaId,
							x: l.x,
							y: l.y,
							mobId: id,
						},
					},
				})),
			},
		},
		include: {
			drops: true,
			locations: true,
		},
	});

	const itemsToRemove = updated.drops.filter((updatedItem) => {
		return !drops?.find((inputItem) => {
			return (
				inputItem.itemId === updatedItem.itemId &&
				inputItem.dropRate === updatedItem.dropRate
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

	if (itemsToRemove.length || locationsToRemove.length) {
		updated = await db.mob.update({
			where: {
				id,
			},
			data: {
				drops: {
					delete: itemsToRemove.map((item) => ({
						mobId_itemId: {
							mobId: id,
							itemId: item.itemId,
						},
					})),
				},
				locations: {
					delete: locationsToRemove.map((l) => ({
						id: l.id,
					})),
				},
			},
			include: {
				drops: true,
				locations: true,
			},
		});
	}

	return updated;
}

export async function deleteMob(id: string) {
	return db.mob.delete({
		where: { id },
	});
}
