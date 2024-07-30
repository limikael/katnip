import fs from "fs";
import {parse as parseYaml} from "yaml";
import {fileURLToPath} from 'url';
import path from "path";
import {findNodeBin, runCommand} from "katnip";
import {QuickminServer, quickminCanonicalizeConf} from "quickmin/server";
import * as TOML from "@ltd/j-toml";
import {quickminSqliteDriver} from "quickmin/sqlite-driver";
import {nodeStorageDriver} from "quickmin/node-storage";

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
    let quickminYamlFile="quickmin.yaml";
    if (!fs.existsSync(quickminYamlFile)) {
        console.log("Creating "+quickminYamlFile);
        fs.writeFileSync(quickminYamlFile,QUICKMIN_YAML);
    }
}

function getWranglerEnvForEvent(ev) {
    if (!ev.options)
        throw new Error("Expected ev.options");

    let env={...process.env};
    if (ev.options.cfToken)
        env.CLOUDFLARE_API_TOKEN=ev.options.cfToken;

    return env;
}

initcli.priority=20;
export async function initcli(spec) {
    spec.addCommandOption("dev","risky",{
        description: "Perform risky schema migration.",
        type: "boolean"
    });

    spec.addCommandOption("dev","qmLocalBundle",{
        description: "Load quickmin bundle locally (for dev).",
        type: "boolean"
    });

    spec.addCommandOption("dev","qmMakeUi",{
        description: "Build local quickmin bundle (for dev).",
        type: "boolean"
    });
}

cfdev.priority=15;
export async function cfdev(ev) {
    let quickminBin=await findNodeBin(__dirname,"quickmin");
    let quickminArgs=["migrate","--driver","wrangler-local"];
    if (ev.options.risky)
        quickminArgs.push("--risky");

    await runCommand(quickminBin,quickminArgs,{
        passthrough: true,
        env: getWranglerEnvForEvent(ev)
    });
}

cfdev.cfdeploy=15;
export async function cfdeploy(ev) {
    let quickminBin=await findNodeBin(__dirname,"quickmin");
    let quickminArgs=["migrate","--driver","wrangler"];
    if (ev.options.risky)
        quickminArgs.push("--risky");

    await runCommand(quickminBin,quickminArgs,{
        passthrough: true,
        env: getWranglerEnvForEvent(ev)
    });
}

export async function dev(ev) {
    if (ev.options.qmMakeUi) {
        await runCommand("quickmin",["makeui"],{stdio: "inherit"});
        ev.options.qmLocalBundle=true;
    }

    console.log("Migrating local db.");
    let server=new QuickminServer(ev.data.quickminConf,[
        quickminSqliteDriver,
        nodeStorageDriver
    ]);
    await server.sync({
        risky: ev.options.risky
    });
}

build.priority=15;
export async function build(ev) {
    let confText=fs.readFileSync("quickmin.yaml","utf8");
    let conf=quickminCanonicalizeConf(confText);
    await ev.hookRunner.emit("quickminConf",conf,ev);
    if (!conf.cookie)
        conf.cookie="qmtoken";

    ev.data.quickminConf=conf;

    let server=new QuickminServer({...ev.data.quickminConf});
    console.log("Quickmin storage used: "+server.isStorageUsed());

    if (ev.platform=="workerd") {
        console.log("Checking database settings in wrangler.toml");
        let wranglerPath=path.join(process.cwd(),"wrangler.toml");
        let wrangler=TOML.parse(fs.readFileSync(wranglerPath,"utf8"));

        if (!wrangler.d1_databases)
            wrangler.d1_databases=[];

        if (!wrangler.d1_databases.length) {
            console.log("Creating D1 database: "+wrangler.name);
            let wranglerBin=await findNodeBin(__dirname,"wrangler");

            let wranglerOut=await runCommand("wrangler",["d1","create",wrangler.name],{
                env: getWranglerEnvForEvent(ev)
            });
            let matches=wranglerOut.match(/database_id\s*=\s*\"([^\"]*)\"/)
            if (!matches || !matches[1])
                throw new DeclaredError("Unable to parse wrangler output.");

            let databaseId=matches[1];
            console.log("Created D1 database id: "+databaseId);

            wrangler.d1_databases.push({
                binding: 'DB',
                database_name: wrangler.name,
                database_id: databaseId
            });

            fs.writeFileSync(wranglerPath,TOML.stringify(wrangler,{newline: "\n"}));
        }

        if (server.isStorageUsed()) {
            if (!wrangler.r2_buckets)
                wrangler.r2_buckets=[];

            if (!wrangler.r2_buckets.length) {
                console.log("Creating R2 bucket: "+wrangler.name);
                let wranglerBin=await findNodeBin(__dirname,"wrangler");
                await runCommand(
                    "wrangler",
                    ["r2","bucket","create",wrangler.name],
                    {
                        passthrough: true,
                        env: getWranglerEnvForEvent(ev)
                    }
                );

                wrangler.r2_buckets.push({
                    binding: 'BUCKET',
                    bucket_name: wrangler.name,
                });

                fs.writeFileSync(wranglerPath,TOML.stringify(wrangler,{newline: "\n"}));
            }
        }
    }
}