import { DataMap, JsonData } from '@/types';

/**
 * Recursively resolve references within an object up to a specified depth.
 *
 * @param dataMap Map of all documents in the dataset.
 * @param obj The object to resolve references within.
 * @param documentId The ID of the original document to avoid self-referencing.
 * @param maxDepth The maximum depth to resolve references.
 * @param currentDepth The current depth in the resolution process.
 * @returns The object with resolved references.
 */
function resolveReferences(
  dataMap: DataMap,
  obj: JsonData,
  documentId: string,
  maxDepth: number,
  currentDepth: number = 0,
): JsonData {
  if (currentDepth > maxDepth) {
    return obj; // Return the object as is if the maximum depth is exceeded
  }

  Object.keys(obj).forEach((key) => {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      if (obj[key]._ref && obj[key]._ref !== documentId) {
        const refData = dataMap.get(obj[key]._ref);
        if (refData) {
          obj[key] = { ...refData };
          // Resolve references within the referenced object, increasing depth
          resolveReferences(dataMap, obj[key], documentId, maxDepth, currentDepth + 1);
        }
      } else {
        // Continue to resolve references in nested objects without increasing depth
        resolveReferences(dataMap, obj[key], documentId, maxDepth, currentDepth);
      }
    }
  });
  return obj;
}

/**
 * Recursively resolve references within a document, hydrating it with referenced data.
 *
 * @param dataMap Map of all documents in the dataset.
 * @param document The document to resolve references within.
 * @param maxDepth The maximum depth to resolve references.
 * @returns The document with resolved references.
 */
export function hydrateDocument(
  dataMap: DataMap,
  document: JsonData,
  maxDepth: number = 1,
): JsonData {
  return resolveReferences(dataMap, document, document._id, maxDepth);
}
