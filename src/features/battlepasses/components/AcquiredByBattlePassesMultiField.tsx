"use client";
import {
	type FieldMetadata,
	getFieldsetProps,
	getInputProps,
	useFormMetadata,
	useInputControl,
} from "@conform-to/react";
import type { BattlePass } from "@prisma/client";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { useState } from "react";
import type { z } from "zod";
import { ControlledHiddenField } from "~/components/form-ui/ControlledHiddenField";
import { Button } from "~/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";
import { Input } from "~/components/ui/input";
import { FieldLabel } from "~/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/utils/styles";
import type { itemBattlePassTiersSchema } from "../schemas";

type AcquiredBy = z.infer<typeof itemBattlePassTiersSchema>;

type Props = {
	className?: string;
	battlePasses: Pick<BattlePass, "id" | "name">[];
	field: FieldMetadata<AcquiredBy | undefined>;
	label: string;
};

function BattlePassField({
	battlePasses,
	field,
}: { battlePasses: Props["battlePasses"]; field: FieldMetadata<string> }) {
	const control = useInputControl(field);
	const [open, setOpen] = useState(false);

	const [selectedItem, setSelectedItem] = useState(
		battlePasses.find((e) => e.id === field.value),
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className="justify-between col-span-3"
				>
					<div className="flex items-center gap-x-3">
						{selectedItem?.name ?? "Select battle pass..."}
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-[--radix-popover-trigger-width] p-0"
			>
				<Command>
					<CommandInput placeholder="Search items..." />
					<CommandList className="max-h-48 overflow-auto">
						<CommandEmpty>No items found.</CommandEmpty>

						{battlePasses.map((p) => (
							<CommandItem
								key={p.id}
								value={p.name}
								onSelect={() => {
									setSelectedItem(p);
									control.change(p.id);
									setOpen(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										field.value === p.id ? "opacity-100" : "opacity-0",
									)}
								/>
								<div className="text-md">{p.name}</div>
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
			<ControlledHiddenField field={field} value={control.value} />
		</Popover>
	);
}

export default function AcquiredByBattlePassesMultiField({
	className,
	battlePasses,
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
					const { battlePassId, tier } = f.getFieldset();

					return (
						<fieldset
							key={f.key}
							{...getFieldsetProps(f)}
							className="grid grid-cols-4 gap-x-6"
						>
							<div className="grid grid-cols-4 col-span-3 gap-x-3">
								<BattlePassField
									field={battlePassId}
									battlePasses={battlePasses}
								/>
								<Input
									placeholder="Tier"
									{...getInputProps(tier, { type: "number" })}
									key={tier.key}
								/>
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
					Add Battle Pass
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
