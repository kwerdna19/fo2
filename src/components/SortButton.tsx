import type { Column } from "@tanstack/react-table";
import type { ReactNode } from "react";
import { TbArrowDown as ArrowDown, TbArrowUp as ArrowUp } from "react-icons/tb";
import { Button } from "./ui/button";

export default function SortButton<T>({
	children,
	column,
}: { children: ReactNode; column: Column<T> }) {
	const sort = column.getIsSorted();
	return (
		<Button variant="ghost" onClick={() => column.toggleSorting()}>
			{children}
			{sort ? (
				sort === "asc" ? (
					<ArrowUp className="ml-2 h-4 w-4" />
				) : (
					<ArrowDown className="ml-2 h-4 w-4" />
				)
			) : null}
		</Button>
	);
}

export function getSortButton<T>(label: string) {
	return function SortButtonWithLabel({ column }: { column: Column<T> }) {
		return <SortButton column={column}>{label}</SortButton>;
	};
}
