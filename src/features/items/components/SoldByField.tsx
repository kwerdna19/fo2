"use client";

import { Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { z } from "zod";
import { SearchField } from "~/components/form/SearchField";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import type { itemSchema } from "../schemas";

type FormValues = z.infer<typeof itemSchema>;

export function SoldByField() {
	const { control } = useFormContext<FormValues>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "soldBy",
		keyName: "key",
	});

	return (
		<div className="space-y-1">
			<Label>Sold By</Label>
			<div className="space-y-5">
				<div className="space-y-3">
					{fields.map((field, index) => {
						return (
							<div key={field.key} className="flex gap-3">
								<SearchField
									type="Npc"
									control={control}
									name={`soldBy.${index}`}
									query={api.npc.getAllQuick}
								/>

								<Button
									size="icon"
									variant="destructive"
									onClick={() => remove(index)}
									type="button"
								>
									<Trash2 className="h-5 w-5" />
								</Button>
							</div>
						);
					})}
				</div>

				<Button
					type="button"
					onClick={() => append({} as FormValues["soldBy"][number])}
				>
					Add
				</Button>
			</div>
		</div>
	);
}
