"use client";
import type { Item, Loot } from "@prisma/client";
import Link from "next/link";
import { PriceDisplay } from "~/components/PriceDisplay";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/utils/styles";
import { ItemSprite } from "../../../components/ItemSprite";

type Drop = Loot & {
	item: Pick<Item, "name" | "spriteUrl" | "slug" | "sellPrice">;
};

export function DropsList({
	drops,
	className,
	infoInToolTip = false,
	size = "md",
}: {
	drops: Drop[];
	className?: string;
	infoInToolTip?: boolean;
	size?: "md" | "sm";
}) {
	const getItemInfo = (
		dropRate: number | null | undefined,
		sellPrice: number | null,
	) => (
		<div className="max-w-24 text-sm flex items-center justify-between space-x-1.5">
			<div>
				<PriceDisplay size="xs" count={sellPrice} />
			</div>
			<div>
				{dropRate ?? "?"}
				{"%"}
			</div>
		</div>
	);

	return (
		<div
			className={cn(
				"flex flex-wrap items-center",
				size === "md" ? "gap-4" : "gap-3",
				className,
			)}
		>
			{drops.map((d) => (
				<div key={d.itemId}>
					<TooltipProvider>
						<Tooltip delayDuration={0}>
							<TooltipTrigger className="block">
								<Link prefetch={false} href={`/items/${d.item.slug}`}>
									<ItemSprite
										bg
										url={d.item.spriteUrl}
										name={d.item.name}
										size={size}
									/>
								</Link>
							</TooltipTrigger>
							<TooltipContent className="min-w-32 space-y-1" side="bottom">
								<p className="text-sm font-semibold">{d.item.name}</p>
								<div className="max-w-32">
									<div className="flex justify-between">
										<p>Drop Rate</p>
										<div>
											{d.dropRate ?? "?"}
											<span className="pl-0.5">%</span>
										</div>
									</div>
									<div className="flex justify-between">
										<p>Sell Price</p>
										<PriceDisplay size="xs" count={d.item.sellPrice} />
									</div>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					{!infoInToolTip ? getItemInfo(d.dropRate, d.item.sellPrice) : null}
				</div>
			))}
		</div>
	);
}
