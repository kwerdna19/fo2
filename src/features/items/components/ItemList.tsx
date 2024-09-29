"use client";
import type { Item, Unit } from "@prisma/client";
import { KeyRound } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { PriceDisplay } from "~/components/PriceDisplay";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "~/components/ui/tooltip";
import { getNameIdSlug } from "~/utils/misc";
import { cn } from "~/utils/styles";
import { IconSprite } from "../../../components/IconSprite";

type PartialItem = Pick<Item, "id" | "name" | "spriteName">;

type DisplayProperty = ReactNode | { value: number; unit: Unit };

type Props<K extends PartialItem | { item: PartialItem }> = {
	data: Array<K>;
	getAttributes?: (d: K) => Record<string, DisplayProperty>;
	className?: string;
	countProperty?: string;
	infoInToolTip?: boolean;
	size?: "md" | "sm";
};

export function ItemList<K extends PartialItem | { item: PartialItem }>({
	data,
	getAttributes,
	countProperty,
	className,
	size = "sm",
}: Props<K>) {
	const renderProperty = (value: DisplayProperty) => {
		return value && typeof value === "object" && "value" in value ? (
			<PriceDisplay size="xs" count={value.value} unit={value.unit} />
		) : (
			value
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
			{data.map((d) => {
				const item = ("item" in d ? d.item : d) as PartialItem;

				const properties =
					getAttributes &&
					Object.entries(getAttributes(d)).filter(([Key, val]) => val !== null);

				const count = countProperty
					? properties?.find(([key]) => key === countProperty)?.[1]
					: undefined;

				const propertyComp = properties?.map(([key, value]) => (
					<div key={key} className="flex justify-between">
						<p>{key}</p>
						<div>{renderProperty(value)}</div>
					</div>
				));

				return (
					<TooltipProvider key={item.id}>
						<Tooltip delayDuration={0}>
							<TooltipTrigger asChild>
								<Link
									className="min-w-max relative"
									prefetch={false}
									href={`/items/${getNameIdSlug(item)}`}
								>
									<IconSprite bg url={item.spriteName} size={size} />
									{count ? (
										<div className="absolute right-1 top-1 text-xs font-mono font-bold leading-none">
											{renderProperty(count)}
										</div>
									) : null}
								</Link>
							</TooltipTrigger>
							<TooltipContent className="min-w-36 space-y-1" side="bottom">
								<p className="text-sm font-semibold">{item.name}</p>
								{propertyComp ? (
									<div className="max-w-36 text-xs">{propertyComp}</div>
								) : null}
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				);
			})}
		</div>
	);
}
