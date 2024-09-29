"use client";

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
import { api } from "~/trpc/react";
import { npcSchema, npcTypes } from "../schemas";
import { CraftsField } from "./CraftsField";
import { SaleItemsField } from "./SaleItemsField";
import { TeleportField } from "./TeleportField";

interface Props {
	id?: number;
	defaultValue?: z.infer<typeof npcSchema>;
}

export function NpcForm({ defaultValue, id }: Props) {
	const updateMutation = api.npc.update.useMutation();
	// const createMutation = api.item.create.useMutation();

	const form = useZodForm({
		schema: npcSchema,
		defaultValues: defaultValue,
	});

	// TODO - handle removal of invalid fields if type changes
	const type = form.watch("type");

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
			className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
		>
			<TextField label="Name" control={form.control} name="name" />
			<TextField label="Note" control={form.control} name="note" />

			<FormField
				control={form.control}
				name="type"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Type</FormLabel>
						<FormControl>
							<Select value={field.value} onValueChange={field.onChange}>
								<SelectTrigger>
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									{npcTypes.map((o) => (
										<SelectItem key={o} value={o}>
											{o}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<SpriteField control={form.control} type="NPC" name="spriteName" />

			<div className="col-span-2">
				<LocationFields />
			</div>

			<div className="col-span-2">
				{type === "Craft" ? <CraftsField /> : null}
				{type === "Shop" ? <SaleItemsField /> : null}
				{type === "Teleport" ? <TeleportField /> : null}
			</div>

			{/* <CheckboxField control={form.control} name="boss" label="Boss" /> */}

			<div className="flex justify-end col-span-full">
				<SubmitButton>{defaultValue ? "Update" : "Create"}</SubmitButton>
			</div>
		</Form>
	);
}
