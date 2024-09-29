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
					name: "asc",
				},
				{
					rank: "asc",
				},
			],
			select: {
				id: true,
				name: true,
				// slug: true,
			},
		});
	}),

	getById: publicProcedure
		.input(z.number())
		.query(({ ctx: { db }, input: id }) => {
			return db.skill.findUniqueOrThrow({
				where: {
					id,
				},
				include: {
					items: true,
					area: {
						select: {
							id: true,
							name: true,
						},
					},
				},
			});
		}),

	create: roleProtectedProcedure(Role.MODERATOR)
		.input(skillSchema)
		.mutation(({ ctx: { db }, input }) => {
			const { type, items, area, ...rest } = input;

			return db.skill.create({
				data: {
					type: type as SkillType,
					items: {
						connect: items.map((item) => ({ id: item.id })),
					},
					...rest,
				},
			});
		}),

	update: roleProtectedProcedure(Role.MODERATOR)
		.input(z.object({ id: z.number(), data: skillSchema }))
		.mutation(async ({ ctx: { db }, input }) => {
			const { id, data } = input;
			const { type, items, area, ...rest } = data;

			const updated = await db.skill.update({
				where: {
					id,
				},
				data: {
					...rest,
					type: type as SkillType,
					updatedAt: new Date(),
					areaId: area?.id,
					items: {
						set: items.map((item) => ({ id: item.id })),
					},
				},
			});

			return updated;
		}),
});
