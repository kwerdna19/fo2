// "use client";
// import type { Item } from "@prisma/client";
// import { ChevronDown, ChevronUp } from "lucide-react";
// import Link from "next/link";
// import { Slot, slotBackgroundSpriteMap } from "~/utils/fo-game";
// import { cn } from "~/utils/styles";
// import { ItemStats } from "../../features/items/components/ItemStats";
// import { IconSprite } from "../IconSprite";
// import { Button } from "../ui/button";
// import {
// 	Tooltip,
// 	TooltipContent,
// 	TooltipProvider,
// 	TooltipTrigger,
// } from "../ui/tooltip";

// export function PossibleBuildItem({
// 	item,
// 	tooltipSide,
// 	slot,
// 	stat,
// 	switchOptions,
// }: {
// 	item?: Item | null;
// 	slot: Slot;
// 	tooltipSide: "left" | "right";
// 	stat?: string;
// 	switchOptions?: (inc: 1 | -1) => void;
// }) {
// 	const trigger = item ? (
// 		<Link prefetch={false} href={`/items/${item.slug}`}>
// 			<IconSprite
// 				className="border-2 shadow-sm border-slate-200 bg-slate-50 rounded-sm"
// 				url={item.spriteName}
// 				size="md"
// 			/>
// 		</Link>
// 	) : (
// 		<div className="border-2 shadow-sm border-slate-300 bg-slate-200 flex items-center justify-center rounded-sm w-[70px] h-[70px]">
// 			<IconSprite url={slotBackgroundSpriteMap[slot]} size="sm" />
// 		</div>
// 	);

// 	const tooltip = item ? (
// 		<>
// 			<div className="mb-2 font-bold">{item.name}</div>
// 			<ItemStats stats={item} />
// 		</>
// 	) : (
// 		<div>
// 			You can use any item in the {Slot[slot].replace(/\_/g, " ")} slot
// 			{`${stat ? ` that does not affect ${stat.toUpperCase()}` : ""}`}.
// 		</div>
// 	);

// 	return (
// 		<div
// 			className={cn(
// 				"flex gap-x-2",
// 				tooltipSide === "left" ? "flex-row-reverse" : "",
// 			)}
// 		>
// 			<TooltipProvider>
// 				<Tooltip delayDuration={0}>
// 					<TooltipTrigger>{trigger}</TooltipTrigger>
// 					{
// 						<TooltipContent
// 							side={tooltipSide}
// 							sideOffset={10}
// 							className="min-w-[8rem] max-w-[12rem]"
// 						>
// 							{tooltip}
// 						</TooltipContent>
// 					}
// 				</Tooltip>
// 			</TooltipProvider>
// 			{switchOptions !== undefined ? (
// 				<div className="flex flex-col justify-between py-1">
// 					<Button
// 						size="icon"
// 						onClick={() => switchOptions(1)}
// 						className="h-7 w-7"
// 					>
// 						<ChevronUp className="h-5 w-5" />
// 					</Button>
// 					<Button
// 						size="icon"
// 						onClick={() => switchOptions(-1)}
// 						className="h-7 w-7"
// 					>
// 						<ChevronDown className="h-5 w-5" />
// 					</Button>
// 				</div>
// 			) : null}
// 		</div>
// 	);
// }
