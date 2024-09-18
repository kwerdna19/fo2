"use client";
import Link from "next/link";
import { DurationDisplay } from "~/components/DurationDisplay";
import { PriceDisplay } from "~/components/PriceDisplay";
import { Sprite } from "~/components/Sprite";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import type { ItemDatum } from "./ItemTable";

export function CraftedByList({ npcs }: { npcs: ItemDatum["craftedBy"] }) {
	return (
		<div className="flex items-center h-[64px]">
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
									<Sprite
										type="NPC"
										url={d.npc.spriteUrl}
										size="sm"
										className="-mt-[36px]"
									/>
								</Link>
							</TooltipTrigger>
							<TooltipContent className="min-w-32 space-y-1" side="bottom">
								<p className="text-sm font-semibold">{d.npc.name}</p>
								<div className="max-w-32">
									<div className="flex justify-between">
										<p>Cost</p>
										<PriceDisplay size="xs" unit={d.unit} count={d.price} />
									</div>
									<div className="flex justify-between">
										<p>Duration</p>
										<DurationDisplay mins={d.durationMinutes} />
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				</div>
			))}
		</div>
	);
}
