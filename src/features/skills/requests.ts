import type { Prisma, SkillType } from "@prisma/client";
import type { z } from "zod";
import { db } from "~/server/db";
import { getSlugFromName } from "~/utils/misc";
import type { skillSchema } from "./schemas";

import type { SearchParams } from "nuqs/parsers";
import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import schema from "~/server/db/json-schema.json";
import {
	skillSearchFilterSchema,
	skillSearchParamCache,
} from "./search-params";

const requiredFields = schema.definitions.Skill.required;
const searchFields = ["name", "slug"];

export async function getAllSkills(searchParams: SearchParams) {
	const input = skillSearchFilterSchema
		.and(baseDataTableQuerySchema)
		.parse(skillSearchParamCache.parse(searchParams));

	const { page, per_page, sort, sort_dir, query } = input;

	const pageIndex = page - 1;

	const isSortFieldRequired = requiredFields.includes(sort);

	const conditions: Prisma.SkillWhereInput[] = [];

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

	const orderBy: Prisma.SkillOrderByWithRelationInput[] = [
		{
			[sort]: isSortFieldRequired
				? sort_dir
				: { sort: sort_dir, nulls: "last" },
		},
	];

	if (sort === "slug") {
		orderBy.push({
			rank: sort_dir,
		});
	}

	const data = await db.skill.findMany({
		orderBy: orderBy,
		include: {
			items: true,
		},
		where,
		take: per_page,
		skip: pageIndex * per_page,
	});

	const totalCount = await db.skill.count({ where });

	return {
		data,
		totalCount,
		page: pageIndex + 1,
		totalPages: Math.ceil(totalCount / per_page),
	};
}

// export async function getAllSkills() {
// 	return db.skill.findMany({
// 		orderBy: [
// 			{
// 				slug: "asc",
// 			},
// 			{
// 				rank: "asc",
// 			},
// 		],
// 		include: {
// 			items: true,
// 		},
// 	});
// }

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
