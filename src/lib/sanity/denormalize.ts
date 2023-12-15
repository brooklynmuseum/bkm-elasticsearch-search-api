import { DataMap, JsonData } from '@/types';

/**
 * Recursively resolve references within an object.
 * Important: only go one ref deep.
 * Do not resolve references within referenced objects.
 *
 * @param dataMap Map of all documents in the dataset
 * @param obj The object to resolve references within
 * @param documentId We're only going one ref deep.  Just make sure that ref doesn't point back to the original document.
 * @param resolveNested Don't resolve references within referenced objects (just go one ref deep)
 * @returns The denormalized object
 */
function resolveReferences(
  dataMap: DataMap,
  obj: JsonData,
  documentId: string,
  resolveNested: boolean = true,
): JsonData {
  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (obj[key]._ref && obj[key]._ref !== documentId) {
        const refData = dataMap.get(obj[key]._ref);
        if (refData) {
          obj[key] = { ...refData };
        }
        // Don't resolve references within referenced objects
        resolveNested = false;
      }
      if (resolveNested) {
        resolveReferences(dataMap, obj[key], documentId, resolveNested);
      }
    }
  });
  return obj;
}

/**
 * Recursively resolve references within a document.
 *
 * @param dataMap Map of all documents in the dataset
 * @param document The document to resolve references within
 * @returns The denormalized document
 */
export function denormalizeDocument(dataMap: DataMap, document: JsonData): JsonData {
  return resolveReferences(dataMap, document, document._id);
}
