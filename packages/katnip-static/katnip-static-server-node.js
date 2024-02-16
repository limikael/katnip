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
export function fetch(req, ev) {
    let u=new URL(req.url);
    let cand=path.join(ev.options.publicDir,u.pathname);

    if (fs.existsSync(cand) &&
            fs.statSync(cand).isFile()) {
        let ext=path.extname(cand).replace(".","");
        let headers=new Headers();
        if (mimeTypes[ext])
            headers.set("content-type",mimeTypes[ext]);

        let body=createStreamBody(fs.createReadStream(cand));
        return new Response(body,{
            headers: headers
        });
    }
}
