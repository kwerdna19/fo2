import { Unit } from "@prisma/client";
import { z } from "zod";
import type { AreaDatum } from "~/features/areas/components/AreaTable";
import type { ItemDatum } from "~/features/items/components/ItemTable";
import type { MobDatum } from "~/features/mobs/components/MobTable";
import { getSlugFromName } from "../misc";
import {
	type DataType,
	type ItemDefinition,
	type MobDefinition,
	type SchemaDefinitionByType,
	type ZoneDefinition,
	dataSchemas,
} from "./schema";

const baseUrl = "https://data.fantasyonline2.com/api";

export const getDataUrl = (type: DataType, idOrIds: number | number[]) =>
	`${baseUrl}/${type}?ids=${Array.isArray(idOrIds) ? idOrIds.join(",") : idOrIds}`;

export async function getDataByIds<T extends DataType>(type: T, ids: number[]) {
	const response = await fetch(getDataUrl(type, ids));
	const json = await response.json();

	const schema = dataSchemas[type];
	const result = z.array(schema).parse(json) as SchemaDefinitionByType<T>[];
	return result;
}

export async function getDataById<T extends DataType>(type: T, id: number) {
	const response = await fetch(getDataUrl(type, id));
	const json = await response.json();

	const schema = dataSchemas[type];
	const result = z.array(schema).parse(json) as SchemaDefinitionByType<T>[];

	return result.find((entry) => entry.id === id) ?? null;
}

const pageSize = 100;

