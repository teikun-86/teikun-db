import Schema from "../Misc/Schema.js";

export default function createUsersTable(): Schema {
	const users = new Schema("users");

	users.bigInteger("id", true, true).setPrimaryKey();
	users.setPrimaryKey("id");
	users.string("name");
	users.string("email").setUnique();
	users.string("username").setUnique();
	users.timestamps();

	return users;
}
