import {resolveImport, resolveAllExports} from "resolve-import";

//let i=await resolveImport("katnip-project-hooks","/home/micke/Repo.lab/katnip-lab/packages/katnip-node");
let i=await resolveAllExports("/home/micke/Repo.lab/katnip-lab/packages/katnip-node/package.json",{conditions:["node"]});

console.log(i);