export async function getAllData<T extends DataType>(type: T, startId = 0) {
	const result = [] as SchemaDefinitionByType<T>[];
	let page = 1;
	while (true) {
		const ids = Array.from(
			{ length: pageSize },
			(_, i) => i + startId + 1 + (page - 1) * pageSize,
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

export const mobDefinitionToDatabaseMob = (gameMob: MobDefinition) => {
	return {
		id: gameMob.id,
		name: gameMob.t.en.n,
		desc: gameMob.t.en.d,
		slug: getSlugFromName(gameMob.t.en.n),
		spriteName: gameMob.sfn,
		level: gameMob.l,
		health: gameMob.h,
		goldMin: gameMob.mic ?? 0,
		goldMax: gameMob.mac ?? 0,
		atkSpeed: gameMob.as,
		moveSpeed: gameMob.ms,
		dmgMin: gameMob.mnd,
		dmgMax: gameMob.mxd,
		factionXp: gameMob.fx,
		factionId: gameMob.fi,
	};
};

// DB fields provided by the data api
export const mobDefinitionFields = [
	"id",
	"name",
	"desc",
	"spriteName",
	"level",
	"health",
	"goldMin",
	"goldMax",
	"atkSpeed",
	"dmgMin",
	"dmgMax",
	"moveSpeed",
	"factionXp",
	"drops",
	"faction",
] satisfies Array<keyof MobDatum>;

// if no subtypes - 0 is only valid value for "st"
export const itemTypeMap: Record<
	number,
	{ type: string; subTypes?: Record<number, string> }
> = {
	0: {
		type: "JUNK",
	},
	1: {
		type: "BAG",
	},
	2: {
		type: "WEAPON",
		subTypes: {
			1: "SWORD", // 1H
			2: "BOW", // 2H
			3: "WAND", // 1H
			4: "AXE", // 2H
			5: "HAMMER", // 2H
			6: "STAFF", // 2H
			7: "PICKAXE",
			8: "LOCKPICK",
			9: "2H SWORD", // 2H
		},
	},
	3: {
		type: "EQUIPMENT",
		subTypes: {
			0: "HEAD",
			1: "TRINKET", // LEFT TRINKET
			2: "FACE",
			// 3 // RIGHT TRINKET
			4: "BACK",
			// 5
			6: "SHOULDERS",
			// 7
			8: "CHEST",
			// 9
			10: "LEGS",
			// 11
			12: "RING", // LEFT RING
			// 13
			// 14 - RIGHT RING
			15: "GUILD",
			// 16 - MAIN HAND
			17: "OFFHAND",
		},
	},
	4: {
		type: "CONSUMABLE",
		subTypes: {
			1: "HEALTH",
			2: "ENERGY",
			3: "MAP",
			4: "SKILL_BOOK",
			5: "SKILL",
			6: "OUTFIT_BOX",
			7: "FIREWORK",
			8: "XP_BOOST",
			9: "FACTION_XP_BOOST",
			10: "BATTLEPASS_XP_BOOST",
			11: "BATTLEPASS",
			12: "FACTION_XP",
			13: "BANK_TAB",
			14: "TELEPORT",
			15: "GEMS",
		},
	},
	5: {
		type: "CRAFTING",
	},
	6: {
		type: "OUTFIT",
		subTypes: {
			0: "HEAD",
			1: "CHEST",
			2: "FACE",
			3: "LEGS",
			4: "BACK",
			// 5 - mapped main hand
			6: "SHOULDERS",
			// 7 - mapped offhand

			// 8: "CHEST", // ? not sure why it exists twice?
			// 10: "LEGS", // ? not sure why it exists twice?

			16: "WEAPON",
			17: "OFFHAND",
		},
	},
};

// datum fields provided by the data api
export const itemDefinitionFields = [
	"id",
	"name",
	"desc",
	"spriteName",
	"levelReq",
	"type",
	"subType",
	"sellPrice",
	"sellPriceUnit",
	"buyPrice",
	"buyPriceUnit",
	"stackSize",
	"agi",
	"str",
	"sta",
	"int",
	"armor",
	"typeSpecificValue",
	"luck",
	"dmgMin",
	"dmgMax",
	"range",
	"atkSpeed",
	"reqStr",
	"reqSta",
	"reqAgi",
	"reqInt",
	"boxItems",
	"droppedBy", // not from item definition but from another definition (in this case mobDefs)
] satisfies Array<keyof ItemDatum>;

export const itemDefinitionToDatabaseItem = (gameItem: ItemDefinition) => {
	const stats = Array.isArray(gameItem.sta) ? null : gameItem.sta;

	const reqStats = Array.isArray(gameItem.sr) ? null : gameItem.sr;

	const boxIds = Array.isArray(gameItem.sr) ? gameItem.sr : undefined;

	const typeMap = itemTypeMap[gameItem.ty];
	if (!typeMap) {
		throw new Error(`Item type not found ${itemTypeMap}`);
	}
	if (typeMap.subTypes) {
		if (!typeMap.subTypes[gameItem.st]) {
			console.log("ITEM: ", gameItem.t.en.n);
			throw new Error(
				`Item type ${gameItem.ty} has subtypes in map but st not found: ${gameItem.st}`,
			);
		}
	} else {
		if (gameItem.st !== 0) {
			console.log("ITEM: ", gameItem.t.en.n);
			throw new Error(
				`Item type has no subtypes in map but found st: ${gameItem.st}`,
			);
		}
	}

	// bags are not stackable but use `ss` to determine bag size
	const stackSize = gameItem.ty === 1 ? 1 : Math.max(1, gameItem.ss);
	const bagSize = gameItem.ty === 1 ? gameItem.ss : null;

	return {
		id: gameItem.id,
		name: gameItem.t.en.n,
		desc: gameItem.t.en.d,
		slug: getSlugFromName(gameItem.t.en.n),
		spriteName: gameItem.sfn,
		levelReq: gameItem.lr,

		type: gameItem.ty,
		subType: gameItem.st,

		sellPrice: gameItem.vbp,
		sellPriceUnit: gameItem.vbc === 1 ? Unit.GEMS : Unit.COINS,
		buyPrice: gameItem.vsp,
		buyPriceUnit: gameItem.vsc === 1 ? Unit.GEMS : Unit.COINS,
		stackSize,
		bagSize,
		agi: stats?.agi,
		str: stats?.str,
		sta: stats?.sta,
		int: stats?.int,
		armor: stats?.arm,
		typeSpecificValue: typeof stats?.v === "number" ? stats.v : null,
		luck: stats?.lck,
		dmgMin: stats?.mnd,
		dmgMax: stats?.mxd,
		range: stats?.atkr,
		atkSpeed: stats?.atks,

		reqStr: reqStats?.str,
		reqSta: reqStats?.sta,
		reqAgi: reqStats?.agi,
		reqInt: reqStats?.int,

		boxIds,
	};
};

// datum fields provided by the data api
export const areaDefinitionFields = [
	"id",
	"name",
	"desc",
	"globalX",
	"globalY",
	"globalZ",
	"spawnX",
	"spawnY",
	"height",
	"width",
] satisfies Array<keyof AreaDatum>;

export const zoneDefinitionToDatabaseArea = (zone: ZoneDefinition) => {
	return {
		name: zone.t.en.n,
		desc: zone.t.en.d,
		slug: getSlugFromName(zone.t.en.n),
		height: zone.hip,
		width: zone.wip,
		globalX: zone.blx,
		globalY: zone.bly,
		globalZ: zone.blz,
		spawnX: zone.sx,
		spawnY: zone.sy,
	};
};
