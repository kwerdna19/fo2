"use client";

import { useState } from "react";
import { Command, CommandInput, CommandList } from "~/components/ui/command";

export function DataTableSearchBar({
	search,
	setSearch,
	disabled,
}: { search: string; setSearch: (q: string) => void; disabled?: boolean }) {
	const [val, setValue] = useState(search);

	return (
		<div>
			<Command className="rounded-lg border" shouldFilter={false}>
				<CommandInput
					rootClassName="border-0"
					placeholder="Search by keyword..."
					value={val}
					onValueChange={setValue}
					disabled={disabled}
					onKeyDown={(e) => {
						if (e.key === "Enter") {
							e.preventDefault();
							setSearch((e.target as HTMLInputElement).value);
						}
					}}
				/>
				<CommandList>
					{/* <CommandEmpty>No results found.</CommandEmpty> */}
				</CommandList>
			</Command>
		</div>
	);
}
