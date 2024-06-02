export class DatabaseConnectionNotReady extends Error {
    constructor(message?: string) {
        super(`[Teikun-db] The database connection is not yet setted up. ${message}`);
        this.name = "DatabaseConnectionNotReady";
    }
}