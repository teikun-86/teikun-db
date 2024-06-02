import fs from "fs";
import moment from "moment";
import path from "path";
import { pathToFileURL } from "url";

export const isDirectoryExists = (dir: string): boolean => {
	try {
		const check = fs.statSync(dir);
		return check.isDirectory();
	} catch (error) {
		return false;
	}
};

export const readJSON = (dir: string): Record<string, any> | false => {
	const filePath = path.resolve(dir);

	try {
		const jsonData = fs.readFileSync(pathToFileURL(filePath), "utf8");

		const parsedData = JSON.parse(jsonData);

		return parsedData;
	} catch (error) {
		console.error("Error reading JSON file:", error);
		return false;
	}
};

export const currentTimestamp = (): string => {
	return moment().format("YYYY-MM-DD HH:mm:ss");
};

export const pluck = <
	ObjectType = Record<string, any>,
	ReturnType = string | number
>(
	arrayOfObject: ObjectType[],
	objectKey: keyof ObjectType
): Array<ReturnType> =>
	arrayOfObject.map((item) => item[objectKey]) as ReturnType[];
