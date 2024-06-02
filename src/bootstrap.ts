import * as path from "path";
import fs from "fs";
import { registerNewCommand } from "@teikun-86/teikun-cli";
import MigrateCommand from "./Commands/MigrateCommand.js";
import { addMigrationPath, setMainMigrationPath } from "./migration-setup.js";
import { getConnection, setCredentials } from "./connection.js";
import { readJSON } from "./util.js";
import { config } from "@teikun-86/config-js";

let __filename = new URL(import.meta.url).pathname;
if (__filename.startsWith("/")) {
    __filename = __filename.slice(1);
}
let __dirname = path.dirname(__filename);

async function loadConfig () {
    config.initializeConfigLoader(path.resolve(__dirname, "./../config"));
	const configPath = path.resolve(__dirname, "./../config/database.json");
	try {
		const config = readJSON(configPath);
        if (!config) {
            throw new Error(`Failed to parse config.`)
        }
	} catch (err) {
		console.error("[Teikun-db] Error loading configuration:", err);
	}
};

export async function updateConfig (newConfig: Record<string, any>) {
	const configPath = path.resolve(__dirname, "./../config/database.json");
	try {
        const newConf = {
            ... config("database"),
            ...newConfig
        }
		fs.writeFileSync(configPath, JSON.stringify(newConf));
	} catch (err) {
		console.error("[Teikun-db] Error updating configuration:", err);
	}
};

export function boot () {
	return new Promise(
		async (resolve: (value: Record<string, any>) => void, reject: (reason: any) => void) => {
            try {
                await loadConfig();
                registerNewCommand("migrate", MigrateCommand);
                await addMigrationPath(path.resolve(__dirname, "migrations"));
                await setMainMigrationPath(path.resolve(__dirname, "migrations"));
                await setCredentials(config("database.__db_credentials"));
                resolve(config("database"));
            } catch (error) {
                reject(error);
            } finally {
                const connection = await getConnection();
                await connection.end();
            }
		}
	);
};
