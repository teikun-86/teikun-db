export class QueryExecutionError extends Error {
	constructor(error: Error, message?: string) {
		super(`[Teikun-db] Query execution failed: ${message}`);
        this.stack = error.stack;
		this.name = "QueryExecutionError";
	}
}
