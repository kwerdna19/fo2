"use client";
import {
	type FieldMetadata,
	getSelectProps,
	useInputControl,
} from "@conform-to/react";
import { Faction } from "@prisma/client";
import { FieldLabel } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

export function FactionSelect({
	field,
	factions,
	label,
}: {
	field: FieldMetadata<string | undefined>;
	factions: Pick<Faction, "id" | "name">[];
	label: string;
}) {
	const control = useInputControl(field);
	const { defaultValue, key, ...selectProps } = getSelectProps(field, {
		value: false,
	});

	const { required } = field.constraint ?? {};

	// const selectedFaction = factions.find((a) => a.id === control.value);

	return (
		<div className="space-y-1">
			<FieldLabel field={field}>{label}</FieldLabel>
			<Select
				key={key}
				required={required}
				defaultValue={defaultValue?.toString()}
				onValueChange={control.change}
				value={control.value}
				{...selectProps}
			>
				<SelectTrigger
					onKeyDown={(e) =>
						!required && (e.key === "Backspace" || e.key === "Delete")
							? control.change("")
							: null
					}
					onBlur={control.blur}
				>
					<SelectValue placeholder="Select Faction" />
				</SelectTrigger>
				<SelectContent>
					{factions.map((o) => (
						<SelectItem key={o.id} value={o.id}>
							{o.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
