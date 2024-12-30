export function initCli(ev) {
	ev.getCommandByName("dev").option("--testopt <val>","testing");
}

export async function fetch(fetchEv) {
	//console.log(fetchEv.options);

	let doc=`
		<html>
			<body>
				<b>Url:</b> ${fetchEv.request.url}<br/>
				<b>Testopt:</b> ${fetchEv.options.testopt}<br/>
				<b>Watch :</b> ${fetchEv.options.watch} <br/>
			</body>
		</html>
	`;

	return new Response(doc,{
		headers: {
			"content-type": "text/html"
		}
	});
}