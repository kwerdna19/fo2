"use client";
import {
	type Control,
	Controller,
	type FieldPathByValue,
	type FieldValues,
} from "react-hook-form";
import {
	type GenericSearchComboboxProps,
	SearchCombobox,
	type SearchComboboxProps,
	type SearchQuery,
	type ValueShape,
} from "~/components/SearchCombobox";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";

export function SearchField<
	V extends ValueShape,
	Q extends SearchQuery<V>,
	FormShape extends FieldValues,
>({
	type,
	control,
	name,
	label,
	desc,
	query,
	prefetch,
}: {
	type: string;
	control: Control<FormShape>;
	name: FieldPathByValue<FormShape, V | undefined>;
	label?: string;
	desc?: string;
	query: Q;
	prefetch?: boolean;
}) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label ? <FormLabel>{label}</FormLabel> : null}
					<FormControl>
						<SearchCombobox
							type={type}
							value={field.value}
							onValueChange={field.onChange}
							prefetch={prefetch}
							// @ts-expect-error
							query={query}
						/>
					</FormControl>
					{desc ? <FormDescription>{desc}</FormDescription> : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
