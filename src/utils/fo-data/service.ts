import type { Prisma } from "@prisma/client";
import { z } from "zod";
import { getSlugFromName } from "../misc";
import {
	type DataType,
	type MobDefinition,
	type SchemaDefinitionByType,
	dataSchemas,
} from "./schema";

const baseUrl = "https://data.fantasyonline2.com/api";

export async function getDataByIds<T extends DataType>(type: T, ids: number[]) {
	const url = `${baseUrl}/${type}?ids=${ids.join(",")}`;
	const response = await fetch(url);
	const json = await response.json();

	const schema = dataSchemas[type];
	const result = z.array(schema).parse(json) as SchemaDefinitionByType<T>[];
	return result;
}

export async function getDataById<T extends DataType>(type: T, id: number) {
	const url = `${baseUrl}/${type}?ids=${id}`;
	const response = await fetch(url);
	const json = await response.json();

	const schema = dataSchemas[type];
	const result = z.array(schema).parse(json) as SchemaDefinitionByType<T>[];

	return result.find((entry) => entry.id === id) ?? null;
}

const pageSize = 200;

export async function getAllData<T extends DataType>(type: T) {
	const result = [] as SchemaDefinitionByType<T>[];
	let page = 1;
	while (true) {
		const ids = Array.from(
			{ length: pageSize },
			(_, i) => i + 1 + (page - 1) * pageSize,
		);

		const newData = await getDataByIds(type, ids);

		result.push(...newData);

		if (newData.length === 0) {
			break;
		}
		page++;
	}

	return result;
}

export const mobDefinitionToDatabaseMob = (
	gameMob: MobDefinition,
): Prisma.MobCreateInput => {
	return {
		name: gameMob.t.en.n,
		desc: gameMob.t.en.d,
		slug: getSlugFromName(gameMob.t.en.n),
		spriteUrl: `/sprites/mob/${gameMob.sfn}.png`,
		spriteName: gameMob.sfn,
		level: gameMob.l,
		health: gameMob.h,
		goldMin: gameMob.mic ?? 0,
		goldMax: gameMob.mac ?? 0,
		atkSpeed: gameMob.as,
		dmgMin: gameMob.mnd,
		dmgMax: gameMob.mxd,
		inGameId: gameMob.id,
	};
};

export const itemTypeMap: Record<
	number,
	{ type: string; subtypes?: Record<number, string> }
> = {
	0: {
		type: "JUNK",
	},
	1: {
		type: "BAG",
	},
	2: {
		type: "WEAPON",
		subtypes: {
			1: "MELEE", // 1H
			2: "BOW", // 2H
			3: "WAND", // 1H
			4: "AXE", // 2H
			5: "HAMMER", // 2H
			6: "STAFF", // 2H
		},
	},
	3: {
		type: "EQUIPMENT",
		subtypes: {
			0: "HEAD",
			1: "TRINKET",
			2: "FACE",
			// 3
			// 4
			// 5
			6: "SHOULDERS",
			// 7
			8: "CHEST",
			// 9
			10: "LEGS",
			// 11
			12: "RING",
			// 13
			// 14
			15: "GUILD",
			// 16
			17: "OFFHAND",
		},
	},
	// 4 - consumable
	4: {
		type: "CONSUMABLE",
		subtypes: {
			1: "HEALTH",
			2: "ENERGY",
			// 3 (Map?)
			4: "SKILL-LEARN",
			// 5
			6: "OUTFIT_BOX",
			7: "EFFECT",
			8: "XP_BOOST",
			9: "FACTION_XP_BOOST",
			10: "BATTLEPASS_XP",
			11: "BATTLEPASS",
			12: "FACTION_XP",
			13: "BANK_SLOT",
			14: "TELEPORT",
			15: "GEMS",
		},
	},
	6: {
		type: "OUTFIT",
		subtypes: {
			0: "HEAD",
			1: "CHEST",
			2: "FACE",
			3: "LEGS",
			4: "BACK",
			// 5
			6: "SHOULDERS",
			16: "WEAPON",
			17: "OFFHAND",
		},
	},
};
