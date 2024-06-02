import * as fs from "fs";
import * as path from "path";
import { updateConfig } from "./bootstrap.js";
import { MigrationFn } from "./types/Schema.js";
import { InvalidMigrationDirectory } from "./Exceptions/index.js";
import { isDirectoryExists } from "./util.js";
import { pathToFileURL } from "url";
import Schema from "./Misc/Schema.js";

const migrationPaths: string[] = [];

let mainMigrationPath: string = "";

const setMainMigrationPath = async (path: string) => {
	mainMigrationPath = path;
	await updateConfig({
		main_migration_path: mainMigrationPath,
	});
};

const addMigrationPath = async (...paths: string[]) => {
	paths.map((dir) => {
		const check = isDirectoryExists(dir);
		if (!check) {
			throw new InvalidMigrationDirectory(dir);
		}
	});
	migrationPaths.push(...paths);
	await updateConfig({
		migration_paths: migrationPaths,
	});
};

const getMigrations = async (): Promise<Schema[]> => {
	const migrationFiles: string[] = [];
	const migrationFilesWithKey: Record<string, string> = {};

	for (const dir of migrationPaths) {
		const files = fs.readdirSync(pathToFileURL(dir));

		const jsTsFiles = files.filter(
			(file) => file.endsWith(".mg.js") || file.endsWith(".mg.ts")
		);

		jsTsFiles.forEach((file) => {
			migrationFiles.push(path.resolve(dir, file));
			const ext = file.endsWith(".ts") ? "ts" : "js";
			migrationFilesWithKey[file.replace(`.mg.${ext}`, "")] =
				path.resolve(dir, file);
		});
	}

	const results: Schema[] = [];

	await Promise.all(
		Object.keys(migrationFilesWithKey).map(async (filename) => {
			const importedFile = await import(
				pathToFileURL(migrationFilesWithKey[filename]).toString()
			);
			(Object.values(importedFile).flat() as MigrationFn[]).map(
				(callback: MigrationFn) => {
					const result = callback();
					result.filename = filename;
					results.push(result);
				}
			);
		})
	);
	return results;
};

const getMainMigrationPath = (): string => mainMigrationPath;

export {
	addMigrationPath,
	getMigrations,
	setMainMigrationPath,
	getMainMigrationPath,
};
