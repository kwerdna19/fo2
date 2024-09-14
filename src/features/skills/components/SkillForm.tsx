"use client";
import { getInputProps } from "@conform-to/react";
import { type Area, type Item, SkillType } from "@prisma/client";
import SpriteSelect from "~/components/SpriteSelect";
import { Form } from "~/components/form-ui/Form";
import FormInput from "~/components/form-ui/FormInput";
import FormSelect from "~/components/form-ui/FormSelect";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { AreaSelect } from "~/features/areas/components/AreaSelect";
import ItemsMultiField from "~/features/items/components/ItemsMultiField";
import { useConform } from "~/hooks/useConform";
import type { RouterOutputs } from "~/trpc/react";
import type { ConformServerAction } from "~/types/actions";
import { skillSchema } from "../schemas";

interface Props {
	items: Pick<Item, "id" | "name">[];
	areas: Pick<Area, "id" | "name">[];
	sprites: string[];
	defaultValue?: RouterOutputs["skill"]["getBySlug"];
	action: ConformServerAction;
}

export function SkillForm({
	sprites,
	items,
	areas,
	action: serverAction,
	defaultValue,
}: Props) {
	const [form, fields, action, lastResult] = useConform(serverAction, {
		schema: skillSchema,
		defaultValue,
	});

	if (lastResult?.status === "error") {
		console.log("DEBUG", lastResult);
	}

	const buttonText = defaultValue ? "Update" : "Create";

	return (
		<Form form={form} action={action} submit={buttonText}>
			<FormInput label="Name" field={fields.name} />

			<SpriteSelect
				field={fields.spriteUrl}
				label="Sprite"
				options={sprites}
				icon
			/>

			<FormInput label="Rank" field={fields.rank} type="number" />

			<FormSelect
				label="Type"
				options={Object.values(SkillType)}
				field={fields.type}
			/>

			<FormInput
				label="Desc"
				field={fields.desc}
				placeholder="In game description"
			/>
			<FormInput label="Note" field={fields.note} />

			<FormInput label="Level Req" field={fields.levelReq} type="number" />

			<FormInput
				label="Cast Time (sec)"
				field={fields.castTimeSec}
				type="number"
			/>
			<FormInput
				label="Cooldown (sec)"
				field={fields.castCooldownTimeSec}
				type="number"
			/>
			<FormInput
				label="Duration (mins)"
				field={fields.durationMins}
				type="number"
			/>
			<FormInput label="Energy Cost" field={fields.energyCost} type="number" />

			<FormInput
				label="Tick Duration (sec)"
				field={fields.tickDurationSec}
				type="number"
			/>

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
				<div className="grid grid-cols-4 gap-3">
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
					<Input
						placeholder="Crit"
						{...getInputProps(fields.crit, { type: "number" })}
					/>
					<Input
						placeholder="Dodge"
						{...getInputProps(fields.dodge, { type: "number" })}
					/>
					<Input
						placeholder="Range"
						{...getInputProps(fields.range, { type: "number" })}
					/>
					<Input
						placeholder="Atk Power"
						{...getInputProps(fields.atkPower, { type: "number" })}
					/>
					<Input
						placeholder="Atk Speed"
						{...getInputProps(fields.atkSpeed, { type: "number" })}
					/>
				</div>
			</div>

			<div className="grid grid-cols-3 gap-4">
				<FormInput label="Min Value" field={fields.minValue} type="number" />
				<FormInput label="Value" field={fields.value} type="number" />
				<FormInput label="Max Value" field={fields.maxValue} type="number" />
			</div>

			<div>
				<AreaSelect label="Teleport Area" areas={areas} field={fields.areaId} />
			</div>

			<div className="col-span-2">
				<ItemsMultiField label="Item/s" items={items} field={fields.items} />
			</div>
		</Form>
	);
}
