"use client";

import { useEffect, useState } from "react";
import { cn } from "~/utils/styles";

const variants = {
	size: {
		xs: 1,
		sm: 2,
		md: 3,
		lg: 4,
		xl: 6,
		"2xl": 8,
		"3xl": 10,
		"4xl": 12,
	},
};

interface Variant {
	size?: keyof (typeof variants)["size"];
}

const spriteRows = 4;
const spriteCols = 3;
const rowCycles = 3;
const colSequence = [0, 1, 2, 1];
const dur = 333;

export const spriteSheetWidth = 96;
export const spriteSheetHeight = 192;

export const spriteWidth = spriteSheetWidth / spriteCols;
export const spriteHeight = spriteSheetHeight / spriteRows;

const defaultSprite = [2, 1] as const;

// export const getSpriteCoordinates = (r: number, c: number, mult = 1) => {
//   const imgWidth = mult*spriteSheetWidth
//   const imgHeight = mult*spriteSheetHeight

//   const y = (r/spriteRows)*imgHeight
//   const x = (c/spriteCols)*imgWidth

//   return { x, y }

// }

export interface MobSpriteProps extends Variant {
	url: string;
	name: string;
	className?: string;
	animated?: boolean;
}

export const MobSprite = ({
	url,
	name,
	className,
	animated = false,
	size = "xs",
}: MobSpriteProps) => {
	const mult = variants.size[size];

	const imgWidth = mult * spriteSheetWidth;
	const imgHeight = mult * spriteSheetHeight;

	// (2,1) is default non-animated sprite slot
	const [row, setRow] = useState<number>(defaultSprite[0]);
	const [colIndex, setColIndex] = useState<number>(defaultSprite[1]);
	const col = colSequence[colIndex]!;

	useEffect(() => {
		if (!animated) {
			return;
		}

		const intervalCol = setInterval(() => {
			setColIndex((oldIndex) => {
				if (oldIndex + 1 < colSequence.length) {
					return oldIndex + 1;
				}
				return 0;
			});
		}, dur);

		const intervalRow = setInterval(
			() => {
				setRow((oldIndex) => {
					if (oldIndex + 1 < spriteRows) {
						return oldIndex + 1;
					}
					return 0;
				});
			},
			dur * spriteCols * rowCycles,
		);

		return () => {
			clearInterval(intervalCol);
			clearInterval(intervalRow);
		};
	}, [setRow, setColIndex, animated]);

	const height = spriteHeight * mult;
	const width = spriteWidth * mult;

	const top = -row * height;
	const left = -col * width;

	return (
		<div
			className={cn(
				className,
				"relative overflow-hidden box-content pixelated",
			)}
			style={{ height, width }}
		>
			{/* eslint-disable-next-line @next/next/no-img-element */}
			<img
				className={cn("block absolute max-w-none")}
				style={{
					top,
					left,
					height: imgHeight,
					width: imgWidth,
				}}
				src={url}
				alt={name + " sprite"}
			/>
		</div>
	);
};
