"use client";
import {
	type FieldMetadata,
	getFieldsetProps, useFormMetadata
} from "@conform-to/react";
import { type Item } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";
import { FieldLabel } from "~/components/ui/label";
import { ItemField } from "~/features/items/components/ItemField";
import { cn } from "~/utils/styles";


export type Props = {
	className?: string;
	items: Pick<Item, "id" | "name" | "spriteUrl">[];
	field: FieldMetadata<{ id: string }[] | undefined>;
	label: string;
};

export default function ItemsMultiField({
	className,
	items,
	field,
	label,
}: Props) {
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
					const { id } = f.getFieldset();

					return (
						<fieldset
							key={f.key}
							{...getFieldsetProps(f)}
							className="grid grid-cols-4 gap-x-6"
						>
							<ItemField
								field={id}
								items={items}
								className="col-span-3"
							/>
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

				<Button {...form.insert.getButtonProps({ name })}>Add Item</Button>
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
