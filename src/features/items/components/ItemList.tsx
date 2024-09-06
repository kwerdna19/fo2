"use client";
import type { Item, Unit } from "@prisma/client";
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

type PartialItem = Pick<Item, "id" | "name" | "spriteName" | "slug">;

type Props<K extends PartialItem | { item: PartialItem }> = {
	data: Array<K>;
	getAttributes?: (
		d: K,
	) => Record<string, string | number | null | { value: number; unit: Unit }>;
	className?: string;
	infoInToolTip?: boolean;
	size?: "md" | "sm";
};

export function ItemList<K extends PartialItem | { item: PartialItem }>({
	data,
	getAttributes,
	className,
	size = "md",
}: Props<K>) {
	return (
		<div
			className={cn(
				"flex flex-wrap items-center",
				size === "md" ? "gap-4" : "gap-3",
				className,
			)}
		>
			{data.map((d) => {
				const item = ("item" in d ? d.item : d) as PartialItem;

				const properties =
					getAttributes &&
					Object.entries(getAttributes(d)).map(([key, value]) => (
						<div key={key} className="flex justify-between">
							<p>{key}</p>
							<div>
								{value && typeof value === "object" ? (
									<PriceDisplay
										size="xs"
										count={value.value}
										unit={value.unit}
									/>
								) : (
									value
								)}
							</div>
						</div>
					));

				return (
					<div key={item.id}>
						<TooltipProvider>
							<Tooltip delayDuration={0}>
								<TooltipTrigger className="block">
									<Link prefetch={false} href={`/items/${item.slug}`}>
										<ItemSprite
											bg
											url={item.spriteName}
											name={item.name}
											size={size}
										/>
									</Link>
								</TooltipTrigger>
								<TooltipContent className="min-w-32 space-y-1" side="bottom">
									<p className="text-sm font-semibold">{item.name}</p>
									{properties && properties.length > 0 ? (
										<div className="max-w-32">{properties}</div>
									) : null}
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				);
			})}
		</div>
	);
}
