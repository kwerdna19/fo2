"use client";

import { FlaskConical, Trash2 } from "lucide-react";
import { type Control, useFieldArray } from "react-hook-form";
import { SearchField } from "~/components/form/SearchField";
import { TextField } from "~/components/form/TextField";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";

// keeping it generic as TS types for this are very hard
type Props = {
	// biome-ignore lint/suspicious/noExplicitAny: hard
	control: Control<any>;
	name: string;
};

export function CraftIngredientsField({ control, name }: Props) {
	const { fields, append, remove } = useFieldArray({
		control,
		name,
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
											name={`${name}.${i}.item`}
											query={api.item.getAllQuick}
										/>
									</div>
									<TextField
										label="Quantity"
										control={control}
										name={`${name}.${i}.quantity`}
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

				<Button type="button" size="sm" onClick={() => append({ quantity: 1 })}>
					Add Ingredient
				</Button>
			</div>
		</div>
	);
}
