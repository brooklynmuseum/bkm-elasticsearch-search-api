import { DataMap, JsonData } from "../../types";

function resolveReferences(dataMap: DataMap, obj: JsonData, resolveNested: boolean = true): JsonData {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (obj[key]._ref) {
                const refData = dataMap.get(obj[key]._ref);
                if (refData) {
                    obj[key] = { ...refData };
                }
                // Don't resolve references within referenced objects
                resolveNested = false;
            }
            if (resolveNested) {
                resolveReferences(dataMap, obj[key], resolveNested);
            }
        }
    });
    return obj;
}

export function denormalizeDocument(dataMap: DataMap, document: JsonData): JsonData {
    return resolveReferences(dataMap, document);
}
