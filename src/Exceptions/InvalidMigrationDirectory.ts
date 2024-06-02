export class InvalidMigrationDirectory extends Error {
	constructor(directory: string) {
		super(`[Teikun-db] The directory "${directory}" is not exist or is not a directory.`);
		this.name = "InvalidMigrationDirectory";
	}
}