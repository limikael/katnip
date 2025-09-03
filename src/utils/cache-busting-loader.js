import {fileURLToPath} from "node:url";
import {statSync} from "node:fs";

// This runs for every import in your project
export async function resolve(specifier, context, nextResolve) {
  // Let Node figure out the real path first
	const resolved = await nextResolve(specifier, context);

	// Only mess with local files, not bare imports (like react)
	if (resolved.url.startsWith("file://") &&
			!resolved.url.includes("node_modules")) {
		try {
			// Use mtime as a version stamp
			const mtime = statSync(fileURLToPath(resolved.url)).mtimeMs;
			const cacheBustedUrl = `${resolved.url}?v=${mtime}`;
			//console.log("yep..."+cacheBustedUrl);
		  	return { ...resolved, url: cacheBustedUrl };
		}

		catch {
			// fallback if stat fails
		}
	}

	return resolved;
}