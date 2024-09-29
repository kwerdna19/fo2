"use client";

import { Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { z } from "zod";
import UnitSelect from "~/components/UnitSelect";
import { SearchField } from "~/components/form/SearchField";
import { TextField } from "~/components/form/TextField";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { cn } from "~/utils/styles";
import type { npcSchema } from "../schemas";

type FormValues = z.infer<typeof npcSchema>;

export function SaleItemsField({ className }: { className?: string }) {
	const { control } = useFormContext<FormValues>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
		keyName: "key",
	});

	return (
		<div className={cn(className, "space-y-1")}>
			<Label>Sale Items</Label>
			<div className="space-y-5">
				<div className="space-y-3">
					{fields.map((field, index) => {
						return (
							<div key={field.key} className="flex gap-3">
								<SearchField
									type="Item"
									control={control}
									name={`items.${index}`}
									query={api.item.getAllQuick}
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
					onClick={() => append({} as FormValues["items"][number])}
				>
					Add
				</Button>
			</div>
		</div>
	);
}
