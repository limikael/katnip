import fs, {promises as fsp} from "node:fs";
import path from "node:path";
import {fileURLToPath} from 'url';
import {quickminCanonicalizeConf, QuickminServer} from "quickmin/server";
import {isoqGetEsbuildOptions} from "isoq/bundler";
import esbuild from "esbuild";
import {DeclaredError} from "../../src/exports/exports-default.js";
import {AsyncEvent} from "katnip";

export * from "./katnip-quickmin-resources-node.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const QUICKMIN_YAML=
`
jwtSecret: "changeme"
adminUser: "admin"
adminPass: "admin"

collections:
  pages:
    fields:
      <Text id="title" listable/>
      <Text id="content" multiline fullWidth/>
`;

export async function initCli(ev) {
    ev.target.eventCommand("init")
        .option("--no-database","Don't initialize database.");
}

export async function init(ev) {
    if (!ev.database)
        return;

    let quickminYamlFile=path.join(ev.target.cwd,"quickmin.yaml");
    if (!fs.existsSync(quickminYamlFile)) {
        //console.log("Creating "+quickminYamlFile);
        fs.writeFileSync(quickminYamlFile,QUICKMIN_YAML);
    }

    if (!fs.existsSync(path.join(ev.target.cwd,".env")) &&
            !fs.existsSync(path.join(ev.target.cwd,".env.node"))) {
        await ev.target.processProjectFile(".env.node","dotenv",async dotenv=>{
            if (!dotenv)
                dotenv={};

            if (!dotenv.DATABASE_URL)
                dotenv.DATABASE_URL="libsql+file:quickmin.db";

            if (!dotenv.DATABASE_STORAGE_URL)
                dotenv.DATABASE_STORAGE_URL="node+file:upload";

            return dotenv;
        });
    }
}

initProvision.event="provision";
initProvision.priority=1;
export async function initProvision(ev) {
    let project=ev.target;

    ev.isDatabaseUsed=async ()=>{
        return fs.existsSync(path.join(project.cwd,"quickmin.yaml"));
    }

    ev.isDatabaseStorageUsed=async ()=>{
        let confText=await fsp.readFile(path.join(project.cwd,"quickmin.yaml"),"utf8");
        let conf=quickminCanonicalizeConf(confText);
        conf.storageDriver="mock";
        conf.qqlDriver="mock";
        let server=new QuickminServer(conf);
        return server.isStorageUsed();
    }
}

provision.priority=20;
export async function provision(provisionEvent) {
    let env=provisionEvent.env;
    let project=provisionEvent.target;

    if (!fs.existsSync(path.join(project.cwd,"quickmin.yaml")))
        return;

    let confText=await fsp.readFile(path.join(project.cwd,"quickmin.yaml"),"utf8");
    let conf=quickminCanonicalizeConf(confText);
    if (!conf.hasOwnProperty("apiPath"))
    	conf.apiPath="admin";

    conf.qqlDriver=await provisionEvent.target.dispatchEvent(new AsyncEvent("createDatabaseQqlDriver"));
    conf.storageDriver="mock";

    let server=new QuickminServer(conf);
    await server.sync({log: project.log});
    project.excludeFromRuntimeEnv("qql");
    env.qql=server.qql;
}

export async function build(buildEvent) {
	let project=buildEvent.target;

    if (!fs.existsSync(path.join(project.cwd,"quickmin.yaml")))
        return;

    let confText=await fsp.readFile(path.join(project.cwd,"quickmin.yaml"),"utf8");
    let conf=quickminCanonicalizeConf(confText);
    if (!conf.hasOwnProperty("apiPath"))
    	conf.apiPath="admin";

    let clientEntrypoints=await project.resolveEntrypoints("quickmin-client-functions");
    if (clientEntrypoints.length>1)
        throw new Error("More than one admin client entrypoint");

    if (clientEntrypoints.length) {
        await esbuild.build({
            ...await isoqGetEsbuildOptions(),
            entryPoints: clientEntrypoints,
            outfile: path.join(project.cwd,"public","admin-client-functions.js"),
            minify: true,
        });

        conf.clientImports.push("/admin-client-functions.js");
    }

    buildEvent.env.quickminConf=conf;
}
