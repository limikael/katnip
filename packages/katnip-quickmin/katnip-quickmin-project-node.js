import fs from "fs";
import {parse as parseYaml} from "yaml";
import {fileURLToPath} from 'url';
import path from "path";
import {HookEvent, findNodeBin, resolveHookEntryPoints} from "katnip";
import {QuickminServer, quickminCanonicalizeConf} from "quickmin/server";
import {dsnDb} from "quickmin/dsn-db";
import {nodeStorageDriver} from "quickmin/node-storage";
import {mockStorageDriver} from "quickmin/mock-storage";
import {wranglerDbRemote, wranglerDbLocal, WranglerQqlDriver} from "quickmin/wrangler-db";
import esbuild from "esbuild";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const QUICKMIN_YAML=
`
jwtSecret: "changeme"
adminUser: "admin"
adminPass: "admin"
apiPath: "admin"

collections:
  pages:
    fields:
      <Text id="title" listable/>
      <Text id="content" multiline fullWidth/>
`;

export function init(ev) {
    let quickminYamlFile=path.join(ev.cwd,"quickmin.yaml");
    if (!fs.existsSync(quickminYamlFile)) {
        console.log("Creating "+quickminYamlFile);
        fs.writeFileSync(quickminYamlFile,QUICKMIN_YAML);
    }
}

export async function build(buildEvent) {
    let confText=fs.readFileSync(path.join(buildEvent.cwd,"quickmin.yaml"),"utf8");
    let conf=quickminCanonicalizeConf(confText);
    buildEvent.appData.quickminConf=conf;

    let modulePaths=await resolveHookEntryPoints(buildEvent.cwd,"quickmin-client-functions",{
        fs: buildEvent.fs,
        keyword: "katnip-plugin"
    });

    console.log("Quickmin client modules: "+JSON.stringify(modulePaths));
    if (modulePaths.length>1)
        throw new Error("Only one client module supported...");

    if (modulePaths.length) {
        if (!buildEvent.options.publicDir)
            throw new Error("Need a static dir to use quickmin client functions.");

        console.log("Building client modules to: "+buildEvent.options.publicDir);
        await esbuild.build({
            entryPoints: [modulePaths[0]],
            outfile: path.join(buildEvent.cwd,buildEvent.options.publicDir,"quickmin-client-functions.js"),
            format: "esm",
            bundle: true
        });

        buildEvent.appData.quickminConf.clientImports=["/quickmin-client-functions.js"];
    }

    await buildEvent.target.dispatch(new HookEvent("quickminConf",{
        quickminConf: buildEvent.appData.quickminConf,
        ...buildEvent
    }));

    if (!conf.cookie)
        conf.cookie="qmtoken";

    let server=new QuickminServer({
        ...buildEvent.appData.quickminConf, 
        uninitialized: true
    });

    if (buildEvent.tags.includes("node")
            && buildEvent.tags.includes("dev")) {
        if (!conf.dsn)
            conf.dsn="sqlite:"+path.join(buildEvent.cwd,"quickmin.db");

        let server=new QuickminServer(buildEvent.appData.quickminConf,[
            dsnDb,
            nodeStorageDriver
        ]);

        console.log("Migrating local schema...");
        await server.sync({
            risky: buildEvent.options.risky
        });
    }

    if (buildEvent.tags.includes("cloudflare")) {
        console.log("Checking database settings in wrangler.json");
        let wranglerPath=path.join(buildEvent.cwd,"wrangler.json");
        let wrangler=JSON.parse(fs.readFileSync(wranglerPath,"utf8"));

        if (!wrangler.d1_databases)
            wrangler.d1_databases=[];

        if (!wrangler.d1_databases.length) {
            console.log("Registering D1 database: "+wrangler.name);

            wrangler.d1_databases.push({
                binding: 'DB',
                database_name: wrangler.name,
                database_id: "undefined",
                preview_database_id: "DB"
            });

            fs.writeFileSync(wranglerPath,JSON.stringify(wrangler,null,2));
        }

        if (server.isStorageUsed()) {
            if (!wrangler.r2_buckets)
                wrangler.r2_buckets=[];

            if (!wrangler.r2_buckets.length) {
                console.log("Registering R2 bucket: "+wrangler.name);

                wrangler.r2_buckets.push({
                    binding: 'BUCKET',
                    bucket_name: "undefined",
                    preview_bucket_name: "BUCKET"
                });

                fs.writeFileSync(wranglerPath,JSON.stringify(wrangler,null,2));
            }
        }

        if (buildEvent.tags.includes("dev")) {
            let wranglerInfo=new HookEvent("wranglerInfo",{...buildEvent});
            buildEvent.target.dispatch(wranglerInfo);

            let conf={...buildEvent.appData.quickminConf};
            conf.qqlDriver=new WranglerQqlDriver({
                local: true,
                wranglerJsonPath: wranglerPath,
                wranglerBin: wranglerInfo.wranglerBin,
                wranglerEnv: wranglerInfo.wranglerEnv
            });

            let migrationServer=new QuickminServer(conf,[
                mockStorageDriver
            ]);

            await migrationServer.sync({
                risky: buildEvent.options.risky
            });
        }
    }
}

export async function watchIgnore(ev) {
    ev.watchIgnore.push("*.db","*.db-journal","upload/**");
}

export async function deploy(deployEvent) {
    if (deployEvent.tags.includes("cloudflare")) {
        console.log("Migrating cloudflare db...");
        let wranglerPath=path.join(deployEvent.cwd,"wrangler.json");
        let wranglerInfo=new HookEvent("wranglerInfo",{...deployEvent});
        deployEvent.target.dispatch(wranglerInfo);

        let conf={...deployEvent.appData.quickminConf};
        conf.qqlDriver=new WranglerQqlDriver({
            remote: true,
            wranglerJsonPath: wranglerPath,
            wranglerBin: wranglerInfo.wranglerBin,
            wranglerEnv: wranglerInfo.wranglerEnv
        });

        let migrationServer=new QuickminServer(conf,[
            mockStorageDriver
        ]);
        await migrationServer.sync({
            risky: deployEvent.options.risky
        });
    }
}
