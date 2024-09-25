import { execFileSync } from "child_process";
import { join, resolve } from "path";
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
	source?: string;
}

const tmpDir = "./bin/tmp";

const baseURL = "https://game.fantasyonline2.com";

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

	const mapDataFilePath = resolve(tmpDir, `${name}.json`);

	const mapTileSetDataFilePath = resolve(tmpDir, `${name}-tileset.json`);

	const outputPath = `./public/maps/${name}.png`;
	const imageFileName = `${name}-mastersheet.png`;

	let hadTileset = false;
	try {
		const response2 = await fetch(`${baseURL}/tiled/tilesets/${name}.json`);
		if (!response2.ok) {
			throw new Error("tileset json request error");
		}
		const tileset = await response2.json();
		tileset.image = `./${imageFileName}`;
		hadTileset = true;
		await writeFile(mapTileSetDataFilePath, JSON.stringify(tileset, null, 2));
	} catch (e) {}

	if (map.tilesets[0]) {
		if (hadTileset) {
			map.tilesets[0].source = `./${name}-tileset.json`;
		} else {
			map.tilesets[0].image = `./${imageFileName}`;
		}
	}

	await writeFile(mapDataFilePath, JSON.stringify(map, null, 2));
	const imageResponse = await fetch(`${baseURL}/tiled/maps/${imageFileName}`);

	const image = await imageResponse.arrayBuffer();

	await writeFile(join(tmpDir, imageFileName), Buffer.from(image));

	execFileSync(tmxPath, [resolve("./", mapDataFilePath), outputPath]);

	console.log(`Done. Generated ${name}.png`);
};

void main();
