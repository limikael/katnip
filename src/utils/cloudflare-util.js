export function cloudflareGetBinding(wranglerJson, bindingName) {
    const d1 = wranglerJson.d1_databases || [];
    for (const entry of d1) {
        if (entry.binding === bindingName) {
            return entry;
        }
    }

    const r2 = wranglerJson.r2_buckets || [];
    for (const entry of r2) {
        if (entry.binding === bindingName) {
            return entry;
        }
    }

    return undefined;
}

export function cloudflareAddBinding(wranglerJson, type, spec) {
    if (!["d1_databases", "r2_buckets"].includes(type)) {
        throw new Error(`Unsupported binding type: ${type}`);
    }

    if (!wranglerJson[type]) {
        wranglerJson[type] = [];
    }

    const arr = wranglerJson[type];
    const existingIndex = arr.findIndex(entry => entry.binding === spec.binding);

    if (existingIndex !== -1) {
        arr[existingIndex] = spec;
    } else {
        arr.push(spec);
    }

    return wranglerJson;
}