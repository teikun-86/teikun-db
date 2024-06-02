import { config } from "@teikun-86/config-js";
import { InvalidQueryType, QueryExecutionError } from "../Exceptions/index.js";
import { getConnection } from "../connection.js";
import { QueryCondition, QueryResult, QueryBuilder as QueryBuilderInterface } from "../types/QueryBuilder.js";
import * as mysql from "mysql2/promise";

class QueryBuilder implements QueryBuilderInterface {
	private queryType: string = "";
	private fields: string[] = [];
	private table: string = "";
	private conditions: QueryCondition[] = [];
	private data: Record<string, any> = [];
	connection?: mysql.Connection;

	constructor() {
		this.__setupConnection();
	}

	private async __setupConnection() {
		this.connection = await getConnection();
		return this.connection;
	}

	select(fields: string[]): this {
		this.queryType = "SELECT";
		this.fields = fields;
		return this;
	}

	where(field: string | Function, operator?: string, value?: any): this {
		if (typeof field === "function") {
			const subqueryBuilder = new QueryBuilder();
			field(subqueryBuilder);
			const subquery = subqueryBuilder.buildSelect();
			this.conditions.push({
				type: "subquery",
				subquery,
				logicalOperator: "AND",
			});
		} else {
			this.conditions.push({
				type: "basic",
				field,
				operator,
				value,
				logicalOperator: "AND",
			});
		}
		return this;
	}

	orWhere(field: string | Function, operator?: string, value?: any): this {
		if (typeof field === "function") {
			const subqueryBuilder = new QueryBuilder();
			field(subqueryBuilder);
			const subquery = subqueryBuilder.buildSelect();
			this.conditions.push({
				type: "subquery",
				subquery,
				logicalOperator: "OR",
			});
		} else {
			this.conditions.push({
				type: "basic",
				field,
				operator,
				value,
				logicalOperator: "OR",
			});
		}
		return this;
	}

	insert(table: string, data: Record<string, any>): this {
		this.queryType = "INSERT";
		this.table = table;
		this.data = data;
		return this;
	}

	update(table: string, data: Record<string, any>): this {
		this.queryType = "UPDATE";
		this.table = table;
		this.data = data;
		return this;
	}

	deleteFrom(table: string): this {
		this.queryType = "DELETE";
		this.table = table;
		return this;
	}

	async get(columns: string[] = ["*"]): Promise<any> {
		this.queryType = "SELECT";
		this.fields = columns;
		return await this.execute();
	}

	setTable(table: string): this {
		this.table = table;
		return this;
	}

	async first(): Promise<any> {
		this.queryType = "FIRST";
		this.fields = ["*"];
		const result = await this.execute();
		return result;
	}

	private build(): QueryResult {
		switch (this.queryType) {
			case "SELECT":
				return this.buildSelect();
			case "FIRST":
				const result = this.buildSelect();
				result.query = `${result.query} LIMIT 1`;
				return result;
			case "INSERT":
				return this.buildInsert();
			case "UPDATE":
				return this.buildUpdate();
			case "DELETE":
				return this.buildDelete();
			default:
				throw new InvalidQueryType();
		}
	}

	async execute() {
		let connection = this.connection;
		if (!connection) {
			connection = await this.__setupConnection();
		}
		try {
			const query = this.build();

			const [results] = await connection.execute<mysql.RowDataPacket[]>(
				query.query,
				query.bindings
			);
			return results;
		} catch (error: any) {
			throw new QueryExecutionError(error);
		}
	}

	async tableExist(table: string): Promise<boolean> {
		const dbConfig = config("database");

		this.setTable("information_schema.tables")
			.where("table_schema", "=", `${dbConfig.__db_credentials.database}`)
			.where("table_name", "=", table)
			.select(["COUNT(*) as aggregate"]);
		const result = await this.execute();
		return result[0].aggregate > 0;
	}

	private buildSelect(): QueryResult {
		const fields = this.fields.length ? this.fields.join(", ") : "*";
		let query = `SELECT ${fields} FROM ${this.table}`;
		const bindings: string[] = [];
		if (this.conditions.length) {
			query +=
				" WHERE " +
				this.conditions
					.map((cond) => {
						if (cond.type === "basic") {
							bindings.push(cond.value);
							return `${cond.logicalOperator} ${cond.field} ${cond.operator} ?`.trim();
						} else if (cond.type === "subquery") {
							return `${cond.logicalOperator} (${cond.subquery})`.trim();
						}
						return "";
					})
					.join(" ")
					.replace(/^AND |^OR /, "");
		}
		return { query, bindings };
	}

	private buildInsert(): QueryResult {
		const keys = Object.keys(this.data);
		const values = keys.map((key) => this.data[key]);
		const placeholders = keys.map(() => "?").join(", ");

		const query = `INSERT INTO ${this.table} (${keys.join(
			", "
		)}) VALUES (${placeholders})`;

		return {
			query,
			bindings: values,
		};
	}

	private buildUpdate(): QueryResult {
		const bindings: string[] = Object.values(this.data);
		const setClauses = Object.keys(this.data)
			.map((key) => `${key} = ?`)
			.join(", ");

		let query = `UPDATE ${this.table} SET ${setClauses}`;
		if (this.conditions.length) {
			query +=
				" WHERE " +
				this.conditions
					.map((cond) => {
						if (cond.type === "basic") {
							bindings.push(cond.value);
							return `${cond.logicalOperator} ${cond.field} ${cond.operator} ?`.trim();
						} else if (cond.type === "subquery") {
							return `${cond.logicalOperator} (${cond.subquery})`.trim();
						}
						return "";
					})
					.join(" ")
					.replace(/^AND |^OR /, "");
		}
		return { query, bindings };
	}

	private buildDelete(): QueryResult {
		let query = `DELETE FROM ${this.table}`;
		const bindings: any[] = [];
		if (this.conditions.length) {
			query +=
				" WHERE " +
				this.conditions
					.map((cond) => {
						if (cond.type === "basic") {
							bindings.push(cond.value);
							return `${cond.logicalOperator} ${cond.field} ${cond.operator} ?`.trim();
						} else if (cond.type === "subquery") {
							return `${cond.logicalOperator} (${cond.subquery})`.trim();
						}
						return "";
					})
					.join(" ")
					.replace(/^AND |^OR /, "");
		}
		return { query, bindings };
	}
}

export default QueryBuilder;
