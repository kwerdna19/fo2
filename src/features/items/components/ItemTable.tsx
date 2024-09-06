"use client";

import { createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { useQueryStates } from "nuqs";
import { ItemSprite } from "~/components/ItemSprite";
import { PriceDisplay } from "~/components/PriceDisplay";
import SortButton from "~/components/SortButton";

import { keepPreviousData } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { Check } from "lucide-react";
import { DataTable } from "~/components/data-table/data-table";
import { dataTableSearchParams } from "~/components/data-table/data-table-utils";
import { useDataTableQueryParams } from "~/components/data-table/use-data-table-query";
import RangeField from "~/components/form/RangeField";
import { Form, SubmitButton, useZodForm } from "~/components/form/zod-form";
import { Button } from "~/components/ui/button";
import { Command, CommandItem } from "~/components/ui/command";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";
import { DmgRange } from "~/features/mobs/components/DmgRange";
import { type RouterInputs, type RouterOutputs, api } from "~/trpc/react";
import { itemTypeMap } from "~/utils/fo-data/service";
import {
	LEVEL_CAP,
	MAX_LEVEL,
	isItemConsumable,
	isItemTwoHanded,
} from "~/utils/fo-game";
import { shallowCompare } from "~/utils/misc";
import { cn } from "~/utils/styles";
import {
	itemSearchFilterSchema,
	itemSearchParamParser,
} from "../search-params";
import { CraftedByList } from "./CraftedByList";
import { DroppedByList } from "./DroppedByList";
import { ItemList } from "./ItemList";
import { ItemStats } from "./ItemStats";
import ItemSubType from "./ItemSubType";
import ItemType from "./ItemType";
import { SoldByList } from "./SoldByList";

type AllItemsResponse = RouterOutputs["item"]["getAllPopulated"];
type AllItemsInput = RouterInputs["item"]["getAllPopulated"];

export type Datum = AllItemsResponse["data"][number];
const columnHelper = createColumnHelper<Datum>();

// const getNameFromEquip = (equip: EquippableType) => {
// 	return equip
// 		.replace(/_/g, " ")
// 		.replace("COSMETIC", "OUTFIT")
// 		.toLocaleLowerCase();
// };

// const equipTypeOptions = Object.values(EquippableType).map((type) => ({
// 	value: type,
// 	name: getNameFromEquip(type),
// }));

export const columns = [
	columnHelper.display({
		id: "sprite",
		header: () => null,
		cell: ({ row }) => (
			<Link
				className="flex justify-center items-center h-[64px]"
				prefetch={false}
				href={`/items/${row.original.slug}`}
			>
				<ItemSprite
					url={row.original.spriteName}
					name={row.original.name}
					size="sm"
					bg
				/>
			</Link>
		),
	}),
	columnHelper.accessor("name", {
		cell: (info) => (
			<Link prefetch={false} href={`/items/${info.row.original.slug}`}>
				{info.getValue()}
			</Link>
		),
		header: SortButton,
		meta: {
			sortFieldReplacement: "slug",
		},
	}),
	columnHelper.accessor("desc", {}),
	columnHelper.accessor("slug", {
		header: SortButton,
		meta: {
			hidden: true,
		},
	}),
	columnHelper.accessor("type", {
		cell: (info) => {
			return <ItemType type={info.getValue()} />;
		},
	}),
	columnHelper.accessor("subType", {
		header: "Subtype",
		cell: (info) => {
			return (
				<ItemSubType type={info.row.original.type} subType={info.getValue()} />
			);
		},
	}),
	columnHelper.accessor("levelReq", {
		header: SortButton,
		meta: {
			heading: "Level",
		},
	}),
	columnHelper.accessor("sta", {
		header: SortButton,
		meta: {
			heading: "STA",
		},
	}),
	columnHelper.accessor("str", {
		header: SortButton,
		meta: {
			heading: "STR",
		},
	}),
	columnHelper.accessor("int", {
		header: SortButton,
		meta: {
			heading: "INT",
		},
	}),
	columnHelper.accessor("agi", {
		header: SortButton,
		meta: {
			heading: "Req AGI",
		},
	}),

	columnHelper.accessor("reqSta", {
		header: SortButton,
		meta: {
			heading: "Req STA",
		},
	}),
	columnHelper.accessor("reqStr", {
		header: SortButton,
		meta: {
			heading: "Req STR",
		},
	}),
	columnHelper.accessor("reqInt", {
		header: SortButton,
		meta: {
			heading: "Req INT",
		},
	}),
	columnHelper.accessor("reqAgi", {
		header: SortButton,
		meta: {
			heading: "Req AGI",
		},
	}),
	columnHelper.accessor("armor", {
		header: SortButton,
	}),
	columnHelper.display({
		id: "stats",
		header: "Bonus Stats",
		cell: ({ row }) => <ItemStats stats={row.original} />,
	}),
	// columnHelper.display({
	// 	id: "req-stats",
	// 	header: "Req",
	// 	cell: ({ row }) => <ItemRequiredStats stats={row.original} />,
	// }),
	columnHelper.display({
		id: "damage",
		header: SortButton,
		cell: ({ row }) => (
			<DmgRange min={row.original.dmgMin} max={row.original.dmgMax} />
		),
		meta: {
			sortTypes: [
				{ id: "dmgMin", name: "Dmg Min" },
				{ id: "dmgMax", name: "Dmg Max" },
			],
		},
	}),
	columnHelper.accessor("atkSpeed", {
		header: SortButton,
		meta: {
			heading: "Atk Speed",
		},
	}),
	columnHelper.accessor("sellPrice", {
		header: "Sell Price",
		cell: (info) => <PriceDisplay size="xs" count={info.getValue()} />,
	}),
	columnHelper.display({
		id: "droppedBy",
		header: "Dropped By",
		cell: ({ row }) => <DroppedByList mobs={row.original.droppedBy} />,
	}),
	columnHelper.display({
		id: "soldBy",
		header: "Sold By",
		cell: ({ row }) => <SoldByList npcs={row.original.soldBy} />,
	}),
	columnHelper.display({
		id: "craftedBy",
		header: "Crafted By",
		cell: ({ row }) => <CraftedByList npcs={row.original.craftedBy} />,
	}),
	columnHelper.display({
		id: "boxContents",
		header: "Box Contents",
		cell: ({ row }) => (
			<ItemList
				data={row.original.boxItems}
				className="flex-nowrap"
				size="sm"
			/>
		),
	}),
	// columnHelper.display({
	// 	id: "usages",
	// 	header: "Crafts Into",
	// 	cell: ({ row }) => (
	// 		<ItemList data={row.original.usages} className="flex-nowrap" size="sm" />
	// 	),
	// }),
	columnHelper.accessor("globalLoot", {
		header: "Global Drop",
		cell: (info) =>
			info.getValue() ? (
				<div className="flex items-center justify-center">
					<Check className="size-5" />
				</div>
			) : null,
	}),
	columnHelper.accessor(isItemTwoHanded, {
		id: "twoHand",
		header: "2H",
		cell: (info) =>
			info.getValue() ? (
				<div className="flex items-center justify-center">
					<Check className="size-5" />
				</div>
			) : null,
	}),
	columnHelper.accessor(isItemConsumable, {
		id: "consumable",
		header: "Consume",
		cell: (info) =>
			info.getValue() ? (
				<div className="flex items-center justify-center">
					<Check className="size-5" />
				</div>
			) : null,
	}),
	columnHelper.accessor("stackSize", {
		header: SortButton,
		meta: {
			heading: "Stack Size",
		},
	}),
	columnHelper.accessor("artist", {
		header: SortButton,
	}),
	// @TODO crafts INTO column
	// @TODO battle passes column
	// @TODO skills column
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
] as ColumnDef<Datum, any>[];

function ItemSearchFilters() {
	const { resetPage } = useDataTableQueryParams();
	const [filters, setFilters] = useQueryStates(itemSearchParamParser);

	const form = useZodForm({
		schema: itemSearchFilterSchema,
		values: filters,
	});

	// change single select into 2 separate selects

	const selectedType = form.watch("type");

	console.log({ filters });

	const subTypeOptions =
		typeof selectedType === "number" && itemTypeMap[selectedType]?.subTypes
			? Object.entries(itemTypeMap[selectedType].subTypes)
			: null;

	const subTypePlaceholder = !subTypeOptions ? "Select subtype" : "No subtypes";

	return (
		<Form
			handleSubmit={(values) => {
				resetPage();
				setFilters(values);
			}}
			persist
			form={form}
			className="flex-1 flex h-full flex-col gap-y-8"
		>
			<RangeField
				label="Level Req"
				control={form.control}
				nameMax="maxLevel"
				nameMin="minLevel"
				maxValue={MAX_LEVEL}
			/>

			<div className="space-y-3">
				<FormField
					control={form.control}
					name="type"
					render={({ field }) => {
						console.log("type field render value", field.value);

						return (
							<FormItem>
								<FormLabel>Item Type</FormLabel>
								<FormControl>
									<Select
										onValueChange={(e) => {
											field.onChange(Number(e));
											form.setValue("subType", null);
										}}
										value={field.value?.toString() ?? ""}
										// key={typeof selectedType === "number" ? "1" : "0"}
									>
										<SelectTrigger
											className={
												typeof selectedType === "number" ? "capitalize" : ""
											}
										>
											<SelectValue placeholder="Filter by type" />
										</SelectTrigger>
										<SelectContent className="capitalize">
											{Object.entries(itemTypeMap).map(([id, type]) => {
												return (
													<SelectItem key={id} value={id}>
														{type.type.toLocaleLowerCase()}
													</SelectItem>
												);
											})}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>

				<FormField
					control={form.control}
					name="subType"
					render={({ field }) => (
						<FormItem>
							{/* <FormLabel>Subtype</FormLabel> */}
							<FormControl>
								<Select
									onValueChange={(e) => field.onChange(Number(e))}
									value={field.value?.toString()}
									disabled={!subTypeOptions}
								>
									<SelectTrigger className={subTypeOptions ? "capitalize" : ""}>
										<SelectValue placeholder={subTypePlaceholder} />
									</SelectTrigger>
									<SelectContent className="capitalize">
										{subTypeOptions?.map(([id, type]) => {
											return (
												<SelectItem key={id} value={id}>
													{type.replace(/_/g, " ").toLocaleLowerCase()}
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			{/* <Controller
				control={form.control}
				name="equipTypes"
				render={({ field }) => (
					<div className="space-y-3">
						<Label>Equip Slot</Label>
						<ScrollArea className="h-40 rounded-lg border shadow-sm">
							<Command>
								<CommandList>
									{equipTypeOptions.map(({ name, value }) => (
										<CommandItem
											key={value}
											value={value}
											className="capitalize"
											onSelect={(c) => {
												const oldVal = field.value;
												if (oldVal?.includes(c as EquippableType)) {
													field.onChange(oldVal.filter((o) => o !== c));
												} else {
													field.onChange([...(oldVal ?? []), c]);
												}
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													field.value?.includes(value)
														? "opacity-100"
														: "opacity-0",
												)}
											/>
											{name}
										</CommandItem>
									))}
								</CommandList>
							</Command>
						</ScrollArea>
					</div>
				)}
			/> */}

			<div className="p-3 border border-dashed">More filters to be added</div>

			<div className="pt-8 flex justify-end items-end gap-4 flex-1">
				<Button
					type="button"
					size="sm"
					variant="ghost"
					onClick={() =>
						setFilters((prev) =>
							Object.keys(prev).reduce(
								(acc, key) => {
									acc[key] = null;
									return acc;
								},
								{} as Record<string, unknown>,
							),
						)
					}
				>
					Clear
				</Button>
				<SubmitButton size="sm">Apply</SubmitButton>
			</div>
		</Form>
	);
}

export function ItemTable({
	initialData,
	initialParams,
}: { initialData: AllItemsResponse; initialParams: AllItemsInput }) {
	const [tableParams] = useQueryStates(dataTableSearchParams);
	const [filters] = useQueryStates(itemSearchParamParser);
	const params = { ...filters, ...tableParams };

	const { data } = api.item.getAllPopulated.useQuery(params, {
		initialData: shallowCompare(params, initialParams)
			? initialData
			: undefined,
		placeholderData: keepPreviousData,
	});

	return (
		<DataTable
			title="Items"
			data={data ?? { data: [], totalCount: 0 }}
			columns={columns}
			filtersComponent={<ItemSearchFilters />}
			defaultColumnVisibility={{
				agi: false,
				int: false,
				sta: false,
				str: false,
				reqStr: false,
				reqInt: false,
				reqSta: false,
				reqAgi: false,
				damage: false,
				atkSpeed: false,
				desc: false,
				soldBy: false,
				craftedBy: false,
				twoHand: false,
				consumable: false,
				globalLoot: false,
				stackSize: false,
				artist: false,
				boxContents: false,
			}}
		/>
	);
}
