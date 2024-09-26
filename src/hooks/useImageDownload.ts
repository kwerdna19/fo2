"use client";

import { useMutation } from "@tanstack/react-query";
import { Jimp, ResizeStrategy } from "jimp";

export function useImageDownload() {
	return useMutation({
		mutationFn: async (input: {
			data: { spriteName: string };
			url: string;
			type?: string;
			size: number;
		}) => {
			const {
				size,
				url,
				data: { spriteName },
				type,
			} = input;
			const fileName = `${spriteName}${type ? `-${type}` : ""}${size !== 1 ? `-${size}x` : ""}.png`;

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
}
