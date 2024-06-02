import {
	ColumnType,
	ForeignKey,
	Index,
	Table,
	UniqueKey,
} from "../types/Schema.js";
import Column from "./Column.js";

export default class Schema implements Table {
	name: string;
	columns: Column[] = [];
	primaryKey?: string | string[] | undefined;
	foreignKeys?: ForeignKey[] | undefined;
	uniqueKeys?: UniqueKey[] | undefined;
	indexes?: Index[] | undefined;
	engine?: string | undefined = "InnoDB";
	charset?: string | undefined = "utf8mb4";
	collate?: string | undefined = "utf8mb4_unicode_ci";
	autoIncrement?: number | undefined;
	comment?: string | undefined;
	filename!: string;

	constructor(tableName: string) {
		this.name = tableName;
	}

	setEngine(engine: string): this {
		this.engine = engine;
		return this;
	}

	setCharset(charset: string): this {
		this.charset = charset;
		return this;
	}

	setCollate(collate: string): this {
		this.collate = collate;
		return this;
	}

	setAutoIncrement(autoIncrement: number): this {
		this.autoIncrement = autoIncrement;
		return this;
	}

	setComment(comment: string): this {
		this.comment = comment;
		return this;
	}

	setPrimaryKey(column: string | string[]): this {
		this.primaryKey = column;
		return this;
	}

	addForeignKey(foreignKey: ForeignKey): this {
        if (!this.foreignKeys) {
            this.foreignKeys = [];
        }
		this.foreignKeys.push(foreignKey);
		return this;
	}

	addUniqueKey(uniqueKey: UniqueKey): this {
        if (!this.uniqueKeys) {
            this.uniqueKeys = [];
        }
		this.uniqueKeys.push(uniqueKey);
		return this;
	}

	addIndex(name: string, columns: string[]) {
		if (!this.indexes) {
			this.indexes = [];
		}
		this.indexes.push({
			name,
			columns,
		});
		return this;
	}

	addColumn(column: Column): void {
		this.columns.push(column);
	}

	private __createNewColumn(name: string, type: ColumnType): Column {
		return new Column(name, type, this);
	}

	string(name: string, length: number = 191): Column {
		const column = this.__createNewColumn(name, "VARCHAR");
		column.setLength(length);
		this.addColumn(column);
		return column;
	}

	uuid(name: string = "uuid"): Column {
		const column = this.__createNewColumn(name, "VARCHAR");
		column.setLength(36);
		this.addColumn(column);
		return column;
	}

	integer(
		name: string,
		autoIncrement: boolean = false,
		unsigned: boolean = false
	): Column {
		const column = this.__createNewColumn(name, "INT");
		if (autoIncrement) {
			column.setAutoIncrement(autoIncrement);
		}
		if (unsigned) {
			column.setUnsigned(unsigned);
		}
		this.addColumn(column);
		return column;
	}

	tinyInteger(name: string, unsigned: boolean = false): Column {
		const column = this.__createNewColumn(name, "TINYINT");
		if (unsigned) {
			column.setUnsigned(unsigned);
		}
		this.addColumn(column);
		return column;
	}

	smallInteger(name: string, unsigned: boolean = false): Column {
		const column = this.__createNewColumn(name, "SMALLINT");
		if (unsigned) {
			column.setUnsigned(unsigned);
		}
		this.addColumn(column);
		return column;
	}

	mediumInteger(name: string, unsigned: boolean = false): Column {
		const column = this.__createNewColumn(name, "MEDIUMINT");
		if (unsigned) {
			column.setUnsigned(unsigned);
		}
		this.addColumn(column);
		return column;
	}

	bigInteger(
		name: string,
		autoIncrement: boolean = false,
		unsigned: boolean = false
	): Column {
		const column = this.__createNewColumn(name, "BIGINT");
		if (autoIncrement) {
			column.setAutoIncrement(autoIncrement);
		}
		if (unsigned) {
			column.setUnsigned(unsigned);
		}
		this.addColumn(column);
		return column;
	}

	float(name: string, precision?: number, scale?: number): Column {
		const column = this.__createNewColumn(name, "FLOAT");
		if (precision && scale) {
			column.setLength(precision);
			// In MySQL, FLOAT is generally specified as FLOAT(M,D) where M is the precision and D is the scale
			// This logic can be adjusted as needed to handle the scale part
		}
		this.addColumn(column);
		return column;
	}

	double(name: string, precision?: number, scale?: number): Column {
		const column = this.__createNewColumn(name, "DOUBLE");
		if (precision && scale) {
			column.setLength(precision);
			// This logic can be adjusted to handle the scale part as well
		}
		this.addColumn(column);
		return column;
	}

	decimal(name: string, precision: number): Column {
		const column = this.__createNewColumn(name, "DECIMAL");
		column.setLength(precision); // In this context, length represents precision
		// This logic can be adjusted to handle the scale part as well
		this.addColumn(column);
		return column;
	}

	boolean(name: string): Column {
		const column = this.__createNewColumn(name, "TINYINT");
		column.setLength(1);
		this.addColumn(column);
		return column;
	}

	char(name: string, length: number = 255): Column {
		const column = this.__createNewColumn(name, "CHAR");
		column.setLength(length);
		this.addColumn(column);
		return column;
	}

