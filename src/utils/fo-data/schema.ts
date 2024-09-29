import * as z from "zod";

const TranslationSchema = z.object({
	en: z.object({
		d: z.string().optional(),
		n: z.string(),
	}),
});

export const StatSchema = z.object({
	int: z.number().nullish(),
	str: z.number().nullish(),
	agi: z.number().nullish(),
	sta: z.number().nullish(),
	arm: z.number().nullish(),
	v: z.union([z.number(), z.string()]).nullish(),
	lck: z.number().nullish(),
	mnd: z.number().nullish(),
	mxd: z.number().nullish(),
	atkp: z.number().nullish(), // unused for items?
	atkr: z.number().nullish(),
	atks: z.number().nullish(),
});

export const BoxItemIdsSchema = z.number().array();

export const ItemDefinitionSchema = z.object({
	id: z.number(), // ID
	sfn: z.string(), // Sprite filename
	ty: z.number(), // Type
	st: z.number(), // Subtype
	q: z.number(), // ? - 0 for everything except for Alpha Halo - where it is 32
	lr: z.number(), // Level Req
	sr: z.union([StatSchema, BoxItemIdsSchema]), // Stat requirements or consumable box item IDs
	bt: z.number(), // ? 0 for everything
	sta: z.union([StatSchema, z.never().array()]), // Bonus stats or empty array (unknown)
	ss: z.number(), // Stack size
	vbc: z.number(), // sell price unit (1: GEMS, 0: COINS)
	vbp: z.number(), // sell to npc price
	vsc: z.number(), // purchase price unit (1: GEMS, 0: COINS)
	vsp: z.number(), // purchase from npc price
	t: TranslationSchema,
});
export type ItemDefinition = z.infer<typeof ItemDefinitionSchema>;

export const MobDefinitionSchema = z.object({
	id: z.number(), // ID
	sfn: z.string(), // Sprite Filename
	l: z.number(), // Level
	h: z.number(), // Health
	mnd: z.number(), // Min Damage
	mxd: z.number(), // Max Damage
	as: z.number(), // Attack Speed (ms / atk)
	ms: z.number(), // Movement Speed
	fi: z.number(), // faction id
	fx: z.number(), // faction xp
	wt: z.number(), // ???
	t: TranslationSchema, // name, desc
	z: z.number().nullable(), // zone id
	mic: z.number().nullable(), // min coin drop
	mac: z.number().nullable(), // max coin drop
	d: z.array(z.number()).nullable(), // Drops - tuples (itemId, dropRate%, ...)
});
export type MobDefinition = z.infer<typeof MobDefinitionSchema>;

export const ZoneDefinitionSchema = z.object({
	id: z.number(),
	blx: z.number(),
	bly: z.number(),
	blz: z.number(),
	wip: z.number(),
	hip: z.number(),
	sx: z.number(),
	sy: z.number(),
	t: TranslationSchema,
});
export type ZoneDefinition = z.infer<typeof ZoneDefinitionSchema>;

export const dataSchemas = {
	items: ItemDefinitionSchema,
	mobs: MobDefinitionSchema,
	zones: ZoneDefinitionSchema,
};

export type DataType = keyof typeof dataSchemas;

export type SchemaDefinitionByType<T extends DataType> = z.infer<
	(typeof dataSchemas)[T]
>;
