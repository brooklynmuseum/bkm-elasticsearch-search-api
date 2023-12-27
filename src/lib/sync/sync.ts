import { importSanityDataMap } from '@/lib/sanity/import';
import { importFromFile } from '@/lib/sanity/importFile';
import { getEnvVar } from '@/lib/utils';
import { bulkUpsert } from '@/lib/elasticsearch/es';
import { createIndex } from '@/lib/elasticsearch/es';
import { indexSettings } from '@/lib/elasticsearch/config/indexSettings';
import { hydrateDocument } from '@/lib/sanity/hydrate';
import type {
  JsonData,
  DataMap,
  ElasticsearchDocument,
  ElasticsearchTransformFunction,
} from '@/types';

export async function sync(deleteIndexIfExists = false, datafile?: string) {
  const sanityProjectId = getEnvVar('SANITY_PROJECT_ID');
  const sanityDataset = getEnvVar('SANITY_DATASET');
  const sanityTypes = getEnvVar('SANITY_TYPES').split(',');
  const indexName = getEnvVar('ELASTIC_INDEX_NAME');
  const chunkSize = parseInt(getEnvVar('CHUNK_SIZE'), 10);
  const websiteUrl = getEnvVar('WEBSITE_URL');

  try {
    console.log('Starting sync...');
    let dataMap: DataMap;
    if (datafile) {
      dataMap = await importFromFile(datafile);
    } else {
      dataMap = await importSanityDataMap(sanityProjectId, sanityDataset, []);
    }
    console.log(`Creating index ${indexName}...`);
    await createIndex(indexName, indexSettings, deleteIndexIfExists);
    console.log(`Index ${indexName} created.`);
    console.log(`Indexing ${dataMap.size} documents...`);
    await processChunkedData(dataMap, sanityTypes, chunkSize, websiteUrl, async (chunk) =>
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
  websiteUrl: string,
  asyncProcessChunk: (chunk: JsonData[]) => Promise<void>,
): Promise<void> {
  console.log(`Processing ${typesToIndex.length} types in chunks of ${chunkSize}...`);
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

      const denormalizedDocument = hydrateDocument(dataMap, document);
      const transformedDocument = transformers[document._type](denormalizedDocument, websiteUrl);
      if (!transformedDocument) continue; // Some content, like unrouted pages, cannot be indexed
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
