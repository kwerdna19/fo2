export const getSlugFromName = (name: string) => {
	return name
		.replace(/\s+/g, "-")
		.replace(/[^-\w]/g, "")
		.toLowerCase();
};

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
