"use client";
import Link from "next/link";
import { MobSprite } from "~/components/MobSprite";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import type { Datum } from "./ItemTable";

export function DroppedByList({ mobs }: { mobs: Datum["droppedBy"] }) {
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
									href={`/mobs/${d.mob.slug}`}
								>
									<MobSprite
										url={d.mob.spriteUrl}
										name={d.mob.name}
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
