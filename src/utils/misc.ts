export const getSlugFromName = (name: string) => {
	return name
		.replace(/\s+/g, "-")
		.replace(/[^-\w]/g, "")
		.toLowerCase();
};

export const getIdFromNameId = (nameId: string) => {
	const idString = nameId.split("-").at(-1);

	if (!idString) {
		throw new Error(`Invalid nameId ${nameId}`);
	}

	return Number(idString);
};

type D = {
	id: number;
	name: string;
};

export const getNameIdSlug = (d: D) => {
	return `${getSlugFromName(d.name)}-${d.id}`;
};

export const shallowCompare = (
	obj1: Record<string | number | symbol, unknown>,
	obj2: Record<string | number | symbol, unknown>,
) =>
	Object.keys(obj1).length === Object.keys(obj2).length &&
	Object.keys(obj1).every((key) => obj1[key] === obj2[key]);

export function recursivelyNullifyUndefinedValues<
	T extends Record<string, unknown> | ArrayLike<unknown>,
>(obj: T): T {
	// biome-ignore lint/complexity/noForEach: code copied from online
	Object.entries(obj).forEach(([key, value]) => {
		if (!!value && typeof value === "object") {
			recursivelyNullifyUndefinedValues(value as Record<string, unknown>);
		} else if (value === undefined) {
			// @ts-expect-error
			obj[key] = null;
		}
	});
	return obj;
}
