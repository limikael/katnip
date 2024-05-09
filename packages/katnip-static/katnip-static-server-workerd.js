import manifestJSON from '__STATIC_CONTENT_MANIFEST';
import {mimeTypes} from "./mime-types.js";

//console.log(manifestJSON);

const assetManifest=JSON.parse(manifestJSON);

fetch.priority=5;
export async function fetch(req, ev) {
    let assetName=new URL(req.url).pathname.slice(1);
    if (assetName=="__assetmanifest")
        return new Response(JSON.stringify(assetManifest));

    if (!assetManifest[assetName])
        return;

    let mimeType;
    for (let k in mimeTypes)
        if (assetName.endsWith(k))
            mimeType=mimeTypes[k];

    let etag='W/"'+assetManifest[assetName]+'"';

    let headers={
        "content-type": mimeType,
        "etag": etag
    }

    if (req.headers.get("if-none-match")==etag)
        return new Response(null,{status: 304,headers: headers});

    let asset=await ev.env.__STATIC_CONTENT.get(assetManifest[assetName],{type: "stream"});

    return new Response(asset,{headers: headers});
}
