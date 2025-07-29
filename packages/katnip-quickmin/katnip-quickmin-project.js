import fs, {promises as fsp} from "node:fs";
import path from "node:path";
import {fileURLToPath} from 'url';
import {quickminCanonicalizeConf, QuickminServer} from "quickmin/server";
import {MockStorage} from "quickmin/mock-storage";
import {isoqGetEsbuildOptions} from "isoq/bundler";
import esbuild from "esbuild";

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

provision.priority=20;
export async function provision(provisionEvent) {
    let env=provisionEvent.env;
    let project=provisionEvent.target;

	if (!env.DATABASE_URL && !provisionEvent.qqlFactory)
		return;

    if (!fs.existsSync(path.join(project.cwd,"quickmin.yaml")))
        return;

    let confText=await fsp.readFile(path.join(project.cwd,"quickmin.yaml"),"utf8");
    let conf=quickminCanonicalizeConf(confText);
    if (!conf.hasOwnProperty("apiPath"))
    	conf.apiPath="admin";

    if (!provisionEvent.qqlFactory) {
	    let dsnUrl=new URL(env.DATABASE_URL);
	    switch (dsnUrl.protocol) {
	    	case "libsql+file:":
	    		provisionEvent.qqlFactory=(await import(path.join(__dirname,"katnip-quickmin-resources-node.js"))).createQqlDriver;
	    		break;

	    	default:
	    		throw new Error("Unable to create driver for provision");
	    		break;
	    }
    }

    conf.qqlDriver=await provisionEvent.qqlFactory({
        env: env
    });

    conf.storageDriver=new MockStorage();

    let server=new QuickminServer(conf);

    await server.sync({log: project.log});

    env.qql=server.qql;
}

buildExtend.event="build";
buildExtend.priority=1;
export async function buildExtend(buildEvent) {
    buildEvent.registerQqlFactory=(modulePath, fn)=>{
        buildEvent.importModules.qqlFactoryModule=modulePath;
        buildEvent.env.qqlFactoryFunction=fn;
    }

    buildEvent.registerStorageFactory=(modulePath, fn)=>{
        buildEvent.importModules.storageFactoryModule=modulePath;
        buildEvent.env.storageFactoryFunction=fn;
    }
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

    let resourcesPath=path.join(__dirname,"katnip-quickmin-resources-node.js");
    if (project.env.DATABASE_URL) {
	    let dsnUrl=new URL(project.env.DATABASE_URL);
	    switch (dsnUrl.protocol) {
	    	case "libsql+file:":
                buildEvent.registerQqlFactory(resourcesPath,"createQqlDriver");
	    		break;
	    }
    }

    if (project.env.DATABASE_STORAGE_URL) {
        let storageUrl=new URL(project.env.DATABASE_STORAGE_URL);
        switch (storageUrl.protocol) {
            case "node+file:":
                buildEvent.registerStorageFactory(resourcesPath,"createStorageDriver");
                break;

            default:
                throw new Error("Unknown storage");
                break;
        }
    }
}
