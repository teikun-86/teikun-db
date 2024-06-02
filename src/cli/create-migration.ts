#!/usr/bin/env node
import * as fs from "fs";
import * as path from "path";
import { boot } from "../bootstrap.js";
import { isDirectoryExists } from "../util.js";
const __filename = new URL(import.meta.url).pathname;
const __dirname = path.dirname(__filename);
boot().then((dbConfig: Record<string, any>) => {
	const resolveStub = (options: Record<string, string | boolean>): string => {
		return fs.readFileSync(
			path.resolve(
				__dirname,
				`../stub/migration-${options.output ?? "ts"}.stub`
			),
			"utf-8"
		);
	};

	const createReplacement = (
		tableName: string,
		options: Record<string, string | boolean>
	): Record<string, string> => {
		tableName = tableName.toLowerCase();
		return {
			functionName: `create${
				tableName.charAt(0).toUpperCase() + tableName.slice(1)
			}Table`,
			fileName: `create_${tableName}_table.mg.${options.output ?? "ts"}`,
			tableName: tableName,
			SchemaImportPath: "../Misc/Schema",
		};
	};

	const parseOptions = () => {
		const args = process.argv.slice(2);
		let options: Record<string, string | boolean> = {};

		args.forEach((arg) => {
			if (arg.startsWith("--")) {
				const optionPair = arg.split("=");
				const key = optionPair[0];
				const value = optionPair.length === 1 ? true : optionPair[1];
				options[key.slice(2)] = value;
			}
		});
		return options;
	};

	const handle = () => {
		const args = process.argv.slice(2);
		const options = parseOptions();

		if (!args[0] || (Object.keys(options).length > 0 && !options.output)) {
			console.error(
				`Usage: yarn teikun-db:make-migration <tableName> [--output=[js,ts] default=ts]`,
				args,
				options
			);
			return;
		}
		const replacement = createReplacement(args[0], options);

		let stub = resolveStub(options);
		stub = stub.replace(/{{\s*(\w+)\s*}}/g, (match, p1) => {
			return replacement[p1] || match;
		});
        if (!isDirectoryExists(dbConfig.main_migration_path)) {
            fs.mkdirSync(dbConfig.main_migration_path);
        }
		fs.writeFileSync(
			path.resolve(dbConfig.main_migration_path, replacement.fileName),
			stub
		);
        console.log(
			`[Teikun-db] Created migration ${
				replacement.fileName.replace(`.mg.${options.output}`, "")
			} at "${path.resolve(
				dbConfig.main_migration_path,
				replacement.fileName
			)}"`
		);
	};

	handle();
});
