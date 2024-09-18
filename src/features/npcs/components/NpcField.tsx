"use client";
import { type FieldMetadata, useInputControl } from "@conform-to/react";
import type { Npc } from "@prisma/client";
import { Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { Sprite } from "~/components/Sprite";
import { ControlledHiddenField } from "~/components/form-ui/ControlledHiddenField";
import { Button } from "~/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandInput,
	CommandItem,
	CommandList,
} from "~/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "~/components/ui/popover";
import { cn } from "~/utils/styles";

export function NpcField({
	npcs,
	field,
	className,
}: {
	npcs: Pick<Npc, "id" | "name" | "spriteUrl">[];
	field: FieldMetadata<string>;
	className?: string;
}) {
	const control = useInputControl(field);
	const [open, setOpen] = useState(false);

	const [selectedItem, setSelectedItem] = useState(
		npcs.find((npc) => npc.id === field.value),
	);

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					role="combobox"
					aria-expanded={open}
					className={cn("justify-between", className)}
				>
					<div className="flex items-center gap-x-3">
						{!!selectedItem && (
							<Sprite type="MOB" url={selectedItem.spriteUrl} size="xs" />
						)}
						{selectedItem?.name ?? "Select npc..."}
					</div>
					<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
				</Button>
			</PopoverTrigger>
			<PopoverContent
				align="start"
				className="w-[--radix-popover-trigger-width] p-0"
			>
				<Command>
					<CommandInput placeholder="Search items..." />
					<CommandList className="max-h-48 overflow-auto">
						<CommandEmpty>No items found.</CommandEmpty>

						{npcs.map((npc) => (
							<CommandItem
								key={npc.id}
								value={npc.name}
								onSelect={() => {
									setSelectedItem(npc);
									control.change(npc.id);
									setOpen(false);
								}}
							>
								<Check
									className={cn(
										"mr-2 h-4 w-4",
										field.value === npc.id ? "opacity-100" : "opacity-0",
									)}
								/>
								<div className="flex items-center gap-x-4">
									<Sprite
										type="NPC"
										url={npc.spriteUrl}
										size="xs"
										className="-mt-3 -mb-1"
									/>
									<div className="text-md">{npc.name}</div>
								</div>
							</CommandItem>
						))}
					</CommandList>
				</Command>
			</PopoverContent>
			<ControlledHiddenField field={field} value={control.value} />
		</Popover>
	);
}
