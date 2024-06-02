import { QueryBuilder as QueryBuilderInterface } from "../types/QueryBuilder.js";

export default abstract class BaseQueryBuilder
	implements QueryBuilderInterface
{
	select(_fields: string[]): this {
		throw new Error("Method not implemented.");
	}
	where(
		_field: string | Function,
		_operator?: string | undefined,
		_value?: any
	): this {
		throw new Error("Method not implemented.");
	}
	orWhere(
		_field: string | Function,
		_operator?: string | undefined,
		_value?: any
	): this {
		throw new Error("Method not implemented.");
	}
	insert(_table: string, _data: Record<string, any>): this {
		throw new Error("Method not implemented.");
	}
	update(_table: string, _data: Record<string, any>): this {
		throw new Error("Method not implemented.");
	}
	deleteFrom(_table: string): this {
		throw new Error("Method not implemented.");
	}
	async get(_columns?: string[] | undefined): Promise<any> {
		throw new Error("Method not implemented.");
	}
	async first(): Promise<any> {
		throw new Error("Method not implemented.");
	}
}
