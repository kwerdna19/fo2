"use client";

import { useMutation } from "@tanstack/react-query";
import { Jimp, ResizeStrategy } from "jimp";
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
import {
	type PartialItem,
	getItemSpriteUrlPreview,
	getPlayerSpriteUrlPreview,
	spriteSizeMap,
} from "~/utils/fo-sprite";
import { Button } from "./ui/button";

export interface SpriteProps {
	item?: PartialItem;
}

const spriteSizes = Object.values(spriteSizeMap);

export const SpriteDownloadButton = ({ item }: SpriteProps) => {
	const [sizeIndex, setSizeIndex] = useState(0);

	const size = spriteSizes[sizeIndex] as number;

	const { mutate } = useMutation({
		mutationFn: async (input: { url: string; fileName: string }) => {
			const { url, fileName } = input;

			const img = await Jimp.read(url);

			if (size > 1) {
				img.scale({
					f: size,
					mode: ResizeStrategy.NEAREST_NEIGHBOR,
				});
			}

			const buf = await img.getBuffer("image/png");
			const blob = new Blob([buf], { type: "image/png" });
			const objectUrl = URL.createObjectURL(blob);

			const link = document.createElement("a");
			link.href = objectUrl;
			link.download = fileName;
			link.click();
			link.remove();

			return objectUrl;
		},
		onSuccess: (url) => {
			URL.revokeObjectURL(url);
		},
	});

	const onDownload = (url: string, type: string) => () => {
		if (!item) {
			return;
		}
		const fileName = `${item.spriteName}-${type}${size !== 1 ? `-${size}x` : ""}.png`;
		mutate({ url, fileName });
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
