"use client";
import {
	type FieldMetadata,
	getSelectProps,
	useInputControl,
} from "@conform-to/react";
import { Area } from "@prisma/client";
import { FieldLabel } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

export function AreaSelect({
	field,
	areas,
	label,
}: {
	field: FieldMetadata<string>;
	areas: Pick<Area, "id" | "name">[];
	label: string;
}) {
	const control = useInputControl(field);
	const { defaultValue, key, ...selectProps } = getSelectProps(field, {
		value: false,
	});

	const selectedArea = areas.find((a) => a.id === control.value);

	return (
		<div className="space-y-1">
			<FieldLabel field={field}>{label}</FieldLabel>
			<Select
				key={key}
				defaultValue={defaultValue?.toString()}
				{...selectProps}
				onValueChange={control.change}
				value={control.value}
			>
				<SelectTrigger>
					<SelectValue placeholder="Select Area" />
				</SelectTrigger>
				<SelectContent>
					{areas.map((o) => (
						<SelectItem key={o.id} value={o.id}>
							{o.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	);
}
