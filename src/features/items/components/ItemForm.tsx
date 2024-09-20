"use client";
import type { z } from "zod";
import { CheckboxField } from "~/components/form/CheckboxField";
import { TextField } from "~/components/form/TextField";
import { Form, SubmitButton, useZodForm } from "~/components/form/zod-form";
import { api } from "~/trpc/react";
import { itemSchema } from "../schemas";
import { CraftRecipesField } from "./CraftRecipesField";
import { SoldByField } from "./SoldByField";

interface Props {
	id?: string;
	defaultValue?: z.infer<typeof itemSchema>;
}

export function ItemForm({ id, defaultValue }: Props) {
	const updateMutation = api.item.update.useMutation();
	// const createMutation = api.item.create.useMutation();

	const form = useZodForm({
		schema: itemSchema,
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

			<TextField
				label="Artist"
				control={form.control}
				name="artist"
				placeholder="E.g. Perseus, Lighterthief"
			/>
			<CheckboxField
				label="Global Loot"
				control={form.control}
				name="globalLoot"
			/>

			<TextField
				label="Global Loot Drop Rate"
				type="number"
				control={form.control}
				name="globalLootDropRate"
			/>

			<div className="col-span-2">
				<CraftRecipesField />
			</div>

			<div className="col-span-2">
				<SoldByField />
			</div>

			{/* TO BE REWORKED? */}
			{/* <div className="grid grid-cols-2 gap-5">
				<FormInput
					label="Availability Start Date"
					field={fields.availableStart}
					type="date"
				/>
				<FormInput
					label="Availability End Date"
					field={fields.availableEnd}
					type="date"
				/>
			</div> */}

			{/* <div className="col-span-2">
				<SoldByNpcsMultiField
					label="Sold By"
					field={fields.soldBy}
					npcs={npcs}
				/>
			</div>



			<div className="col-span-2">
				<AcquiredByBattlePassesMultiField
					label="Battle Passes"
					battlePasses={battlePasses}
					field={fields.battlePassTiers}
				/>
			</div> */}

			<div className="flex justify-end col-span-full">
				<SubmitButton>{defaultValue ? "Update" : "Create"}</SubmitButton>
			</div>
		</Form>
	);
}
