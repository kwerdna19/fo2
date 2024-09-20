"use client";

import { MapIcon, Trash2, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useFieldArray, useFormContext } from "react-hook-form";
import type { z } from "zod";
import { SearchField } from "~/components/form/SearchField";
import { Button } from "~/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogTrigger,
} from "~/components/ui/dialog";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { api } from "~/trpc/react";
import type { locationsSchema } from "../schemas";

const SingleAreaMap = dynamic(
	() => import("~/features/areas/components/SingleAreaMap"),
	{ ssr: false },
);
const LocationInput = dynamic(
	() => import("~/features/areas/components/LocationInput"),
	{ ssr: false },
);

type FormValues = { locations: z.infer<typeof locationsSchema> };

function CoordinatesField({ index }: { index: number }) {
	const [open, setOpen] = useState(false);
	const { control, watch } = useFormContext<FormValues>();

	const area = watch(`locations.${index}.area`);

	const { data: areaInfo } = api.area.getById.useQuery(
		{ id: area?.id },
		{ enabled: !!area },
	);

	return (
		<FormField
			control={control}
			name={`locations.${index}.coordinates`}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Coordinates</FormLabel>
					<FormControl>
						<div className="grid grid-cols-5 gap-x-2 items-center justify-between">
							<Input
								className="col-span-2"
								placeholder="x"
								disabled={area === undefined}
								value={field.value?.x ?? ""}
								type="number"
								onChange={(e) => {
									field.onChange({
										...field.value,
										x: e.target.value ? Number(e.target.value) : undefined,
									});
								}}
							/>
							<Input
								className="col-span-2"
								placeholder="y"
								disabled={area === undefined}
								value={field.value?.y ?? ""}
								type="number"
								onChange={(e) => {
									field.onChange({
										...field.value,
										y: e.target.value ? Number(e.target.value) : undefined,
									});
								}}
							/>
							<Dialog open={open} onOpenChange={setOpen}>
								<DialogTrigger asChild>
									<Button
										variant="outline"
										disabled={area === undefined || !areaInfo}
										size="sm"
									>
										<MapIcon className="size-5" />
									</Button>
								</DialogTrigger>
								<DialogContent forceMount className="max-w-screen-xl w-full">
									<div className="flex justify-center">
										{areaInfo ? (
											<SingleAreaMap area={areaInfo}>
												<LocationInput
													value={field.value}
													onChange={field.onChange}
												/>
											</SingleAreaMap>
										) : null}
									</div>
									<DialogFooter>
										<Button onClick={() => setOpen(false)}>Save</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}

export function LocationFields() {
	const { control } = useFormContext<FormValues>();

	api.area.getAllQuick.usePrefetchQuery();

	const { fields, append, remove } = useFieldArray({
		control,
		name: "locations",
		keyName: "key",
	});

	return (
		<div className="space-y-1">
			<Label>Locations</Label>
			<div className="space-y-5">
				<div className="space-y-3">
					{fields.map((field, index) => {
						return (
							<div
								key={field.key}
								className="border px-3 py-6 rounded-md relative flex flex-col gap-y-6"
							>
								<div>
									<SearchField
										type="Area"
										label="Area"
										control={control}
										name={`locations.${index}.area`}
										query={api.area.getAllQuick}
										prefetch
									/>
								</div>
								<div>
									<CoordinatesField index={index} />
								</div>

								<Button
									size="icon"
									variant="ghost"
									onClick={() => remove(index)}
									type="button"
									className="absolute right-1 top-1"
								>
									<Trash2 className="size-4" />
								</Button>
							</div>
						);
					})}
				</div>

				<Button
					type="button"
					onClick={() => append({} as FormValues["locations"][number])}
				>
					Add Location
				</Button>
			</div>
		</div>
	);
}
