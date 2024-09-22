"use client";

import { Trash2 } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { z } from "zod";
import { SearchField } from "~/components/form/SearchField";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import { cn } from "~/utils/styles";
import type { skillSchema } from "../schemas";

type FormValues = z.infer<typeof skillSchema>;

export function SkillItemsField({ className }: { className?: string }) {
	const { control } = useFormContext<FormValues>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "items",
		keyName: "key",
	});

	return (
		<div className={cn(className, "space-y-1")}>
			<Label>Associated Items</Label>
			<div className="space-y-5">
				<div className="space-y-3">
					{fields.map((field, index) => {
						return (
							<div key={field.key} className="grid grid-cols-6 gap-3">
								<div className="col-span-5">
									<SearchField
										type="Item"
										control={control}
										name={`items.${index}`}
										query={api.item.getAllQuick}
									/>
								</div>

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
