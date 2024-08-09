// import { createWriteStream, readdirSync, renameSync, rmSync } from "fs";
// import path, { basename } from "path";
// import { Readable } from "stream";
// import decompress from "decompress";
// import inquirer from "inquirer";

// const tmpDir = "./bin/tmp";

// const assetDir = "./public/sprites";

// const boardId = "OEmhSVFl";
// const apiKey = process.env.TRELLO_API_KEY;
// const apiToken = process.env.TRELLO_API_TOKEN;
// const tokenAccessUrl = `https://trello.com/1/authorize?expiration=never&name=Fo2AssetUtility&scope=read,write&response_type=token&key=${apiKey}`;

// const LIST_NAME = "Request DB Updates + Files";

// const saveFile = async (url: string, outputPath: string) => {
// 	const resp = await fetch(url.replace("//trello.com", "//api.trello.com"), {
// 		headers: {
// 			Authorization: `OAuth oauth_consumer_key="${apiKey}", oauth_token="${apiToken}"`,
// 		},
// 	});
// 	// console.log(`${url}?key=${apiKey}&token=${apiToken}`);

// 	if (!resp.ok || !resp.body) {
// 		console.log(resp.status, resp.statusText);
// 		throw new Error("file download error");
// 	}

// 	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
// 	const readableNodeStream = Readable.fromWeb(resp.body as any);
// 	const fileStream = createWriteStream(outputPath);

// 	return new Promise((resolve, reject) => {
// 		readableNodeStream.pipe(fileStream);
// 		readableNodeStream.on("error", reject);
// 		fileStream.on("finish", resolve);
// 	});
// };

// const assetFolders = readdirSync(assetDir).filter(
// 	(f) => !["unit", "item-bg", "misc-ui"].includes(f),
// );

// const main = async () => {
// 	if (!apiKey) {
// 		throw new Error("Missing TRELLO_API_KEY env variable");
// 	}
// 	if (!apiToken) {
// 		console.log("Regen token with following url:", tokenAccessUrl);
// 		throw new Error("Missing TRELLO_API_TOKEN env variable");
// 	}

// 	try {
// 		const lists = (await fetch(
// 			`https://api.trello.com/1/boards/${boardId}/lists?key=${apiKey}&token=${apiToken}`,
// 		).then((res) => res.json())) as { name: string; id: string }[];

// 		const listId = lists.find((l) => l.name === LIST_NAME)?.id;

// 		if (!listId) {
// 			throw new Error(`No list found: ${LIST_NAME}`);
// 		}

// 		console.log(`Found ${LIST_NAME} list.`);

// 		const cards = (await fetch(
// 			`https://api.trello.com/1/lists/${listId}/cards?key=${apiKey}&token=${apiToken}`,
// 		).then((res) => res.json())) as {
// 			name: string;
// 			id: string;
// 			badges: { attachments: number };
// 		}[];

// 		console.log(`Found ${cards.length} cards.`);
// 		const attachmentCards = cards.filter((c) => c.badges.attachments > 0);

// 		console.log(`Found ${attachmentCards.length} cards with attachments.`);

// 		for (const card of attachmentCards) {
// 			const attachments = (await fetch(
// 				`https://api.trello.com/1/cards/${card.id}/attachments?key=${apiKey}&token=${apiToken}`,
// 			).then((res) => res.json())) as {
// 				name: string;
// 				id: string;
// 				url: string;
// 				mimeType: string;
// 				fileName: string;
// 			}[];

// 			for (const attachment of attachments) {
// 				const { fileName, url, mimeType } = attachment;

// 				const downloadedPath = path.join(tmpDir, fileName);
// 				await saveFile(url, downloadedPath);

// 				let imagePaths = [] as string[];

// 				if (mimeType === "application/x-zip-compressed") {
// 					const result = await decompress(downloadedPath, tmpDir);
// 					imagePaths = result.map((r) => path.join(tmpDir, r.path));
// 				} else {
// 					console.log(`Mime type ${mimeType} not handled!`);
// 				}
// 				if (!imagePaths.length) {
// 					throw new Error("No image files found");
// 				}

// 				for (const imagePath of imagePaths) {
// 					const imageName = basename(imagePath);

// 					let assetFolder: string | undefined;
// 					if (imageName.startsWith("enemy-")) {
// 						assetFolder = "mob";
// 					}
// 					if (imageName.startsWith("item-")) {
// 						assetFolder = "item";
// 					}
// 					if (imageName.startsWith("npc-")) {
// 						assetFolder = "npc";
// 					}
// 					if (!assetFolder) {
// 						console.log(`\nFile: ${imageName} (${path.resolve(imagePath)})`);
// 						assetFolder = await inquirer
// 							.prompt([
// 								{
// 									type: "list",
// 									choices: assetFolders,
// 									name: "folder",
// 									message: "Which asset folder?",
// 								},
// 							])
// 							.then((answers) => answers.folder as string);
// 					}
// 					if (!assetFolder) {
// 						throw new Error("NO ASSET FOLDER");
// 					}

// 					renameSync(imagePath, path.join(assetDir, assetFolder, imageName));
// 				}

// 				rmSync(downloadedPath);
// 			}

// 			// TODO: move card to done?
// 		}
// 	} catch (e) {
// 		console.error(e);
// 		console.log("Something went wrong");
// 		console.log("If needed, regen token with following url:", tokenAccessUrl);
// 	}
// };

// void main();
