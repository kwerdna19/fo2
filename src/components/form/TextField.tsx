import { useEffect } from "react";
import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";
import { Input, type InputProps } from "../ui/input";
import { Textarea } from "../ui/textarea";

type Props<FormShape extends FieldValues> = {
	label?: string;
	desc?: string;
	control: Control<FormShape>;
	name: FieldPathByValue<FormShape, string | number | Date | null | undefined>;
	type?: InputProps["type"];
	numLines?: number;
	autoFocus?: boolean;
	maxLength?: number;
	placeholder?: string;
	setNullOnEmpty?: boolean;
};

export function TextField<FormShape extends FieldValues>({
	label,
	desc,
	control,
	name,
	type = "text",
	numLines,
	autoFocus,
	maxLength,
	placeholder,
	setNullOnEmpty,
}: Props<FormShape>) {
	useEffect(() => {
		if (autoFocus) {
			document.querySelector<HTMLInputElement>(`[name="${name}"]`)?.focus();
		}
	}, [autoFocus, name]);

	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label ? <FormLabel>{label}</FormLabel> : null}
					<FormControl>
						{!numLines ? (
							<Input
								type={type}
								{...field}
								onChange={(e) => {
									if (e.target.value === "" && setNullOnEmpty) {
										field.onChange(null);
										return;
									}
									field.onChange(e);
								}}
								value={field.value ?? ""}
								placeholder={placeholder}
							/>
						) : (
							<Textarea
								rows={numLines}
								{...field}
								onChange={(e) => {
									if (e.target.value === "" && setNullOnEmpty) {
										field.onChange(null);
										return;
									}
									field.onChange(e);
								}}
								value={field.value ?? ""}
								placeholder={placeholder}
							/>
						)}
					</FormControl>
					{desc ? <FormDescription>{desc}</FormDescription> : null}
					{maxLength ? (
						<p className="text-dimmed text-xs text-right px-1">
							{field.value?.length ?? 0} / {maxLength}
						</p>
					) : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
