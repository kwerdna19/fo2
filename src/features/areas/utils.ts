export const convertLocations = <
	L extends { x: number; y: number },
	T extends { locations: L[] },
>(
	input: T,
) => {
	return {
		...input,
		locations: input.locations.map((l) => {
			return {
				...l,
				coordinates: {
					x: l.x,
					y: l.y,
				},
			};
		}),
	};
};
