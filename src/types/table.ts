import type { RouterInputs, RouterOutputs } from "~/trpc/react";

export type TableProps<
	Router extends keyof RouterOutputs & keyof RouterInputs,
	Endpoint extends keyof RouterOutputs[Router] & keyof RouterInputs[Router],
> = {
	initialData: RouterOutputs[Router][Endpoint];
	initialParams: RouterInputs[Router][Endpoint];
};
