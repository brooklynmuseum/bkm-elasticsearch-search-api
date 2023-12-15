// import { exportSanityDataMap } from './export';
import { exportFromFile } from './exportFile';
import { getEnvVar } from '../various';
import { bulkUpsert } from '../elasticsearch/es';
import { createIndex } from '../elasticsearch/es';
import { denormalizeDocument } from './denormalize';
import type { JsonData, DataMap } from '../../types';

export async function sync() {
  const sanityProjectId = getEnvVar('SANITY_PROJECT_ID');
  const sanityDataset = getEnvVar('SANITY_DATASET');
  const sanityTypes = getEnvVar('SANITY_TYPES').split(',');
  const indexName = getEnvVar('ELASTIC_INDEX_NAME');
  const chunkSize = parseInt(getEnvVar('CHUNK_SIZE'), 10);
  try {
    // const dataMap = await exportSanityDataMap(sanityProjectId, sanityDataset, []);
    const dataMap = await exportFromFile('./output.ndjson');
    await createIndex(indexName, true);
    await processChunkedData(dataMap, sanityTypes, chunkSize, async (chunk) =>
      bulkUpsert(indexName, chunk),
    );
  } catch (error) {
    console.error(error);
  }
}

export async function processChunkedData(
  dataMap: DataMap,
  typesToIndex: string[],
  chunkSize: number,
  asyncProcessChunk: (chunk: JsonData[]) => Promise<void>,
): Promise<void> {
  console.log(`Processing ${typesToIndex.length} types in chunks of ${chunkSize}...`);
  let currentChunk: JsonData[] = [];
  const transformers: Record<string, (doc: JsonData) => JsonData> = {}; // Cache for transform functions

  for (const [_, document] of dataMap) {
    if (typesToIndex.includes(document._type)) {
      if (!transformers[document._type]) {
        try {
          const transformModule = await import(`./transform/${document._type}.ts`);
          transformers[document._type] = transformModule.default;
        } catch (error) {
          console.error(`Error loading transform function for type ${document._type}:`, error);
          continue;
        }
      }

      const denormalizedDocument = denormalizeDocument(dataMap, document);
      const transformedDocument = transformers[document._type](denormalizedDocument);
      currentChunk.push(transformedDocument);

      if (currentChunk.length === chunkSize) {
        await asyncProcessChunk(currentChunk);
        currentChunk = [];
      }
    }
  }

  if (currentChunk.length > 0) {
    await asyncProcessChunk(currentChunk);
  }
}
