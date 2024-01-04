import { getEnvVar } from '../utils';
import { crawlArchivesSpace } from './crawler';
import { bulkUpsert } from '../elasticsearch/es';

const INDEX_NAME = getEnvVar('ARCHIVES_INDEX_NAME');
const CHUNK_SIZE = parseInt(getEnvVar('CHUNK_SIZE'), 1000);

console.log('Loading ArchivesSpace sync');

export async function sync() {
  console.log('Starting ArchivesSpace sync');
  const esBatch = [];
  for await (const batch of crawlArchivesSpace()) {
    if (batch.length === 0) {
      break;
    }
    esBatch.push(batch);
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
