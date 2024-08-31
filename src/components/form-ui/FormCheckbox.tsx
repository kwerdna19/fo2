"use client";
import { type FieldMetadata, getInputProps } from "@conform-to/react";
import { FieldLabel } from "~/components/ui/label";
import { cn } from "~/utils/styles";
import { Checkbox } from "../ui/checkbox";

export default function FormCheckbox({
	className,
	field,
	label,
}: { className?: string; field: FieldMetadata<boolean>; label: string }) {
	const errMessage = field.errors?.at(0);

	return (
		<div className={cn("space-y-1", className)}>
			<FieldLabel field={field}>{label}</FieldLabel>
			<Checkbox
				className="block"
				{...getInputProps(field, { type: "checkbox" })}
				key={field.key}
				type="button"
			/>
			{/* {placeholder && !errMessage ? <p id={`${id}-desc`} className="text-sm font-medium text-muted-foreground">
        {placeholder}
      </p> : null} */}
			{errMessage ? (
				<p id={field.errorId} className="text-sm font-medium text-destructive">
					{errMessage}
				</p>
			) : null}
		</div>
	);
}
