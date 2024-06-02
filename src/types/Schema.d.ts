import Schema from "../Misc/Schema";

export interface Table {
	name: string;
	columns: Column[];
	primaryKey?: string | string[];
	foreignKeys?: ForeignKey[];
	uniqueKeys?: UniqueKey[];
	indexes?: Index[];
	engine?: string;
	charset?: string;
	collate?: string;
	autoIncrement?: number;
	comment?: string;
}

export type ColumnType =
	| "TINYINT"
	| "SMALLINT"
	| "MEDIUMINT"
	| "INT"
	| "BIGINT"
	| "FLOAT"
	| "DOUBLE"
	| "DECIMAL"
	| "CHAR"
	| "VARCHAR"
	| "TEXT"
	| "MEDIUMTEXT"
	| "LONGTEXT"
	| "DATE"
	| "DATETIME"
	| "TIMESTAMP"
	| "TIME"
	| "YEAR"
	| "BINARY"
	| "VARBINARY"
	| "BLOB"
	| "MEDIUMBLOB"
	| "LONGBLOB"
	| "GEOMETRY"
	| "POINT"
	| "LINESTRING"
	| "POLYGON"
	| "MULTIPOINT"
	| "MULTILINESTRING"
	| "MULTIPOLYGON"
	| "GEOMETRYCOLLECTION"
	| "JSON";

export interface Column {
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
}

export interface ForeignKey {
	column: string;
	refTable: string;
	refColumn: string;
	onDelete?: string;
	onUpdate?: string;
}

export interface UniqueKey {
	name: string;
	columns: string[];
}

export interface Index {
	name: string;
	columns: string[];
}

export type MigrationFn = () => Schema;