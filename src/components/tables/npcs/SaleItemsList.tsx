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
import { ItemSprite } from "../../ItemSprite";
import { DurationDisplay } from "./DurationDisplay";
import { type Datum } from "./NpcTable";

type Items = Datum["items"] | Datum["crafts"];

export function SaleItemsList({
	items,
	className,
	infoInToolTip = false,
	size = "md",
}: {
	items: Items;
	className?: string;
	infoInToolTip?: boolean;
	size?: "md" | "sm";
}) {
	const getItemInfo = (d: Items[number]) => {
		const salePrice = d.price;
		const unit = d.unit;

		const duration = "durationMinutes" in d ? d.durationMinutes : null;

		if (!salePrice && duration === null) {
			return null;
		}

		return (
			<div className="text-sm pt-1 px-1 flex items-center justify-between space-x-1">
				{salePrice ? (
					<PriceDisplay size="xs" count={salePrice} unit={unit} />
				) : null}
				{duration !== null ? <DurationDisplay mins={duration} /> : null}
			</div>
		);
	};

	return (
		<div
			className={cn(
				"flex flex-wrap items-center",
				size === "md" ? "gap-4" : "gap-2",
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
										url={d.item.spriteUrl}
										name={d.item.name}
										size={size}
									/>
								</Link>
							</TooltipTrigger>
							<TooltipContent side="bottom">
								<div>{d.item.name}</div>
								{infoInToolTip ? getItemInfo(d) : null}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
					{!infoInToolTip ? getItemInfo(d) : null}
				</div>
			))}
		</div>
	);
}
