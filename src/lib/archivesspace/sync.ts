import { getEnvVar } from '../utils';
import { crawlArchivesSpace } from './crawler';
import { transform } from './transform';
import { bulkUpsert } from '../elasticsearch/es';

const INDEX_NAME = getEnvVar('ELASTIC_INDEX_NAME');
const CHUNK_SIZE = parseInt(getEnvVar('CHUNK_SIZE', '1000'), 10);

export async function sync() {
  console.log(`Starting ArchivesSpace sync with chunk size ${CHUNK_SIZE} and index ${INDEX_NAME}`);
  const esBatch = [];
  for await (const batch of crawlArchivesSpace()) {
    if (batch.length === 0) {
      break;
    }
    for (const doc of batch) {
      const esDoc = transform(doc);
      if (esDoc) {
        esBatch.push(esDoc);
      }
    }
    console.log(`Transformed batch of size ${esBatch.length} archives documents`);
    if (esBatch.length >= CHUNK_SIZE) {
      console.log(`Upserting batch of size ${batch.length} to Elasticsearch index ${INDEX_NAME}`);
      await bulkUpsert(INDEX_NAME, esBatch);
      esBatch.length = 0;
    }
  }
  if (esBatch.length > 0) {
    console.log(`Upserting batch of size ${esBatch.length} to Elasticsearch index ${INDEX_NAME}`);
    await bulkUpsert(INDEX_NAME, esBatch);
  }
}
