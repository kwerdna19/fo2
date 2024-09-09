import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";
import { Checkbox } from "../ui/checkbox";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "../ui/form";

type Props<FormShape extends FieldValues> = {
	label?: string;
	desc?: string;
	control: Control<FormShape>;
	name: FieldPathByValue<FormShape, boolean | null | undefined>;
};

export function CheckboxField<FormShape extends FieldValues>({
	label,
	desc,
	control,
	name,
}: Props<FormShape>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label ? <FormLabel>{label}</FormLabel> : null}
					<FormControl>
						<Checkbox
							checked={field.value}
							onCheckedChange={(e) => {
								field.onChange(Boolean(e));
							}}
						/>
					</FormControl>
					{desc ? <FormDescription>{desc}</FormDescription> : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
