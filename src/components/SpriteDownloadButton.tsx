"use client";

import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useImageDownload } from "~/hooks/useImageDownload";
import {
	type PartialItem,
	getItemSpriteUrlPreview,
	getPlayerSpriteUrlPreview,
	spriteSizeMap,
} from "~/utils/fo-sprite";
import { Sprite } from "./Sprite";
import { Button } from "./ui/button";

export interface SpriteProps {
	item: PartialItem;
}

export const SpriteDownloadButton = ({ item }: SpriteProps) => {
	const [sizeIndex, setSizeIndex] = useState(0);

	const spriteSizes = Object.values(spriteSizeMap);
	const size = spriteSizes[sizeIndex] as number;

	const { mutate } = useImageDownload();

	const onDownload = (url: string, type: string) => () => {
		if (!item) {
			return;
		}
		mutate({ data: item, url, type, size });
	};

	return (
		<div className="flex items-center gap-x-2">
			<DropdownMenu>
				<Button
					size="icon"
					variant="outline"
					onClick={() =>
						setSizeIndex((old) =>
							old - 1 >= 0 ? old - 1 : spriteSizes.length - 1,
						)
					}
				>
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<DropdownMenuTrigger asChild>
					<Button variant="outline" className="flex-1 relative pr-8">
						{`Download (${size === 1 ? "Original" : `${size}x`})`}
						<ChevronDown className="size-4 text-muted-foreground absolute right-3" />
					</Button>
				</DropdownMenuTrigger>
				<Button
					size="icon"
					variant="outline"
					onClick={() =>
						setSizeIndex((old) => (old + 1 < spriteSizes.length ? old + 1 : 0))
					}
				>
					<ChevronRight className="h-4 w-4" />
				</Button>
				<DropdownMenuContent className="w-[var(--radix-dropdown-menu-trigger-width)]">
					<DropdownMenuLabel>Sprite Sheet</DropdownMenuLabel>
					<DropdownMenuSeparator />
					{item ? (
						<DropdownMenuItem
							onSelect={onDownload(getPlayerSpriteUrlPreview(item), "player")}
						>
							With Player
						</DropdownMenuItem>
					) : null}
					{item ? (
						<DropdownMenuItem
							onSelect={onDownload(getItemSpriteUrlPreview(item), "item")}
						>
							Item Only
						</DropdownMenuItem>
					) : null}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
};

export const SpritePreview = ({ item }: SpriteProps) => {
	return (
		<Sprite
			type="PLAYER"
			animated
			size="xl"
			url={getPlayerSpriteUrlPreview(item)}
		/>
	);
};
