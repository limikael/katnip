import {importWorker} from "../src/utils/import-worker.js";
import path from "path";
import {fileURLToPath} from 'url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));

describe("import-worker",()=>{
	it("can import a worker",async ()=>{
		let worker=await importWorker(path.join(__dirname,"import-worker.worker.js"));

		expect(await worker.hello()).toEqual(123);

		await expectAsync(worker.throwAnError()).toBeRejectedWith(new Error("this is an error"));

		await worker.worker.terminate();
	});
})