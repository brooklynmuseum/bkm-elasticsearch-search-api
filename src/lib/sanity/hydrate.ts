import { DataMap, JsonData } from '@/types';

/**
 * Recursively resolve references within an object, avoiding loops.
 *
 * @param dataMap Map of all documents in the dataset.
 * @param obj The object to resolve references within.
 * @param documentId The ID of the original document to avoid self-referencing.
 * @param processedRefs Set of already processed references to avoid loops.
 * @returns The object with resolved references.
 */
function resolveReferences(
  dataMap: DataMap,
  obj: JsonData,
  documentId: string,
  processedRefs: Set<string> = new Set(),
): JsonData {
  processedRefs.add(documentId); // Remember current document

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (typeof value === 'object' && value !== null) {
      if (value._ref && !processedRefs.has(value._ref)) {
        const refData = dataMap.get(value._ref);
        if (refData) {
          obj[key] = resolveReferences(dataMap, { ...refData }, value._ref, processedRefs);
        }
      } else {
        resolveReferences(dataMap, value, documentId, processedRefs);
      }
    }
  });

  return obj;
}

/**
 * Recursively resolve references within a document, hydrating it with referenced data.
 *
 * WARNING: This function mutates the original document!
 *
 * @param dataMap Map of all documents in the dataset.
 * @param document The document to resolve references within.
 * @returns The document with resolved references.
 */
export function hydrateDocument(dataMap: DataMap, document: JsonData): JsonData {
  const processedRefs = new Set<string>();
  return resolveReferences(dataMap, document, document._id, processedRefs);
}
