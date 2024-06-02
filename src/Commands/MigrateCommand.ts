import { BaseCommand } from "@teikun-86/teikun-cli";
import Migrator from "../Misc/Migrator.js";

export default class MigrateCommand extends BaseCommand {
	name: string = "migrate";
	description: string = "Migrate the tables.";

	async handle() {
		const migrator = new Migrator();
        await migrator.startConnection();
        await migrator.migrate();
		return;
	}
}
