"use client";

import { useCallback, useState } from "react";
import { Button } from "~/components/ui/button";

import { CommandList, useCommandState } from "cmdk";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import type { DecoratedQuery } from "node_modules/@trpc/react-query/dist/createTRPCReact";
import { useDebounce } from "use-debounce";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/utils/styles";
import { Command, CommandInput, CommandItem } from "./ui/command";

export type ValueShape = { id: number; name: string };

export type SearchQuery<V> = DecoratedQuery<{
	// biome-ignore lint/suspicious/noConfusingVoidType: <explanation>
	input: string | undefined | void;
	output: Array<V>;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	errorShape: any;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	transformer: any;
}>;

type Props<V extends ValueShape> = {
	value: V | undefined;
	setValue: (v: V | undefined) => void;
	query: SearchQuery<V>;
	type: string;
	prefetch?: boolean;
};

function SearchResults<V extends ValueShape>({
	query,
	type,
	value,
	setValue,
	prefetch,
}: Props<V>) {
	const search = useCommandState((state) => state.search);
	const [debounced] = useDebounce(search, 500);

	const { data, isLoading, isError } = query.useQuery(
		prefetch ? undefined : debounced,
		{
			enabled: Boolean(debounced.length > 2 || prefetch),
		},
	);

	const isEmpty = !isError && !isLoading && data?.length === 0;

	return (
		<CommandList className={isEmpty || isLoading || data ? "border-t" : ""}>
			{isLoading && (
				<div className="p-4 text-sm flex items-center justify-center">
					<Loader2 className="size-4 animate-spin" />
				</div>
			)}
			{!isError && !isLoading && data?.length === 0 && (
				<div className="p-4 text-sm">No {type}s found</div>
			)}
			{isError && <div className="p-4 text-sm">Something went wrong</div>}
			{data?.map((d) => {
				return (
					<CommandItem key={d.id} onSelect={() => setValue(d)}>
						<Check
							className={cn(
								"mr-2 h-4 w-4",
								value?.id === d.id ? "opacity-100" : "opacity-0",
							)}
						/>
						{d.name}
					</CommandItem>
				);
			})}
		</CommandList>
	);
}

export type GenericSearchComboboxProps<V = ValueShape> = {
	value: V | undefined;
	onValueChange: (value: V | undefined) => void;
};

export type SearchComboboxProps<
	V extends ValueShape,
	Q extends SearchQuery<V>,
> = {
	type: string;
	query: Q;
	prefetch?: boolean;
} & GenericSearchComboboxProps<V>;

export function SearchCombobox<V extends ValueShape, Q extends SearchQuery<V>>({
	value,
	type,
	onValueChange,
	query,
	prefetch,
}: SearchComboboxProps<V, Q>) {
	const [open, setOpen] = useState(false);

	const onSelect = useCallback(
		(newValue: V | undefined) => {
			onValueChange(newValue);
			setOpen(false);
		},
		[onValueChange],
	);

	const display = value?.name ?? `Select ${type}`;

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					className="w-full justify-between h-9"
				>
					<div className="truncate">{display}</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>

			<PopoverContent
				side="bottom"
				className="p-0 w-[--radix-popover-trigger-width] border-0"
			>
				<Command shouldFilter={!!prefetch} className="h-auto border">
					<CommandInput
						placeholder={`Search for ${type}`}
						rootClassName="border-0"
					/>
					<SearchResults
						type={type}
						query={query}
						value={value}
						setValue={onSelect}
						prefetch={prefetch}
					/>
				</Command>
			</PopoverContent>
		</Popover>
	);
}
