import path from "path-browserify";
import {exists} from "./fs-util.js";
import {mimeTypes} from "./mime-types.js";

fetch.priority=5;
export async function fetch(req, ev) {
    let u=new URL(req.url);
    let cand=path.join(ev.cwd,ev.options.publicDir,u.pathname);

    if (await exists(ev.fsPromises,cand)) {
        console.log("serving static: "+cand);

        let ext=path.extname(cand).replace(".","");
        let headers=new Headers();
        if (mimeTypes[ext])
            headers.set("content-type",mimeTypes[ext]);

        let body=await ev.fsPromises.readFile(cand,"utf8");
        return new Response(body,{
            headers: headers
        });
    }
}
