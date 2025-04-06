export async function helloFunc({id,item}) {
	console.log("hello!!! id=",id,"item=",item);

	await new Promise(r=>setTimeout(r,1000));

	return "done and done";
}