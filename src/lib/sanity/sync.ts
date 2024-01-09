import { importSanityDataMap } from '@/lib/sanity/import';
import { importFromFile } from '@/lib/sanity/importFile';
import { getEnvVar } from '@/lib/utils';
import { bulkUpsert, createIndex, searchAllIds, deleteIds } from '@/lib/elasticsearch/es';
import { indexSettings } from '@/lib/elasticsearch/config/indexSettings';
import { hydrateDocument } from '@/lib/sanity/hydrate';
import type {
  JsonData,
  DataMap,
  ElasticsearchDocument,
  ElasticsearchTransformFunction,
} from '@/types';

const PROJECT_ID = getEnvVar('SANITY_PROJECT_ID');
const SANITY_DATASET = getEnvVar('SANITY_DATASET');
const SANITY_TYPES = getEnvVar('SANITY_TYPES').split(',');
const INDEX_NAME = getEnvVar('ELASTIC_INDEX_NAME');
const CHUNK_SIZE = parseInt(getEnvVar('CHUNK_SIZE'), 10);
const WEBSITE_URL = getEnvVar('WEBSITE_URL');

export async function sync(deleteIndexIfExists = false, datafile?: string) {
  try {
    console.log('Starting sync...');

    const elasticsearchSanityIds = await getAllElasticsearchSanityIds();
    console.log(`Found ${elasticsearchSanityIds.length} Sanity documents in Elasticsearch.`);

    let dataMap: DataMap;
    if (datafile) {
      dataMap = await importFromFile(datafile);
    } else {
      dataMap = await importSanityDataMap(PROJECT_ID, SANITY_DATASET, []);
    }
    await createIndex(INDEX_NAME, indexSettings, deleteIndexIfExists);
    console.log(`Found ${dataMap.size} documents in Sanity dataset.`);
    await processChunkedData(dataMap, SANITY_TYPES, CHUNK_SIZE, WEBSITE_URL, async (chunk) =>
      bulkUpsert(INDEX_NAME, chunk),
    );

    // Delete any documents that are in Elasticsearch but not in latest Sanity data
    const sanityIds = Array.from(dataMap.keys());
    const sanityIdsSet = new Set(sanityIds);
    const idsToDelete = elasticsearchSanityIds.filter((id) => !sanityIdsSet.has(id));
    await deleteIds(INDEX_NAME, idsToDelete);
  } catch (error) {
    console.error(error);
  }
}

export async function processChunkedData(
  dataMap: DataMap,
  typesToIndex: string[],
  CHUNK_SIZE: number,
  WEBSITE_URL: string,
  asyncProcessChunk: (chunk: JsonData[]) => Promise<void>,
): Promise<void> {
  console.log(`Processing ${typesToIndex.length} types in chunks of ${CHUNK_SIZE}...`);
  let currentChunk: ElasticsearchDocument[] = [];
  const transformers: Record<string, ElasticsearchTransformFunction> = {}; // Cache for transform functions

  for (const [_, document] of dataMap) {
    if (typesToIndex.includes(document._type)) {
      if (!transformers[document._type]) {
        try {
          const transformModule = await import(`./transform/${document._type}.ts`);
          transformers[document._type] = transformModule.default;
        } catch (error) {
          console.error(`Error loading transform function for type ${document._type}:`, error);
          throw error;
        }
      }

      const hydratedDocument = hydrateDocument(dataMap, document);
      const transformedDocument = transformers[document._type](hydratedDocument, WEBSITE_URL);
      if (!transformedDocument) continue; // Some content, like unrouted pages, cannot be indexed
      currentChunk.push(transformedDocument);

      if (currentChunk.length === CHUNK_SIZE) {
        await asyncProcessChunk(currentChunk);
        currentChunk = [];
      }
    }
  }

  if (currentChunk.length > 0) {
    await asyncProcessChunk(currentChunk);
  }
}

/**
 * Get all Sanity IDs in the index. (Source must be "sanity".)
 *
 * @returns An array of all Sanity IDs in the index.
 */
export async function getAllElasticsearchSanityIds() {
  return await searchAllIds(INDEX_NAME, {
    match: {
      source: 'sanity',
    },
  });
}