	text(name: string): Column {
		const column = this.__createNewColumn(name, "TEXT");
		this.addColumn(column);
		return column;
	}

	mediumText(name: string): Column {
		const column = this.__createNewColumn(name, "MEDIUMTEXT");
		this.addColumn(column);
		return column;
	}

	longText(name: string): Column {
		const column = this.__createNewColumn(name, "LONGTEXT");
		this.addColumn(column);
		return column;
	}

	date(name: string): Column {
		const column = this.__createNewColumn(name, "DATE");
		this.addColumn(column);
		return column;
	}

	dateTime(name: string): Column {
		const column = this.__createNewColumn(name, "DATETIME");
		this.addColumn(column);
		return column;
	}

	timestamp(name: string): Column {
		const column = this.__createNewColumn(name, "TIMESTAMP"); 
		this.addColumn(column);
		return column;
	}

	timestamps() {
		const created_at = this.timestamp("created_at");
		created_at.setNullable();
		const updated_at = this.timestamp("updated_at");
		updated_at.setNullable();
	}

	time(name: string): Column {
		const column = this.__createNewColumn(name, "TIME");
		this.addColumn(column);
		return column;
	}

	year(name: string): Column {
		const column = this.__createNewColumn(name, "YEAR");
		this.addColumn(column);
		return column;
	}

	binary(name: string, length: number = 255): Column {
		const column = this.__createNewColumn(name, "BINARY");
		column.setLength(length);
		this.addColumn(column);
		return column;
	}

	varBinary(name: string, length: number = 255): Column {
		const column = this.__createNewColumn(name, "VARBINARY");
		column.setLength(length);
		this.addColumn(column);
		return column;
	}

	blob(name: string): Column {
		const column = this.__createNewColumn(name, "BLOB");
		this.addColumn(column);
		return column;
	}

	mediumBlob(name: string): Column {
		const column = this.__createNewColumn(name, "MEDIUMBLOB");
		this.addColumn(column);
		return column;
	}

	longBlob(name: string): Column {
		const column = this.__createNewColumn(name, "LONGBLOB");
		this.addColumn(column);
		return column;
	}

	json(name: string): Column {
		const column = this.__createNewColumn(name, "JSON");
		this.addColumn(column);
		return column;
	}

	geometry(name: string): Column {
		const column = this.__createNewColumn(name, "GEOMETRY");
		this.addColumn(column);
		return column;
	}

	point(name: string): Column {
		const column = this.__createNewColumn(name, "POINT");
		this.addColumn(column);
		return column;
	}

	lineString(name: string): Column {
		const column = this.__createNewColumn(name, "LINESTRING");
		this.addColumn(column);
		return column;
	}

	polygon(name: string): Column {
		const column = this.__createNewColumn(name, "POLYGON");
		this.addColumn(column);
		return column;
	}

	multiPoint(name: string): Column {
		const column = this.__createNewColumn(name, "MULTIPOINT");
		this.addColumn(column);
		return column;
	}

	multiLineString(name: string): Column {
		const column = this.__createNewColumn(name, "MULTILINESTRING");
		this.addColumn(column);
		return column;
	}

	multiPolygon(name: string): Column {
		const column = this.__createNewColumn(name, "MULTIPOLYGON");
		this.addColumn(column);
		return column;
	}

	geometryCollection(name: string): Column {
		const column = this.__createNewColumn(name, "GEOMETRYCOLLECTION");
		this.addColumn(column);
		return column;
	}

	__toSql(): string {
		let sql = `CREATE TABLE ${this.name} (\n`;

		const columnDefinitions = this.columns
			.map((column) => `  ${column.__getSql()}`)
			.join(",\n");

		sql += columnDefinitions;

		if (this.primaryKey) {
			const primaryKey = Array.isArray(this.primaryKey)
				? this.primaryKey.join(", ")
				: this.primaryKey;
			sql += `,\n  PRIMARY KEY (${primaryKey})`;
		}

		if (this.foreignKeys) {
			this.foreignKeys.forEach((fk) => {
				sql += `,\n  FOREIGN KEY (${fk.column}) REFERENCES ${fk.refTable}(${fk.refColumn})`;
				if (fk.onDelete) {
					sql += ` ON DELETE ${fk.onDelete}`;
				}
				if (fk.onUpdate) {
					sql += ` ON UPDATE ${fk.onUpdate}`;
				}
			});
		}

		if (this.uniqueKeys) {
			this.uniqueKeys.forEach((uk) => {
				const columns = uk.columns.join(", ");
				sql += `,\n  UNIQUE KEY ${uk.name} (${columns})`;
			});
		}

		if (this.indexes) {
			this.indexes.forEach((index) => {
				const columns = index.columns.join(", ");
				sql += `,\n  INDEX ${index.name} (${columns})`;
			});
		}

		sql += "\n)";

		if (this.engine) {
			sql += ` ENGINE=${this.engine}`;
		}

		if (this.charset) {
			sql += ` CHARSET=${this.charset}`;
		}

		if (this.collate) {
			sql += ` COLLATE=${this.collate}`;
		}

		if (this.comment) {
			sql += ` COMMENT='${this.comment}'`;
		}

		return sql + ";";
	}
}
