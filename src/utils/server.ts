import fs from "fs";
import path from "path";

export const getListOfImages = (spriteType: string) => {
	const dir = path.resolve("./public", "sprites", spriteType);
	if (!fs.existsSync(dir)) {
		return null;
	}
	const filenames = fs.readdirSync(dir);
	const images = filenames.map((f) =>
		path.join("/", "sprites", spriteType, f).replace(/\\/g, "/"),
	);
	return images;
};
