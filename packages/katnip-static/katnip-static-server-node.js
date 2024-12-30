import fs from "fs";
import path from "path";
import {mimeTypes} from "./mime-types.js";

function createStreamBody(stream) {
    const body = new ReadableStream({
        start(controller) {
            stream.on('data', (chunk) => {
                controller.enqueue(chunk)
            })
            stream.on('end', () => {
                controller.close()
            })
        },

        cancel() {
            stream.destroy()
        },
    })
    return body
}

fetch.priority=5;
export function fetch(fetchEvent) {
    let u=new URL(fetchEvent.request.url);
    let cand=path.join(fetchEvent.cwd,fetchEvent.options.publicDir,u.pathname);

    //console.log(fetchEvent.cwd);
    //console.log("looking for: "+cand);

    if (fs.existsSync(cand) &&
            fs.statSync(cand).isFile()) {
        let ext=path.extname(cand).replace(".","");
        let headers=new Headers();
        if (mimeTypes[ext])
            headers.set("content-type",mimeTypes[ext]);

        let stat=fs.statSync(cand);        
        headers.set("content-length",stat.size);

        let body=createStreamBody(fs.createReadStream(cand));
        return new Response(body,{
            headers: headers
        });
    }
}
