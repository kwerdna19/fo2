"use client";

import { ChevronDown, FlaskConical, Trash2, X } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { z } from "zod";
import UnitSelect from "~/components/UnitSelect";
import { SearchField } from "~/components/form/SearchField";
import { TextField } from "~/components/form/TextField";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import type { itemSchema } from "../schemas";

type FormValues = z.infer<typeof itemSchema>;

export function CraftIngredientsField({ index }: { index: number }) {
	const { control } = useFormContext<FormValues>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: `craftedBy.${index}.ingredients`,
		keyName: "key",
	});

	return (
		<div className="space-y-1">
			<Label className="flex pb-3 gap-x-2">
				Ingredients <FlaskConical className="size-4" />
			</Label>
			<div className="space-y-5">
				<div className="space-y-3">
					{fields.map((field, i) => {
						return (
							<div key={field.key}>
								<div className="flex gap-4">
									<div className="flex-1">
										<SearchField
											type="Item"
											label="Item"
											control={control}
											name={`craftedBy.${index}.ingredients.${i}.item`}
											query={api.item.getAllQuick}
										/>
									</div>
									<TextField
										label="Quantity"
										control={control}
										name={`craftedBy.${index}.ingredients.${i}.quantity`}
										type="number"
									/>
									<Button
										size="icon"
										variant="ghost"
										onClick={() => remove(i)}
										type="button"
										className="mt-[22px]"
									>
										<Trash2 className="size-4" />
									</Button>
								</div>
							</div>
						);
					})}
				</div>

				<Button
					type="button"
					size="sm"
					onClick={() =>
						append({ quantity: 1 } as NonNullable<
							FormValues["craftedBy"]
						>[number]["ingredients"][number])
					}
				>
					Add Ingredient
				</Button>
			</div>
		</div>
	);
}
