import path from "path-browserify";
import {exists} from "./fs-util.js";
import {mimeTypes} from "./mime-types.js";
import {urlGetArgs, splitPath, jsonEq} from "./js-util.js";
import urlJoin from "url-join";

fetch.priority=5;
export async function fetch(req, ev) {
    let urlParts=urlGetArgs(req.url);
    let appPathnameParts=splitPath(ev.appPathname);
    let prefixParts=urlParts.splice(0,appPathnameParts.length);
    if (!jsonEq(prefixParts,appPathnameParts))
        return;

    let contentFileCand=path.join(ev.options.publicDir,...urlParts);
    for (let contentFile of ev.contentFiles)
        if (contentFile.name==contentFileCand) {
            let parsedUrl=new URL(req.url);
            let contentUrl=urlJoin(parsedUrl.origin,"admin/_content",contentFile.file);
            //console.log("found content file: ",contentFile,"->",contentUrl);

            return Response.redirect(contentUrl);
        }

    let cand=path.join(ev.cwd,ev.options.publicDir,...urlParts);
    if (!await exists(ev.fsPromises,cand))
        return;

    let stat=await ev.fsPromises.stat(cand);
    if (!stat.isFile())
        return;

    //console.log("serving static: "+cand);
    let ext=path.extname(cand).replace(".","");
    let headers=new Headers();
    if (mimeTypes[ext])
        headers.set("content-type",mimeTypes[ext]);

    let body=await ev.fsPromises.readFile(cand,"utf8");
    return new Response(body,{
        headers: headers
    });
}
