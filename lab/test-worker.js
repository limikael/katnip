import path from "path";

console.log("hello, i'm the test worker");

export async function test(param) {
	return param+123;
}

export async function stop() {
	process.exit();
}