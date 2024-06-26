import type { z } from "zod";
import { db } from "~/server/db";
import { getSlugFromName } from "~/utils/misc";
import type { battlePassSchema } from "./schemas";

export async function getAllBattlePasses() {
	return db.battlePass.findMany({
		include: {
			tiers: {
				include: {
					item: {
						select: {
							slug: true,
							name: true,
							spriteUrl: true,
						},
					},
				},
				orderBy: {
					tier: "asc",
				},
			},
		},
	});
}

export async function getAllBattlePassesQuick() {
	return db.battlePass.findMany({
		select: {
			id: true,
			name: true,
		},
	});
}

export async function getCurrentBattlePass() {
	return db.battlePass.findFirst({
		include: {
			tiers: {
				include: {
					item: {
						select: {
							slug: true,
							name: true,
							spriteUrl: true,
						},
					},
				},
				orderBy: {
					tier: "asc",
				},
			},
		},
		// TODO - this wont work as a way to always get the "CURRENT" bp
		orderBy: {
			createdAt: "desc",
		},
	});
}

export async function getNextBattlePass() {
	return db.battlePass.findFirst({
		include: {
			tiers: {
				include: {
					item: {
						select: {
							slug: true,
							name: true,
							spriteUrl: true,
						},
					},
				},
				orderBy: {
					tier: "asc",
				},
			},
		},
		// TODO - this wont work as a way to always get the "NEXT" bp
		skip: 1,
		orderBy: {
			createdAt: "desc",
		},
	});
}

export async function getBattlePassBySlug(slug: string) {
	return db.battlePass.findUnique({
		include: {
			tiers: {
				include: {
					item: {
						select: {
							slug: true,
							name: true,
							spriteUrl: true,
						},
					},
				},
				orderBy: {
					tier: "asc",
				},
			},
		},
		where: {
			slug,
		},
	});
}

export async function createBattlePass(
	input: z.infer<typeof battlePassSchema>,
) {
	const { name, tiers, ...rest } = input;

	return db.battlePass.create({
		data: {
			name,
			slug: getSlugFromName(name),
			tiers: tiers && {
				createMany: {
					data: tiers.map((d, index) => ({
						...d,
						tier: index + 1,
					})),
				},
			},
			...rest,
		},
	});
}

export async function updateBattlePass(
	id: string,
	data: z.infer<typeof battlePassSchema>,
) {
	const { name, tiers, ...fields } = data;

	// @TODO db commit to prevent data loss?
	// all deleted before to prevent composite key clashing
	await db.battlePassTier.deleteMany({
		where: {
			battlePassId: id,
		},
	});

	const updated = await db.battlePass.update({
		where: {
			id,
		},
		data: {
			name,
			slug: getSlugFromName(name),
			...fields,
			tiers: tiers && {
				createMany: {
					data: tiers.map((t, i) => ({
						...t,
						tier: i + 1,
					})),
				},
			},
		},
		include: {
			tiers: true,
		},
	});

	return updated;
}

export async function deleteBattlePass(id: string) {
	return db.battlePass.delete({
		where: { id },
	});
}
