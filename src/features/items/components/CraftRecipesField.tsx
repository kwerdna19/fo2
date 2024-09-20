"use client";

import { Trash2, X } from "lucide-react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import type { z } from "zod";
import UnitSelect from "~/components/UnitSelect";
import { SearchField } from "~/components/form/SearchField";
import { TextField } from "~/components/form/TextField";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import type { itemSchema } from "../schemas";
import { CraftIngredientsField } from "./CraftIngredientsField";

type FormValues = z.infer<typeof itemSchema>;

export function CraftRecipesField() {
	const { control } = useFormContext<FormValues>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "craftedBy",
		keyName: "key",
	});

	return (
		<div className="space-y-1">
			<Label>Craft Recipes</Label>
			<div className="space-y-5">
				<div className="space-y-3">
					{fields.map((field, index) => {
						return (
							<div
								key={field.key}
								className="border px-3 py-6 rounded-md relative flex flex-col gap-y-6"
							>
								<div>
									<SearchField
										type="Npc"
										label="Npc"
										control={control}
										name={`craftedBy.${index}.npc`}
										query={api.npc.getAllQuick}
									/>
								</div>
								<div className="grid grid-cols-2 gap-x-2">
									<div className="flex gap-x-2 flex-1">
										<TextField
											label="Price"
											control={control}
											name={`craftedBy.${index}.price`}
											type="number"
										/>
										<div className="pt-[22px] flex-shrink-0">
											<UnitSelect
												control={control}
												name={`craftedBy.${index}.unit`}
											/>
										</div>
									</div>
									<TextField
										label="Duration (mins)"
										control={control}
										name={`craftedBy.${index}.durationMinutes`}
										type="number"
									/>
								</div>

								<CraftIngredientsField
									control={control}
									name={`craftedBy.${index}.ingredients`}
								/>

								<Button
									size="icon"
									variant="ghost"
									onClick={() => remove(index)}
									type="button"
									className="absolute right-1 top-1"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
						);
					})}
				</div>

				<Button
					type="button"
					onClick={() =>
						append({
							unit: "COINS",
							ingredients: [{ quantity: 1 }],
						} as NonNullable<FormValues["craftedBy"]>[number])
					}
				>
					Add Craft
				</Button>
			</div>
		</div>
	);
}
