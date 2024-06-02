export class MissingDatabaseCredential extends Error {
	constructor(message?: string) {
		super(
			message ??
				"[Teikun-db] Database credentials are not provided. Please provide the credentials by calling `setCredentials` before creating database connection."
		);
		this.name = "MissingDatabaseCredential";
	}
}
