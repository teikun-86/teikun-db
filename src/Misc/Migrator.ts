import * as mysql from "mysql2/promise";
import { getConnection } from "../connection.js";
import { getMigrations } from "../migration-setup.js";
import Schema from "./Schema.js";
import { DatabaseConnectionNotReady } from "../Exceptions/index.js";
import QueryBuilder from "../Builder/QueryBuilder.js";
import Values from "./Values.js";
import { pluck } from "../util.js";

export default class Migrator {
	private connection?: mysql.Connection;

	async startConnection() {
		this.connection = await getConnection();
		return this.connection;
	}

	private async migrationBase(): Promise<void> {
		console.log(`[Teikun-db] no migrations table found. Creating one...`);
		const migration = new Schema("migrations");

		migration.bigInteger("id", true, true).setPrimaryKey();
		migration.setPrimaryKey("id");
		migration.string("name");
		migration.integer("batch").setNullable();
		migration.timestamps();

		await this.__execute([migration]);
	}

	async migrate() {
		if (!this.connection) {
			throw new DatabaseConnectionNotReady(
				"Please set up connection by calling `Migrator.startConnection()`"
			);
		}

		const check = await this.__checkMigrationsTable();
		if (!check) {
			await this.migrationBase();
		}

		const migrationFiles = await getMigrations();
		const migrationRecords = await this.__getMigrationRecords();

		if (migrationFiles.length === 0) {
			console.log(`[Teikun-db] Nothing to migrate`);
			return;
		}

		const migratedFilenames = pluck(migrationRecords, "name");

		const results =
			migrationRecords.length > 0
				? migrationFiles.filter((table) =>
						!migratedFilenames.includes(table.filename)
				  )
				: migrationFiles;

		if (migrationFiles.length === 0 || results.length === 0) {
			console.log(`[Teikun-db] Nothing to migrate`);
			return;
		}

		await this.__execute(results);
	}

	private async __checkMigrationsTable() {
		const result = await new QueryBuilder().tableExist("migrations");
		return result;
	}

	private async __execute(tables: Schema[]) {
		let connection = this.connection;
		if (!connection) {
			connection = await this.startConnection();
		}
		try {
			await connection.beginTransaction();
			const promises = tables.map((table) =>
				this.__createTable(table, connection)
			);
			await Promise.all(promises);
			await connection.commit();
			console.log(`[Teikun-db] Done migrating tables.`);
		} catch (error) {
			console.log(
				`[Teikun-db] Migrations failed. Rolling back all the migrations.`
			);
			await connection.rollback();
		}
	}

	private async __createTable(table: Schema, connection: mysql.Connection) {
		const startTime = performance.now();
		const sql = table.__toSql();
		console.log(`[Teikun-db] Migrating ${table.name} table.`);
		try {
			await connection.execute(sql);
			await this.__insertMigration({
				name: `create_${table.name}_table`,
				created_at: Values.currentTimestamp(),
			});
			const endTime = performance.now();
			console.log(
				`[Teikun-db] Migrated ${table.name} successfully. (${(
					endTime - startTime
				).toFixed(2)} ms)`
			);
		} catch (error) {
			console.log(`[Teikun-db] Failed to migrate ${table.name}.`, error);
			throw error;
		}
	}

	private async __insertMigration(data: Record<string, any>): Promise<void> {
		try {
			const db = new QueryBuilder();
			db.insert("migrations", data);
			await db.execute();
			console.log(`Migration data created.`);
		} catch (error) {
			console.log(`Failed to insert migration.`, error);
		}
	}

	private async __getMigrationRecords() {
		const db = new QueryBuilder();
		db.setTable("migrations");
		return await db.get();
	}
}
