"use client";
import { getInputProps } from "@conform-to/react";
import {
	type BattlePass,
	EquippableType,
	type Mob,
	type Npc,
} from "@prisma/client";
import SpriteSelect from "~/components/SpriteSelect";
import { Form } from "~/components/form-ui/Form";
import FormCheckbox from "~/components/form-ui/FormCheckbox";
import FormInput from "~/components/form-ui/FormInput";
import FormSelect from "~/components/form-ui/FormSelect";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import AcquiredByBattlePassesMultiField from "~/features/battlepasses/components/AcquiredByBattlePassesMultiField";
import { useConform } from "~/hooks/useConform";
import type { ConformServerAction } from "~/types/actions";
import type { getItemBySlug } from "../requests";
import { itemSchema } from "../schemas";
import CraftedByNpcsMultiField from "./CraftedByNpcsMultiField";
import DroppedByMobsMultiField from "./DroppedByMobsMultiField";
import SoldByNpcsMultiField from "./SoldByNpcsMultiField";

interface Props {
	npcs: Pick<Npc, "id" | "name" | "spriteUrl">[];
	mobs: Pick<Mob, "id" | "name" | "spriteUrl">[];
	battlePasses: Pick<BattlePass, "id" | "name">[];
	sprites: string[];
	defaultValue?: Awaited<ReturnType<typeof getItemBySlug>>;
	action: ConformServerAction;
}

export function ItemForm({
	sprites,
	mobs,
	npcs,
	action: serverAction,
	battlePasses,
	defaultValue,
}: Props) {
	const [form, fields, action, lastResult] = useConform(serverAction, {
		schema: itemSchema,
		defaultValue,
	});

	if (lastResult?.status === "error") {
		console.log("DEBUG", lastResult);
	}

	const buttonText = defaultValue ? "Update" : "Create";

	return (
		<Form form={form} action={action} submit={buttonText}>
			<FormInput label="Name" field={fields.name} />
			<FormSelect
				label="Equipment Type"
				options={Object.keys(EquippableType)}
				field={fields.equip}
			/>
			<FormInput label="Level Req" field={fields.levelReq} type="number" />

			<SpriteSelect
				field={fields.spriteUrl}
				label="Sprite"
				options={sprites}
				icon
			/>

			<FormInput
				label="Desc"
				field={fields.desc}
				placeholder="In game description"
			/>

			<FormInput
				label="Artist"
				field={fields.artist}
				placeholder="E.g. Perseus, Lighterthief"
			/>

			<FormInput label="Note" field={fields.note} />

			<div className="grid grid-cols-3 gap-5">
				<FormCheckbox label="2-Handed" field={fields.twoHand} />
				<FormCheckbox label="Consumable" field={fields.consumable} />
				<FormCheckbox label="Global" field={fields.globalLoot} />
			</div>
			<div className="grid grid-cols-2 gap-5">
				<FormInput label="Sell Price" field={fields.sellPrice} type="number" />
				<FormInput label="Stack Size" field={fields.stackSize} type="number" />
			</div>
			<div className="grid grid-cols-2 gap-5">
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
			</div>
			<div className="space-y-1">
				<Label>Required Stats</Label>
				<div className="grid grid-cols-4 gap-3">
					<Input
						placeholder="Req Str"
						{...getInputProps(fields.reqStr, { type: "number" })}
					/>
					<Input
						placeholder="Req Sta"
						{...getInputProps(fields.reqSta, { type: "number" })}
					/>
					<Input
						placeholder="Req Agi"
						{...getInputProps(fields.reqAgi, { type: "number" })}
					/>
					<Input
						placeholder="Req Int"
						{...getInputProps(fields.reqInt, { type: "number" })}
					/>
				</div>
			</div>

			<div className="space-y-1">
				<Label>Bonus Stats</Label>
				<div className="grid grid-cols-5 gap-3">
					<Input
						placeholder="Str"
						{...getInputProps(fields.str, { type: "number" })}
					/>
					<Input
						placeholder="Sta"
						{...getInputProps(fields.sta, { type: "number" })}
					/>
					<Input
						placeholder="Agi"
						{...getInputProps(fields.agi, { type: "number" })}
					/>
					<Input
						placeholder="Int"
						{...getInputProps(fields.int, { type: "number" })}
					/>
					<Input
						placeholder="Armor"
						{...getInputProps(fields.armor, { type: "number" })}
					/>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-4">
				<FormInput label="Atk Speed" field={fields.atkSpeed} type="number" />
				<FormInput label="Dmg Min" field={fields.dmgMin} type="number" />
				<FormInput label="Dmg Max" field={fields.dmgMax} type="number" />
			</div>

			<div className="col-span-2">
				<DroppedByMobsMultiField
					label="Dropped By"
					field={fields.droppedBy}
					mobs={mobs}
				/>
			</div>

			<div className="col-span-2">
				<SoldByNpcsMultiField
					label="Sold By"
					field={fields.soldBy}
					npcs={npcs}
				/>
			</div>

			<div className="col-span-2">
				<CraftedByNpcsMultiField
					label="Crafted By"
					field={fields.craftedBy}
					npcs={npcs}
				/>
			</div>

			<div className="col-span-2">
				<AcquiredByBattlePassesMultiField
					label="Battle Passes"
					battlePasses={battlePasses}
					field={fields.battlePassTiers}
				/>
			</div>
		</Form>
	);
}
