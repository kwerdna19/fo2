"use client";

import { Trash2 } from "lucide-react";
import { useFieldArray, useForm, useFormContext } from "react-hook-form";
import type { z } from "zod";
import UnitSelect from "~/components/UnitSelect";
import { SearchField } from "~/components/form/SearchField";
import { TextField } from "~/components/form/TextField";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import type { itemSchema } from "../schemas";

type FormValues = z.infer<typeof itemSchema>;

export function CraftedByField() {
	const { control } = useFormContext<FormValues>();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "craftedBy",
		keyName: "key",
	});

	return (
		<div className="space-y-1">
			<Label>Crafted By</Label>
			<div className="space-y-5">
				<div className="space-y-3">
					{fields.map((field, index) => {
						return (
							<div
								key={field.key}
								className="grid grid-cols-7 xl:grid-cols-12 gap-3"
							>
								<div className="col-span-4">
									<SearchField
										type="Npc"
										control={control}
										name={`craftedBy.${index}.npc`}
										query={api.npc.getAllQuick}
									/>
								</div>

								<div className="col-span-3">
									<TextField
										placeholder="Duration (mins)"
										control={control}
										name={`craftedBy.${index}.durationMinutes`}
										type="number"
									/>
								</div>

								<div className="col-span-3">
									<TextField
										placeholder="Price"
										control={control}
										name={`craftedBy.${index}.price`}
										type="number"
									/>
								</div>

								<div className="col-span-1">
									<UnitSelect
										control={control}
										name={`craftedBy.${index}.unit`}
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
					onClick={() =>
						append({ unit: "COINS" } as NonNullable<
							FormValues["craftedBy"]
						>[number])
					}
				>
					Add
				</Button>
			</div>
		</div>
	);
}
