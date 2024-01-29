"use client";
import {
	type FieldMetadata,
	getFieldsetProps,
	getInputProps,
	useFormMetadata,
} from "@conform-to/react";
import { type Item } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { type z } from "zod";
import UnitSelect from "~/components/UnitSelect";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { FieldLabel } from "~/components/ui/label";
import { ItemField } from "~/features/items/components/ItemField";
import { cn } from "~/utils/styles";
import { type craftItemsSchema } from "../schemas";

type CraftItems = z.infer<typeof craftItemsSchema>;

type Props = {
	className?: string;
	items: Pick<Item, "id" | "name" | "spriteUrl">[];
	field: FieldMetadata<CraftItems | undefined>;
	label: string;
};

export function NpcCraftsMultiField({ className, items, field, label }: Props) {
	const name = field.name;
	const form = useFormMetadata(field.formId);
	const fields = field.getFieldList();

	return (
		<fieldset
			{...getFieldsetProps(field)}
			className={cn(className, "space-y-2 col-span-2")}
		>
			<FieldLabel field={field}>{label}</FieldLabel>

			<div className="space-y-4">
				{fields.map((f, index) => {
					const { itemId, price, unit, durationMinutes } = f.getFieldset();

					return (
						<fieldset
							key={f.key}
							{...getFieldsetProps(f)}
							className="grid grid-cols-4 gap-x-6"
						>
							<div className="grid grid-cols-5 col-span-3 gap-x-3">
								<ItemField
									field={itemId}
									items={items}
									className="col-span-2"
								/>
								<Input
									placeholder="Duration (mins)"
									{...getInputProps(durationMinutes, { type: "number" })}
									key={durationMinutes.key}
								/>
								<Input
									placeholder="Price"
									{...getInputProps(price, { type: "number" })}
									key={price.key}
								/>
								<UnitSelect field={unit} />
							</div>
							<Button
								size="icon"
								variant="destructive"
								{...form.remove.getButtonProps({ index, name })}
							>
								<Trash2 className="h-5 w-5" />
							</Button>
						</fieldset>
					);
				})}

				<Button {...form.insert.getButtonProps({ name })}>
					Add Craft Item
				</Button>
			</div>
			{/* {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null}
      {errMessage ? <p id={`${id}-err`} className="text-sm font-medium text-destructive">
        {errMessage}
      </p> : null}  */}
		</fieldset>
	);
}
