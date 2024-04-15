import {findMatchingFiles} from "./fs-util.js";
import fs from "fs";

let files=await findMatchingFiles(fs.promises,"/home/micke/.config/yarn/global",["**/src/**/*.js"]);

for (let file of files)
	console.log(file);
//console.log(files.length);