import { z } from "zod";

import { type Prisma, Role, type SkillType } from "@prisma/client";
import { baseDataTableQuerySchema } from "~/components/data-table/data-table-utils";
import {
	createTRPCRouter,
	publicProcedure,
	roleProtectedProcedure,
} from "~/server/api/trpc";
import schema from "~/server/db/json-schema.json";
import { getSlugFromName } from "~/utils/misc";
import { skillSchema } from "./schemas";
import { skillSearchFilterSchema } from "./search-params";

const requiredFields = schema.definitions.Skill.required;
const searchFields = ["name", "slug"];

export default createTRPCRouter({
	getAllPopulated: publicProcedure
		.input(skillSearchFilterSchema.and(baseDataTableQuerySchema))
		.query(async ({ ctx: { db }, input }) => {
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
				totalPages: Math.ceil(totalCount / per_page),
			};
		}),

	getAllQuick: publicProcedure.query(async ({ ctx: { db } }) => {
		return db.skill.findMany({
			orderBy: [
				{
					slug: "asc",
				},
				{
					rank: "asc",
				},
			],
			select: {
				id: true,
				name: true,
				slug: true,
				spriteUrl: true,
			},
		});
	}),

	getBySlug: publicProcedure
		.input(z.object({ slug: z.string() }))
		.query(({ ctx: { db }, input: { slug } }) => {
			return db.skill.findUniqueOrThrow({
				where: {
					slug,
				},
				include: {
					items: true,
				},
			});
		}),

	create: roleProtectedProcedure(Role.MODERATOR)
		.input(skillSchema)
		.mutation(({ ctx: { db }, input }) => {
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
		}),

	update: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ id: z.string(), data: skillSchema }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { id, data } = input;
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
		}),

	delete: roleProtectedProcedure(Role.ADMIN)
		.input(z.object({ id: z.string() }))
		.mutation(({ ctx: { db }, input: { id } }) => {
			return db.skill.delete({
				where: { id },
			});
		}),
});
