"use client";

import { SkillType } from "@prisma/client";
import { isDirty, type z } from "zod";
import { SpriteField } from "~/components/SpriteField";
import { TextField } from "~/components/form/TextField";
import { Form, SubmitButton, useZodForm } from "~/components/form/zod-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { LocationFields } from "~/features/areas/components/LocationsField";
import { TeleportField } from "~/features/npcs/components/TeleportField";
import { api } from "~/trpc/react";
import { factionSchema } from "../schemas";

interface Props {
	id?: string;
	defaultValue?: z.infer<typeof factionSchema>;
}

export function FactionForm({ defaultValue, id }: Props) {
	const updateMutation = api.skill.update.useMutation();
	// const createMutation = api.item.create.useMutation();

	const form = useZodForm({
		schema: factionSchema,
		defaultValues: defaultValue,
	});

	return (
		<Form
			handleSubmit={async (values) => {
				if (id) {
					// return updateMutation.mutateAsync({ id, data: values });
				}
				// return createMutation.mutateAsync(values);
			}}
			persist
			form={form}
			className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
		>
			<TextField label="Name" control={form.control} name="name" />

			<div className="col-span-2">{/* <SkillItemsField /> */}</div>

			<div className="flex justify-end col-span-full">
				<SubmitButton>{defaultValue ? "Update" : "Create"}</SubmitButton>
			</div>
		</Form>
	);
}
