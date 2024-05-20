export function clientProps(props, ev) {
    props.schema={};
    if (!ev.data.quickminServer)
        return;

	let collections=ev.data.quickminServer.collections;
    for (let cid in collections)
        props.schema[cid]=collections[cid].getSchema();
}