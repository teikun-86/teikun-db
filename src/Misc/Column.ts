import { ColumnType, Column as ColumnInterface } from "../types/Schema.js";
import Schema from "./Schema.js";

export default class Column implements ColumnInterface {
	name: string;
	type: ColumnType;
	nullable?: boolean;
	default?: any;
	primaryKey?: boolean;
	unique?: boolean;
	autoIncrement?: boolean;
	comment?: string;
	length?: number;
	unsigned?: boolean;
	schema: Schema;

	constructor(name: string, type: ColumnType, schema: Schema) {
		this.name = name;
		this.type = type;
		this.schema = schema;
	}

	setLength(length: number): Column {
		this.length = length;
		return this;
	}

	setNullable(nullable: boolean = true): Column {
		this.nullable = nullable;
		return this;
	}

	setType(type: ColumnType): Column {
		this.type = type;
		return this;
	}

	setDefault(value: any = null): Column {
		this.default = value;
		return this;
	}

	setPrimaryKey(value: boolean = true): Column {
		this.primaryKey = value;
		return this;
	}

	setUnique(value: boolean = true): Column {
		this.unique = value;
		this.schema.addUniqueKey({
			name: `${this.schema.name}_${this.name}_unique`,
			columns: [this.name]
		});
		return this;
	}

	setAutoIncrement(value: boolean = true): Column {
		this.autoIncrement = value;
		return this;
	}

	setComment(value: string): Column {
		this.comment = value;
		return this;
	}

	setUnsigned(value: boolean = true): Column {
		this.unsigned = value;
		return this;
	}

    __getSql(): string {
        return this.__toSql()
    }

	private __toSql(): string {
		let sql = `${this.name} ${this.type}`;

		if (this.length) {
			sql += `(${this.length})`;
		}

		if (this.unsigned) {
			sql += " UNSIGNED";
		}

		if (this.nullable === false) {
			sql += " NOT NULL";
		}

		if (this.autoIncrement) {
			sql += " AUTO_INCREMENT";
		}

		if (this.default !== undefined) {
			sql += ` DEFAULT '${this.default}'`;
		}

		if (this.comment) {
			sql += ` COMMENT '${this.comment}'`;
		}

		return sql;
	}
}
