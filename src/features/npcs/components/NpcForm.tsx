"use client";
import type { Area, Item } from "@prisma/client";
import SpriteSelect from "~/components/SpriteSelect";
import { Form } from "~/components/form-ui/Form";
import FormInput from "~/components/form-ui/FormInput";
import FormSelect from "~/components/form-ui/FormSelect";
import LocationsMultiField from "~/features/areas/components/LocationsMultiField";
import { useConform } from "~/hooks/useConform";
import type { RouterOutputs } from "~/trpc/react";
import type { ConformServerAction } from "~/types/actions";
import { npcSchema, npcTypes } from "../schemas";

interface Props {
	areas: Pick<Area, "id" | "name" | "spriteUrl" | "height" | "width">[];
	items: Pick<Item, "id" | "name" | "spriteName">[];
	sprites: string[];
	defaultValue?: RouterOutputs["npc"]["getBySlug"];
	action: ConformServerAction;
}

export function NpcForm({
	areas,
	items,
	sprites,
	action: serverAction,
	defaultValue,
}: Props) {
	const [form, fields, action, lastResult] = useConform(serverAction, {
		schema: npcSchema,
		defaultValue,
	});

	if (lastResult?.status === "error") {
		console.log("DEBUG", lastResult);
	}

	const buttonText = defaultValue ? "Update" : "Create";

	// return (
	// 	<Form form={form} action={action} submit={buttonText}>
	// 		<FormInput label="Name" field={fields.name} />
	// 		<FormSelect field={fields.type} label="Type" options={npcTypes} />
	// 		<SpriteSelect field={fields.spriteUrl} label="Sprite" options={sprites} />

	// 		<div className="col-span-2">
	// 			<LocationsMultiField
	// 				label="Locations"
	// 				areas={areas}
	// 				field={fields.locations}
	// 				formId={form.id}
	// 			/>
	// 		</div>

	// 		<div className="col-span-2">
	// 			<NpcItemsMultiField label="Sells" items={items} field={fields.items} />
	// 		</div>

	// 		<div className="col-span-2">
	// 			<NpcCraftsMultiField
	// 				label="Crafts"
	// 				items={items}
	// 				field={fields.crafts}
	// 			/>
	// 		</div>
	// 	</Form>
	// );

	return null;
}
