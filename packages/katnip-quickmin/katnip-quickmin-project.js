import fs, {promises as fsp} from "node:fs";
import path from "node:path";
import {fileURLToPath} from 'url';
import {quickminCanonicalizeConf, QuickminServer} from "quickmin/server";
import {MockStorage} from "quickmin/mock-storage";

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

export async function init(ev) {
    let quickminYamlFile=path.join(ev.target.cwd,"quickmin.yaml");
    if (!fs.existsSync(quickminYamlFile)) {
        //console.log("Creating "+quickminYamlFile);
        fs.writeFileSync(quickminYamlFile,QUICKMIN_YAML);
    }

    await ev.target.processProjectFile(".env","dotenv",async dotenv=>{
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

	if (!env.DATABASE_URL)
		return;

	let project=provisionEvent.target;

    let confText=await fsp.readFile(path.join(project.cwd,"quickmin.yaml"),"utf8");
    let conf=quickminCanonicalizeConf(confText);
    if (!conf.hasOwnProperty("apiPath"))
    	conf.apiPath="admin";

    if (!provisionEvent.qqlFactory) {
	    let dsnUrl=new URL(env.DATABASE_URL);
	    switch (dsnUrl.protocol) {
	    	case "libsql+file:":
	    		provisionEvent.qqlFactory=(await import(path.join(__dirname,"qql-factory-node.js"))).default;
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

export async function build(buildEvent) {
	let project=buildEvent.target;

    let confText=await fsp.readFile(path.join(project.cwd,"quickmin.yaml"),"utf8");
    let conf=quickminCanonicalizeConf(confText);
    if (!conf.hasOwnProperty("apiPath"))
    	conf.apiPath="admin";

    buildEvent.env.quickminConf=conf;
    buildEvent.env.DATABASE_URL=project.env.DATABASE_URL;
    buildEvent.env.DATABASE_STORAGE_URL=project.env.DATABASE_STORAGE_URL;

    if (project.env.DATABASE_URL) {
	    let dsnUrl=new URL(project.env.DATABASE_URL);
	    switch (dsnUrl.protocol) {
	    	case "libsql+file:":
	    		buildEvent.importModules.qqlFactoryModule=path.join(__dirname,"qql-factory-node.js");
	    		break;
	    }
    }

    if (project.env.DATABASE_STORAGE_URL) {
        let storageUrl=new URL(project.env.DATABASE_STORAGE_URL);
        switch (storageUrl.protocol) {
            case "node+file:":
                buildEvent.importModules.storageFactoryModule=path.join(__dirname,"storage-factory-node.js");
                break;

            default:
                throw new Error("Unknown storage");
                break;
        }
    }
}
