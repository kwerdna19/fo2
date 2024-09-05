"use client";
import Link from "next/link";
import { PriceDisplay } from "~/components/PriceDisplay";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/utils/styles";

import { DurationDisplay } from "~/components/DurationDisplay";
import { ItemSprite } from "~/components/ItemSprite";
import type { Datum } from "./NpcTable";

export function SaleItemsList({
	items,
	className,
	size = "sm",
}: {
	items: Datum["items"];
	className?: string;
	size?: "md" | "sm";
}) {
	return (
		<div
			className={cn(
				"flex flex-wrap items-center",
				size === "md" ? "gap-4" : "gap-3",
				className,
			)}
		>
			{items.map((d) => (
				<div key={d.itemId}>
					<TooltipProvider>
						<Tooltip delayDuration={0}>
							<TooltipTrigger className="block">
								<Link prefetch={false} href={`/items/${d.item.slug}`}>
									<ItemSprite
										bg
										url={d.item.spriteName}
										name={d.item.name}
										size={size}
									/>
								</Link>
							</TooltipTrigger>
							<TooltipContent className="min-w-32 space-y-1" side="bottom">
								<p className="text-sm font-semibold">{d.item.name}</p>
								<div className="max-w-32">
									<p className="flex justify-between">
										<div>Buy Price</div>
										<PriceDisplay size="xs" unit={d.unit} count={d.price} />
									</p>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			))}
		</div>
	);
}

export function CraftItemsList({
	items,
	className,
	size = "sm",
}: {
	items: Datum["crafts"];
	className?: string;
	size?: "md" | "sm";
}) {
	return (
		<div
			className={cn(
				"flex flex-wrap items-center",
				size === "md" ? "gap-4" : "gap-3",
				className,
			)}
		>
			{items.map((d) => (
				<div key={d.itemId}>
					<TooltipProvider>
						<Tooltip delayDuration={0}>
							<TooltipTrigger className="block">
								<Link prefetch={false} href={`/items/${d.item.slug}`}>
									<ItemSprite
										bg
										url={d.item.spriteName}
										name={d.item.name}
										size={size}
									/>
								</Link>
							</TooltipTrigger>
							<TooltipContent className="min-w-32 space-y-1" side="bottom">
								<p className="text-sm font-semibold">{d.item.name}</p>
								<div className="max-w-32">
									<p className="flex justify-between">
										<div>Cost</div>
										<PriceDisplay size="xs" unit={d.unit} count={d.price} />
									</p>
									<p className="flex justify-between">
										<div>Duration</div>
										<DurationDisplay mins={d.durationMinutes} />
									</p>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			))}
		</div>
	);
}
