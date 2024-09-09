"use client";
import Link from "next/link";
import { MobSprite } from "~/components/MobSprite";
import { PriceDisplay } from "~/components/PriceDisplay";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/utils/styles";
import type { ItemDatum } from "./ItemTable";

export function SoldByList({
	npcs,
	className,
}: { npcs: ItemDatum["soldBy"]; className?: string }) {
	return (
		<div className={cn("flex flex-wrap items-center", className)}>
			{npcs.map((d) => (
				<div key={d.npcId}>
					<TooltipProvider>
						<Tooltip delayDuration={0}>
							<TooltipTrigger className="block pt-1">
								<Link
									className="flex justify-center items-center h-[64px] max-h-full overflow-hidden group-hover:overflow-visible"
									prefetch={false}
									href={`/npcs/${d.npc.slug}`}
								>
									<MobSprite
										url={d.npc.spriteUrl}
										name={d.npc.name}
										size="sm"
										className="-mt-[36px]"
									/>
								</Link>
							</TooltipTrigger>
							<TooltipContent className="min-w-32 space-y-1" side="bottom">
								<p className="text-sm font-semibold">{d.npc.name}</p>
								<div className="flex justify-between max-w-32">
									<p>Buy Price</p>
									<PriceDisplay count={d.price} size="xs" />
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			))}
		</div>
	);
}
