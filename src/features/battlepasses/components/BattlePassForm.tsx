"use client";
import type { z } from "zod";
import { TextField } from "~/components/form/TextField";
import { Form, SubmitButton, useZodForm } from "~/components/form/zod-form";
import { api } from "~/trpc/react";
import { battlePassSchema } from "../schemas";

interface Props {
	id?: string;
	defaultValue?: z.infer<typeof battlePassSchema>;
}

export function BattlePassForm({ id, defaultValue }: Props) {
	const updateMutation = api.battlePass.update.useMutation();
	// const createMutation = api.item.create.useMutation();

	const form = useZodForm({
		schema: battlePassSchema,
		defaultValues: defaultValue,
	});

	return (
		<Form
			handleSubmit={(values) => {
				if (id) {
					return updateMutation.mutateAsync({ id, data: values });
				}
				// return createMutation.mutateAsync(values);
			}}
			persist
			form={form}
			className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-6"
		>
			<TextField label="Note" control={form.control} name="note" />

			{/* <div className="col-span-2">
				<CraftRecipesField />
			</div>

			<div className="col-span-2">
				<SoldByField />
			</div> */}

			<div className="flex justify-end col-span-full">
				<SubmitButton>{defaultValue ? "Update" : "Create"}</SubmitButton>
			</div>
		</Form>
	);
}
