import { readFile } from "fs/promises";
import { SourceTextModule } from "vm";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function importVm(filePath, {context}={}) {
    const absPath = path.resolve(__dirname, filePath); // should be passed
    const code = await readFile(absPath, "utf8");

    const module = new SourceTextModule(code, {
        context
        identifier: pathToFileURL(absPath).href,
    });

    await module.link(async (specifier, referencingModule) => {
        const referencingPath = new URL(referencingModule.identifier).pathname;
        const resolvedPath = path.resolve(path.dirname(referencingPath), specifier);
        return await importVm(resolvedPath);
    });

    await module.evaluate();
    return module.namespace;
}