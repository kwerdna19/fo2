"use client";

import { SkillType } from "@prisma/client";
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
import { TeleportField } from "~/features/npcs/components/TeleportField";
import { api } from "~/trpc/react";
import { skillSchema } from "../schemas";
import { SkillItemsField } from "./SkillItemsField";

interface Props {
	id?: number;
	defaultValue?: z.infer<typeof skillSchema>;
}

export function SkillForm({ defaultValue, id }: Props) {
	const updateMutation = api.skill.update.useMutation();
	// const createMutation = api.item.create.useMutation();

	const form = useZodForm({
		schema: skillSchema,
		defaultValues: defaultValue,
	});

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
			<TextField
				label="Rank"
				control={form.control}
				name="rank"
				type="number"
			/>
			<TextField label="Note" control={form.control} name="note" />
			<FormField
				control={form.control}
				name="type"
				render={({ field }) => (
					<FormItem>
						<FormLabel>Type</FormLabel>
						<FormControl>
							<Select
								value={field.value ?? undefined}
								onValueChange={field.onChange}
							>
								<SelectTrigger>
									<SelectValue placeholder="Select type" />
								</SelectTrigger>
								<SelectContent>
									{Object.values(SkillType).map((o) => (
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

			<SpriteField control={form.control} type="SKILL" name="spriteName" />

			<TextField
				label="Level Req"
				control={form.control}
				name="levelReq"
				type="number"
			/>

			<div className="col-span-2 grid grid-cols-2 gap-3">
				<TextField
					label="Duration (min)"
					control={form.control}
					name="durationMins"
					type="number"
				/>
				<TextField
					label="Energy Cost"
					control={form.control}
					name="energyCost"
					type="number"
				/>
			</div>

			<div className="col-span-2 grid grid-cols-2 gap-3">
				{(["reqStr", "reqSta", "reqAgi", "reqInt"] as const).map((stat) => {
					return (
						<TextField
							key={stat}
							label={stat.replace("req", "Req ")}
							control={form.control}
							name={stat}
							type="number"
						/>
					);
				})}
			</div>

			<div className="col-span-2 grid grid-cols-2 gap-3">
				{(["str", "sta", "agi", "int"] as const).map((stat) => {
					return (
						<TextField
							key={stat}
							label={stat.toUpperCase()}
							control={form.control}
							name={stat}
							type="number"
						/>
					);
				})}
			</div>

			<div className="col-span-2 grid grid-cols-2 gap-3">
				{(
					["range", "atkPower", "armor", "crit", "dodge", "atkSpeed"] as const
				).map((stat) => {
					return (
						<TextField
							key={stat}
							label={stat.replace("Power", " power").replace("Speed", " speed")}
							control={form.control}
							name={stat}
							type="number"
						/>
					);
				})}
			</div>

			<div className="col-span-2 grid grid-cols-2 gap-3">
				{(["minValue", "maxValue", "value"] as const).map((stat) => {
					return (
						<TextField
							key={stat}
							label={stat.replace("Value", " value")}
							control={form.control}
							name={stat}
							type="number"
						/>
					);
				})}
			</div>

			<div className="col-span-2 grid grid-cols-2 gap-3">
				<TextField
					label="Tick Duration (sec)"
					control={form.control}
					name="tickDurationSec"
					type="number"
				/>
				<TextField
					label="Cast Time (sec)"
					control={form.control}
					name="castTimeSec"
					type="number"
				/>
				<TextField
					label="Cast Cooldown (sec)"
					control={form.control}
					name="castCooldownTimeSec"
					type="number"
				/>
			</div>

			{type === "TELEPORT" && (
				<div className="col-span-2">
					<TeleportField />
				</div>
			)}

			<div className="col-span-2">
				<SkillItemsField />
			</div>

			<div className="flex justify-end col-span-full">
				<SubmitButton>{defaultValue ? "Update" : "Create"}</SubmitButton>
			</div>
		</Form>
	);
}
