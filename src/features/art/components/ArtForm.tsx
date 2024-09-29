"use client";

import { Jimp } from "jimp";
import { useState } from "react";
import { getSpriteTypeFromImageSize } from "~/utils/fo-sprite";

type Props = {
	id?: number;
};

export function ArtForm(props: Props) {
	const [file, setFile] = useState<File | undefined>();

	const [src, setSrc] = useState<string | undefined>();

	const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) {
			return;
		}

		const reader = new FileReader();

		reader.onload = async (e) => {
			const data = e.target?.result;
			if (!data || !(data instanceof ArrayBuffer)) {
				return;
			}
			const image = await Jimp.fromBuffer(data);
			image.greyscale();

			const type = getSpriteTypeFromImageSize(image);

			setSrc(await image.getBase64("image/png"));
		};

		reader.readAsArrayBuffer(file);
	};

	// const src = file && URL.createObjectURL(file);

	return (
		<div>
			ArtForm
			<div>
				<input type="file" onChange={onFileChange} accept="image/*" />

				<div>{src && <img src={src} alt="" />}</div>
			</div>
		</div>
	);
}
