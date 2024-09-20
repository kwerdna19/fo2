"use client";

import { useFormContext } from "react-hook-form";
import type { z } from "zod";
import { SearchField } from "~/components/form/SearchField";
import { api } from "~/trpc/react";
import type { npcSchema } from "../schemas";

type FormValues = z.infer<typeof npcSchema>;

export function TeleportField({ className }: { className?: string }) {
	api.area.getAllQuick.usePrefetchQuery();

	const { control } = useFormContext<FormValues>();

	return (
		<div className={className}>
			<SearchField
				type="Area"
				label="Teleports To"
				control={control}
				name="area"
				query={api.area.getAllQuick}
				prefetch
			/>
		</div>
	);
}
