export async function exists(fsPromises, path) {
	try {
		let stat=await fsPromises.stat(path);
		return true;
	} 

	catch (e) {
		if (e.code!="ENOENT")
			throw e;

		return false;
	}
}
