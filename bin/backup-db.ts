import { execFileSync } from "child_process";
import { existsSync } from "fs";
import { join } from "path";
import { format } from "date-fns";
import { writeFile } from "fs/promises";

const outputDir = "./bin/database-backups";

const main = async () => {
	const host = process.env.POSTGRES_HOST;
	const user = process.env.POSTGRES_USER;
	const db = process.env.POSTGRES_DATABASE;
	const password = process.env.POSTGRES_PASSWORD;

	if (!host || !user || !db || !password) {
		throw new Error("Missing DB env variables");
	}

	const backupOutputPath = join(
		outputDir,
		`${format(new Date(), "MM-dd-yyyy")}_fo2db.bak`,
	);

	if (existsSync(backupOutputPath)) {
		console.log("Backup already exists.");
		return;
	}

	process.env.PGPASSWORD = password;

	const args = `-h ${host} -Fc -O -U ${user} ${db}`;
	const output = execFileSync("pg_dump", args.split(" "));

	await writeFile(backupOutputPath, output);
};

void main();
