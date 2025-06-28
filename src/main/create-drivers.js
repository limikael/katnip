import {QqlDriverBetterSqlite3} from "quickmin/qql";
import {QqlDriverD1} from "quickmin/qql";
import {R2Storage} from "quickmin/r2-storage";

export function createQqlDriver(service, type) {
	switch (type) {
		case "better-sqlite3":
			return new QqlDriverBetterSqlite3(service);
			break;

		case "d1":
			return new QqlDriverD1(service);
			break;

		default:
			throw new Error("Unknown database service type: "+type);
	}
}

export function createStorageDriver(service, type) {
	switch (type) {
		case "r2":
		case "node-storage":
			return new R2Storage(service);
			break;

		default:
			throw new Error("Unknown storage type: "+type);
	}
}