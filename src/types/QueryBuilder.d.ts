export interface QueryCondition {
    type: 'basic' | 'subquery';
    field?: string;
    operator?: string;
    value?: any;
    subquery?: QueryResult;
    logicalOperator?: 'AND' | 'OR';
}

export interface QueryBuilder {
    select(fields: string[]): this;
    where(field: string | Function, operator?: string, value?: any): this;
    orWhere(field: string | Function, operator?: string, value?: any): this;
    insert(table: string, data: Record<string, any>): this;
    update(table: string, data: Record<string, any>): this;
    deleteFrom(table: string): this;
    get(columns?: string[]): Promise<any>;
    first(): Promise<any>;
}

export type QueryResult = {
    query: string;
    bindings: (string | number | boolean | any)[];
}