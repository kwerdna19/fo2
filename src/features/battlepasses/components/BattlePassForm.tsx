"use client";
import type { Item } from "@prisma/client";
import { Form } from "~/components/form-ui/Form";
import FormInput from "~/components/form-ui/FormInput";
import { useConform } from "~/hooks/useConform";
import type { RouterOutputs } from "~/trpc/react";
import type { ConformServerAction } from "~/types/actions";
import { battlePassSchema } from "../schemas";
import { BattlePassTiersMultiField } from "./BattlePassTiersMultiField";

interface Props {
	items: Pick<Item, "id" | "name">[];
	defaultValue?: RouterOutputs["battlePass"]["getBySlug"];
	action: ConformServerAction;
}

export function BattlePassForm({
	items,
	action: serverAction,
	defaultValue,
}: Props) {
	const [form, fields, action, lastResult] = useConform(serverAction, {
		schema: battlePassSchema,
		defaultValue,
	});

	if (lastResult?.status === "error") {
		console.log("DEBUG", lastResult);
	}

	const buttonText = defaultValue ? "Update" : "Create";

	return (
		<Form form={form} action={action} submit={buttonText}>
			<FormInput label="Name" field={fields.name} />
			<FormInput label="Desc" field={fields.desc} />
			<FormInput
				label="Duration (days)"
				field={fields.durationDays}
				type="number"
			/>
			<FormInput label="XP per tier" field={fields.xpPerTier} type="number" />
			<FormInput label="Note" field={fields.note} />

			<div className="col-span-2">
				<BattlePassTiersMultiField
					label="Tiers"
					items={items}
					field={fields.tiers}
				/>
			</div>
		</Form>
	);
}
