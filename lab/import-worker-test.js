import {importWorker} from "../src/utils/import-worker.js";
import path from "path";
import {fileURLToPath} from 'url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));


let w=await importWorker(path.join(__dirname,"test-worker.js"));

//console.log(w.worker);

console.log("f1: "+await w.test("hello"));

w.worker.terminate();

//console.log("f2: "+await w.test("hello2"));

/*console.log("f3: "+await w.proxy.stop());*/

//w.worker.terminate();

//console.log(w.test());
