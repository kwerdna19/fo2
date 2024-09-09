"use client";

import { Unit } from "@prisma/client";
import { FieldLabel } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { cn } from "~/utils/styles";
import { UnitSprite } from "./UnitSprite";

import type { Control, FieldPathByValue, FieldValues } from "react-hook-form";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";

const options = Object.values(Unit).reverse();

type Props<FormShape extends FieldValues> = {
	className?: string;
	label?: string;
	desc?: string;
	control: Control<FormShape>;
	name: FieldPathByValue<FormShape, Unit | null | undefined>;
};

export default function UnitSelect<FormShape extends FieldValues>({
	control,
	name,
	desc,
	label,
}: Props<FormShape>) {
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => (
				<FormItem>
					{label ? <FormLabel>{label}</FormLabel> : null}
					<FormControl>
						<Select value={field.value} onValueChange={field.onChange}>
							<SelectTrigger
								className="flex items-center justify-center"
								noIcon
							>
								<SelectValue placeholder="Unit" />
							</SelectTrigger>
							<SelectContent className="min-w-[5rem]">
								{options.map((o) => (
									<SelectItem key={o} value={o}>
										<UnitSprite type={o} size="sm" />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</FormControl>
					{desc ? <FormDescription>{desc}</FormDescription> : null}
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
