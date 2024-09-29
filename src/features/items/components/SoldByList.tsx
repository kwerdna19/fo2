"use client";
import Link from "next/link";
import { PriceDisplay } from "~/components/PriceDisplay";
import { Sprite } from "~/components/Sprite";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { getNameIdSlug } from "~/utils/misc";
import { cn } from "~/utils/styles";
import type { ItemDatum } from "./ItemTable";

export function SoldByList({
	item,
	className,
}: { item: ItemDatum; className?: string }) {
	return (
		<div className={cn("flex flex-wrap items-center", className)}>
			{item.soldBy.map((d) => (
				<div key={d.id}>
					<TooltipProvider>
						<Tooltip delayDuration={0}>
							<TooltipTrigger className="block pt-1">
								<Link
									className="flex justify-center items-center h-[64px] max-h-full overflow-hidden group-hover:overflow-visible"
									prefetch={false}
									href={`/npcs/${getNameIdSlug(d)}`}
								>
									<Sprite
										type="NPC"
										url={d.spriteName}
										size="sm"
										className="-mt-[36px]"
									/>
								</Link>
							</TooltipTrigger>
							<TooltipContent className="min-w-32 space-y-1" side="bottom">
								<p className="text-sm font-semibold">{d.name}</p>
								<div className="flex justify-between max-w-32">
									<p>Buy Price</p>
									<PriceDisplay
										count={item.buyPrice}
										unit={item.buyPriceUnit}
										size="xs"
									/>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			))}
		</div>
	);
}
