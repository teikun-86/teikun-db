export class InvalidQueryType extends Error {
	constructor(message?: string) {
		super(
			message ??
				"[Teikun-db] Invalid query type"
		);
		this.name = "InvalidQueryType";
	}
}
