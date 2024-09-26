"use client";

import type { z } from "zod";
import { TextField } from "~/components/form/TextField";
import { Form, SubmitButton, useZodForm } from "~/components/form/zod-form";
import { api } from "~/trpc/react";
import { factionSchema } from "../schemas";

interface Props {
	id: number;
	defaultValue: z.infer<typeof factionSchema>;
}

export function FactionForm({ defaultValue, id }: Props) {
	const updateMutation = api.faction.update.useMutation();

	const form = useZodForm({
		schema: factionSchema,
		defaultValues: defaultValue,
	});

	return (
		<Form
			handleSubmit={async (data) => {
				return updateMutation.mutateAsync({ id, data });
			}}
			persist
			form={form}
			className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
		>
			<TextField label="Name" control={form.control} name="name" />
			<TextField label="Note" control={form.control} name="note" />

			<div className="flex justify-end col-span-full">
				<SubmitButton>{defaultValue ? "Update" : "Create"}</SubmitButton>
			</div>
		</Form>
	);
}
