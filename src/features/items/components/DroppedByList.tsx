"use client";
import Link from "next/link";
import { Sprite } from "~/components/Sprite";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { getNameIdSlug } from "~/utils/misc";
import type { ItemDatum } from "./ItemTable";

export function DroppedByList({ mobs }: { mobs: ItemDatum["droppedBy"] }) {
	return (
		<div className="flex items-center h-[64px]">
			{mobs.map((d) => (
				<div key={d.mobId}>
					<TooltipProvider>
						<Tooltip delayDuration={0}>
							<TooltipTrigger className="block pt-1">
								<Link
									className="flex justify-center items-center h-[64px] max-h-full overflow-hidden group-hover:overflow-visible"
									prefetch={false}
									href={`/mobs/${getNameIdSlug(d.mob)}`}
								>
									<Sprite
										type="MOB"
										url={d.mob.spriteName}
										size="sm"
										className="-mt-[12px]"
									/>
								</Link>
							</TooltipTrigger>
							<TooltipContent className="min-w-32 space-y-1" side="bottom">
								<p className="text-sm font-semibold">{d.mob.name}</p>
								<div className="flex justify-between max-w-32">
									<p>Drop Rate</p>
									<div>
										{d.dropRate ?? "?"}
										<span className="pl-0.5">%</span>
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
