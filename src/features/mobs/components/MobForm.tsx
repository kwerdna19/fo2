"use client";
import type { Area, Faction, Item } from "@prisma/client";
import SpriteSelect from "~/components/SpriteSelect";
import { Form } from "~/components/form-ui/Form";
import FormCheckbox from "~/components/form-ui/FormCheckbox";
import FormInput from "~/components/form-ui/FormInput";
import LocationsMultiField from "~/features/areas/components/LocationsMultiField";
import { FactionSelect } from "~/features/factions/components/FactionSelect";
import { useConform } from "~/hooks/useConform";
import type { ConformServerAction } from "~/types/actions";
import type { getMobBySlug } from "../requests";
import { mobSchema } from "../schemas";
import DropItemsMultiField from "./DropItemsMultiField";

interface Props {
	areas: Pick<Area, "id" | "name" | "spriteUrl" | "height" | "width">[];
	items: Pick<Item, "id" | "name" | "spriteUrl">[];
	factions: Pick<Faction, "id" | "name">[];
	sprites: string[];
	defaultValue?: Awaited<ReturnType<typeof getMobBySlug>>;
	action: ConformServerAction;
}

export function MobForm({
	areas,
	items,
	factions,
	sprites,
	action: serverAction,
	defaultValue,
}: Props) {
	const [form, fields, action, lastResult] = useConform(serverAction, {
		schema: mobSchema,
		defaultValue,
	});

	if (lastResult?.status === "error") {
		console.log("DEBUG", lastResult);
	}

	const buttonText = defaultValue ? "Update" : "Create";

	return (
		<Form form={form} action={action} submit={buttonText}>
			<FormInput label="Name" field={fields.name} />
			<FormInput label="Level" field={fields.level} type="number" />
			<SpriteSelect field={fields.spriteUrl} label="Sprite" options={sprites} />
			<div className="grid grid-cols-2 gap-3">
				<FormInput label="Dmg Min" field={fields.dmgMin} type="number" />
				<FormInput label="Dmg Max" field={fields.dmgMax} type="number" />
			</div>

			<div className="grid grid-cols-2 gap-3">
				<FormInput label="Min Gold" field={fields.goldMin} type="number" />
				<FormInput label="Max Gold" field={fields.goldMax} type="number" />
			</div>

			<FormInput label="Health" field={fields.health} type="number" />
			<FormCheckbox field={fields.boss} label="Boss" />

			<FormInput label="Atk Speed" field={fields.atkSpeed} type="number" />

			<div className="grid grid-cols-2 gap-3">
				<FactionSelect
					label="Faction"
					factions={factions}
					field={fields.factionId}
				/>
				<FormInput label="Faction XP" field={fields.factionXp} type="number" />
			</div>

			<div className="col-span-2">
				<LocationsMultiField
					label="Locations"
					areas={areas}
					field={fields.locations}
					formId={form.id}
				/>
			</div>

			<div className="col-span-2">
				<DropItemsMultiField label="Drops" items={items} field={fields.drops} />
			</div>
		</Form>
	);
}
