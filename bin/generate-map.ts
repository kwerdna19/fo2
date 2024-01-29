import { execFileSync } from "child_process";
import { join } from "path";
import { writeFile } from "fs/promises";
import { z } from "zod";

export interface Map {
	compressionlevel: number;
	height: number;
	infinite: boolean;
	layers: Layer[];
	nextlayerid: number;
	nextobjectid: number;
	orientation: string;
	renderorder: string;
	tiledversion: string;
	tileheight: number;
	tilesets: Tileset[];
	tilewidth: number;
	type: string;
	version: string;
	width: number;
}

export interface Layer {
	compression: string;
	data: string;
	encoding: string;
	height: number;
	id: number;
	name: string;
	opacity: number;
	type: string;
	visible: boolean;
	width: number;
	x: number;
	y: number;
}

export interface Tileset {
	columns: number;
	firstgid: number;
	image: string;
	imageheight: number;
	imagewidth: number;
	margin: number;
	name: string;
	spacing: number;
	tilecount: number;
	tileheight: number;
	tilewidth: number;
}

const tmpDir = "./bin/tmp";

const baseURL = "https://dev.fantasyonline2.com";

const main = async () => {
	const tmxPath = process.env.TMX_PATH;
	if (!tmxPath) {
		throw new Error("No TMX path specified");
	}

	const name = z.string().parse(process.argv[2]);

	const response = await fetch(`${baseURL}/tiled/maps/${name}.json`);
	if (!response.ok) {
		throw new Error("Map json request error");
	}
	const map = (await response.json()) as Map;

	if (map.tilesets.length !== 1) {
		console.error("Map has more or less than 1 tilesets");
		throw new Error("Invalid map response");
	}

	const imageFileName = `${name}-mastersheet.png`;
	if (map.tilesets[0]) {
		map.tilesets[0].image = `./${imageFileName}`;
	}

	const mapDataFilePath = join(tmpDir, `${name}.json`);
	const outputPath = `./public/maps/${name}.png`;

	await writeFile(mapDataFilePath, JSON.stringify(map, null, 2));
	const imageResponse = await fetch(`${baseURL}/tiled/maps/${imageFileName}`);

	const image = await imageResponse.arrayBuffer();

	await writeFile(join(tmpDir, imageFileName), Buffer.from(image));

	execFileSync(tmxPath, [mapDataFilePath, outputPath]);

	console.log(`Done. Generated ${name}.png`);
};

void main();
