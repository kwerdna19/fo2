"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "~/components/ui/select";

export function SortSelect({
	sorts,
	filters,
	setFilters,
}: {
	sorts: { key: string; name: string }[];
	filters: { sort: string; sortDirection: "asc" | "desc" };
	setFilters: (ops: { sort?: string; sortDirection?: "asc" | "desc" }) => void;
}) {
	return (
		<div className="flex gap-4">
			<Select
				value={filters.sort}
				onValueChange={(sort) => setFilters({ sort })}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="Select sort" />
				</SelectTrigger>
				<SelectContent>
					{sorts.map((s) => (
						<SelectItem key={s.key} value={s.key}>
							{s.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Button
				size="icon"
				variant="outline"
				onClick={() =>
					setFilters({
						sortDirection: filters.sortDirection === "asc" ? "desc" : "asc",
					})
				}
			>
				{filters.sortDirection === "desc" ? (
					<ArrowDown className="h-5 w-5" />
				) : (
					<ArrowUp className="h-5 w-5" />
				)}
			</Button>
		</div>
	);
}
