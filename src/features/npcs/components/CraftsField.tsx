"use client";

import { Trash2, X } from "lucide-react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import type { z } from "zod";
import UnitSelect from "~/components/UnitSelect";
import { SearchField } from "~/components/form/SearchField";
import { TextField } from "~/components/form/TextField";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { CraftIngredientsField } from "~/features/items/components/CraftIngredientsField";
import { api } from "~/trpc/react";
import { cn } from "~/utils/styles";
import type { npcSchema } from "../schemas";

type FormValues = z.infer<typeof npcSchema>;

export function CraftsField({ className }: { className?: string }) {
	const { control, watch } = useFormContext<FormValues>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "crafts",
		keyName: "key",
	});

	return (
		<div className={cn(className, "space-y-1")}>
			<Label>Crafts</Label>
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
										type="Item"
										label="Item"
										control={control}
										name={`crafts.${index}.item`}
										query={api.item.getAllQuick}
									/>
								</div>
								<div className="grid grid-cols-2 gap-x-2">
									<div className="flex gap-x-2 flex-1">
										<TextField
											label="Price"
											control={control}
											name={`crafts.${index}.price`}
											type="number"
										/>
										<div className="pt-[22px] flex-shrink-0">
											<UnitSelect
												control={control}
												name={`crafts.${index}.unit`}
											/>
										</div>
									</div>
									<TextField
										label="Duration (mins)"
										control={control}
										name={`crafts.${index}.durationMinutes`}
										type="number"
									/>
								</div>

								<CraftIngredientsField
									control={control}
									name={`crafts.${index}.ingredients`}
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
						} as FormValues["crafts"][number])
					}
				>
					Add Craft
				</Button>
			</div>
		</div>
	);
}
