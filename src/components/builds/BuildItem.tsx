// "use client";
// import type { Item } from "@prisma/client";
// import { useState } from "react";
// import {
// 	Command,
// 	CommandEmpty,
// 	CommandInput,
// 	CommandItem,
// 	CommandList,
// } from "~/components/ui/command";
// import {
// 	Popover,
// 	PopoverContent,
// 	PopoverTrigger,
// } from "~/components/ui/popover";
// import { type Slot, slotBackgroundSpriteMap } from "~/utils/fo-game";
// import { cn } from "~/utils/styles";
// import { IconSprite } from "../IconSprite";
// import { Button } from "../ui/button";

// export function BuildItem({
// 	item,
// 	tooltipSide,
// 	slot,
// 	options,
// 	updateItem,
// }: {
// 	item?: Item | null | undefined;
// 	slot: Slot;
// 	tooltipSide: "left" | "right";
// 	options: Item[];
// 	updateItem: (newItem: string | null | undefined) => void;
// }) {
// 	const [open, setOpen] = useState(false);

// 	return (
// 		<div
// 			className={cn(
// 				"flex gap-x-3 items-center",
// 				tooltipSide === "left" ? "flex-row-reverse" : "",
// 			)}
// 		>
// 			<Popover open={open} onOpenChange={setOpen}>
// 				{/* <TooltipProvider>
//         <Tooltip delayDuration={0}>
//           <TooltipTrigger>
//             {trigger}
//           </TooltipTrigger>
//           <TooltipContent side={tooltipSide} sideOffset={10} className="min-w-[8rem] max-w-[12rem]">
//             {tooltip}
//           </TooltipContent>
//         </Tooltip>
//       </TooltipProvider> */}
// 				<PopoverTrigger asChild>
// 					<Button
// 						size="icon"
// 						variant="ghost"
// 						className="w-[70px] h-[70px]"
// 						disabled={options.length === 0}
// 					>
// 						<IconSprite
// 							bg
// 							url={item ? item.spriteName : slotBackgroundSpriteMap[slot]}
// 							size="md"
// 						/>
// 					</Button>
// 				</PopoverTrigger>
// 				<PopoverContent className="w-[250px] p-0 overflow-y-auto">
// 					<Command>
// 						<CommandInput placeholder="Search item..." />
// 						<CommandList className="max-h-[144px]">
// 							<CommandEmpty>No items found</CommandEmpty>
// 							{options.map((itemOption) => (
// 								<CommandItem
// 									key={itemOption.id}
// 									onSelect={() => {
// 										if (item?.id === itemOption.id) {
// 											updateItem(null);
// 										} else {
// 											updateItem(itemOption.id);
// 										}
// 										setOpen(false);
// 									}}
// 									className={cn(
// 										"gap-x-2",
// 										item?.id === itemOption.id && "font-bold",
// 									)}
// 								>
// 									<IconSprite url={itemOption.spriteName} size="xs" bg />
// 									{itemOption.name}
// 								</CommandItem>
// 							))}
// 						</CommandList>
// 					</Command>
// 				</PopoverContent>
// 			</Popover>
// 			{/* {item ? <Button size="icon" variant="destructive" className="h-7 w-7" onClick={() => updateItem(null)}>
//       <XIcon className="h-4 w-4" />
//     </Button> : null} */}
// 		</div>
// 	);
// }
