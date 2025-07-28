import fs, {promises as fsp} from "node:fs";
import path from "node:path";
import {fileURLToPath} from 'url';
import {quickminCanonicalizeConf, QuickminServer} from "quickmin/server";
import {MockStorage} from "quickmin/mock-storage";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

provision.priority=20;
export async function provision(provisionEvent) {
	if (!provisionEvent.target.config.databaseServiceName)
		return;

	let project=provisionEvent.target;

    let confText=await fsp.readFile(path.join(project.cwd,"quickmin.yaml"),"utf8");
    let conf=quickminCanonicalizeConf(confText);
    if (!conf.hasOwnProperty("apiPath"))
    	conf.apiPath="admin";

    if (!provisionEvent.qqlFactory) {
	    let dsnUrl=new URL(project.config.databaseServiceName);
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
    	target: project,
    	dsn: project.config.databaseServiceName
    });

    conf.storageDriver=new MockStorage();

    let server=new QuickminServer(conf);

    await server.sync({log: project.log});

    project.env.qql=server.qql;
}

export async function build(buildEvent) {
	let project=buildEvent.target;

    let confText=await fsp.readFile(path.join(project.cwd,"quickmin.yaml"),"utf8");
    let conf=quickminCanonicalizeConf(confText);
    if (!conf.hasOwnProperty("apiPath"))
    	conf.apiPath="admin";

    buildEvent.env.quickminConf=conf;

    if (project.config.databaseServiceName) {
	    let dsnUrl=new URL(project.config.databaseServiceName);
	    switch (dsnUrl.protocol) {
	    	case "libsql+file:":
	    		buildEvent.importModules.qqlFactoryModule=path.join(__dirname,"qql-factory-node.js");
	    		break;
	    }
    }

    if (project.config.databaseStorage) {
        let storageUrl=new URL(project.config.databaseStorage);
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
