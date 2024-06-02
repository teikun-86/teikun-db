import mysql from "mysql2/promise";
import { updateConfig } from "./bootstrap.js";
import { MissingDatabaseCredential } from "./Exceptions/index.js";

export type DatabaseCredentials = {
	user: string;
	database: string;
	password: string;
	host: string;
	port: number;
};

let __credentials: DatabaseCredentials;

let connection: mysql.Connection;

export const setCredentials = async (credentials: DatabaseCredentials) => {
	__credentials = { ...__credentials, ...credentials };
	await updateConfig({
		__db_credentials: __credentials,
	});
};

export const hasConnection = (): boolean => {
    return typeof connection !== "undefined";
}

export const getConnection = async (): Promise<mysql.Connection> => {
	if (!__credentials) {
		throw new MissingDatabaseCredential();
	}
    if (!hasConnection()) {
        console.log(`[Teikun-db] creating new mysql connection`);
        connection = await mysql.createConnection(__credentials);
    }
    return connection;
};
