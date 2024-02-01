"use client";
import {
	type FieldMetadata,
	getFieldsetProps,
	getInputProps,
	useFormMetadata,
	useInputControl,
	getSelectProps,
} from "@conform-to/react";
import { type Area } from "@prisma/client";
import { Map as MapIcon, Trash2 } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { type z } from "zod";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";
import { FieldLabel } from "~/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { cn } from "~/utils/styles";
import { coordinatesSchema, type locationsSchema } from "../schemas";

const SingleAreaMap = dynamic(
	() => import("~/features/areas/components/SingleAreaMap"),
	{ ssr: false },
);
const LocationInput = dynamic(
	() => import("~/features/areas/components/LocationInput"),
	{ ssr: false },
);

type Locations = z.infer<typeof locationsSchema>;

type Props = {
	label: string;
	className?: string;
	areas: Pick<Area, "id" | "name" | "spriteUrl" | "height" | "width">[];
	field: FieldMetadata<Locations | undefined>;
	formId: string;
};

export function MapCoordinatesField({
	area,
	x,
	y,
}: {
	area:
		| Pick<Area, "id" | "name" | "spriteUrl" | "height" | "width">
		| undefined;
	x: FieldMetadata<number>;
	y: FieldMetadata<number>;
}) {
	const [coordinates, setCoordinates] = useState(() => {
		if (!x.initialValue || !y.initialValue) {
			return;
		}
		const parsed = coordinatesSchema.safeParse({
			x: parseInt(x.initialValue),
			y: parseInt(y.initialValue),
		});
		return parsed.success ? parsed.data : undefined;
	});

	const [open, setOpen] = useState(false);

	const xControl = useInputControl(x);
	const yControl = useInputControl(y);

	const saveValues = () => {
		if (coordinates) {
			xControl.change(`${coordinates.x}`);
			yControl.change(`${coordinates.y}`);
		}
	};

	return (
		<div className="grid grid-cols-5 gap-x-2 items-center justify-between">
			<Input
				className="col-span-2"
				placeholder="x"
				disabled={area === undefined}
				{...getInputProps(x, { type: "number" })}
				key={x.key}
			/>
			<Input
				className="col-span-2"
				placeholder="y"
				disabled={area === undefined}
				{...getInputProps(y, { type: "number" })}
				key={y.key}
			/>
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger asChild>
					<Button variant="outline" size="icon" disabled={area === undefined}>
						<MapIcon className="h-5 w-5" />
					</Button>
				</DialogTrigger>
				<DialogContent forceMount className="max-w-screen-xl w-full">
					<div className="flex justify-center">
						{area ? (
							<SingleAreaMap
								area={{
									...area,
									locations: [],
								}}
								className="shadow-none"
							>
								<LocationInput value={coordinates} onChange={setCoordinates} />
							</SingleAreaMap>
						) : (
							<div className="flex items-center justify-center h-full border-dashed border">
								Select an area to view map and select coordinates
							</div>
						)}
					</div>
					<DialogFooter>
						<Button
							onClick={() => {
								saveValues();
								setOpen(false);
							}}
							disabled={coordinates === undefined}
						>
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</div>
	);
}

function LocationField({
	field,
	areas,
}: { field: FieldMetadata<Locations[number]>; areas: Props["areas"] }) {
	const { areaId, x, y } = field.getFieldset();

	const control = useInputControl(areaId);
	const { defaultValue, key, ...areaSelectProps } = getSelectProps(areaId, {
		value: false,
	});
	const selectedArea = areas.find(a => a.id === control.value)

	return (
		<fieldset {...getFieldsetProps(field)} className="grid grid-cols-4 gap-x-4">
			<div className="col-span-3 space-y-2">
				<Select
					key={key}
					defaultValue={defaultValue?.toString()}
					{...areaSelectProps}
					onValueChange={control.change}
					value={control.value}
				>
					<SelectTrigger>
						<SelectValue placeholder="Select Area" />
					</SelectTrigger>
					<SelectContent>
						{areas.map((o) => (
							<SelectItem key={o.id} value={o.id}>
								{o.name}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<MapCoordinatesField x={x} y={y} area={selectedArea} />
		</fieldset>
	);
}

export default function LocationsMultiField({
	areas,
	label,
	field,
	formId,
}: Props) {
	const name = field.name;
	const fields = field.getFieldList();

	const form = useFormMetadata(formId);

	return (
		<div className={cn("space-y-2 col-span-2")}>
			<FieldLabel field={field}>{label}</FieldLabel>
			<div className="space-y-4">
				{fields.map((f, index) => {
					return (
						<div key={f.key} className="grid grid-cols-6 gap-x-8">
							<div className="col-span-5">
								<LocationField field={f} areas={areas} />
							</div>
							<Button
								size="icon"
								variant="destructive"
								{...form.remove.getButtonProps({ name, index })}
							>
								<Trash2 className="h-5 w-5" />
							</Button>
						</div>
					);
				})}
				<Button {...form.insert.getButtonProps({ name })}>Add Location</Button>
			</div>
		</div>
	);
}
