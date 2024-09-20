"use client";
import type { z } from "zod";
import { CheckboxField } from "~/components/form/CheckboxField";
import { Form, SubmitButton, useZodForm } from "~/components/form/zod-form";
import { LocationFields } from "~/features/areas/components/LocationsField";
import { api } from "~/trpc/react";
import { mobSchema } from "../schemas";

interface Props {
	id?: string;
	defaultValue?: z.infer<typeof mobSchema>;
}

export function MobForm({ defaultValue, id }: Props) {
	const updateMutation = api.mob.update.useMutation();
	// const createMutation = api.item.create.useMutation();

	const form = useZodForm({
		schema: mobSchema,
		defaultValues: defaultValue,
	});

	return (
		<Form
			handleSubmit={async (values) => {
				if (id) {
					return updateMutation.mutateAsync({ id, data: values });
				}
				// return createMutation.mutateAsync(values);
			}}
			persist
			form={form}
			className="grid grid-cols-1 sm:grid-cols-2 gap-6"
		>
			<div className="col-span-2">
				<LocationFields />
			</div>

			<CheckboxField control={form.control} name="boss" label="Boss" />

			<div className="flex justify-end col-span-full">
				<SubmitButton>{defaultValue ? "Update" : "Create"}</SubmitButton>
			</div>
		</Form>
	);
}
