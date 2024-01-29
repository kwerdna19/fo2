import { type Column } from "@tanstack/react-table";
import { type ReactNode } from "react";
import { TbArrowDown as ArrowDown, TbArrowUp as ArrowUp } from "react-icons/tb";
import { Button } from "./ui/button";

export default function SortButton({
	children,
	column,
}: { children: ReactNode; column: Column<unknown> }) {
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

export const getSortButton = (label: string) =>
	function SortButtonWithLabel({ column }: { column: Column<unknown> }) {
		return <SortButton column={column}>{label}</SortButton>;
	};
