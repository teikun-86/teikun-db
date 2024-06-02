#!/usr/bin/env node

import { Flag } from "@teikun-86/teikun-cli";
import MigrateCommand from "../Commands/MigrateCommand.js";
import { boot } from "../bootstrap.js";
import { performance } from "perf_hooks";

let timestart = performance.now();

boot().then(async () => {
	
	const args = process.argv.slice(2);
	const commandArgs = args.slice(1).filter((arg) => !arg.startsWith("--"));
	let options: Flag[] = [];
	args.forEach((arg) => {
		if (arg.startsWith("--")) {
			const optionPair = arg.split("=");
			const key = optionPair[0];
			const value = optionPair.length === 1 ? true : optionPair[1];

			const option: Flag = {
				name: key,
				value,
			};
			options.push(option);
		}
	});

	const commandToRun = new MigrateCommand();
	const applyArgs = commandToRun.applyArgs(commandArgs);
	const applyFlags = commandToRun.applyFlags(options);
	if (!applyArgs || !applyFlags) {
		return;
	}
	await commandToRun.handle();
	let timeend = performance.now();
	console.log(`[Teikun-db] Execution time: ${(timeend - timestart).toFixed(2)}ms`);
	process.exit(0);
});
