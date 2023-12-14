// import { exportSanityDataMap } from './export';
import { exportFromFile } from './exportFile';
import { getEnvVar } from '../env';
import { processChunkedData } from './process';
import { bulkUpsertToElasticsearch } from '../elasticsearch/upsert';
import { createIndex } from '../elasticsearch/createIndex';

export async function sync() {
  const sanityProjectId = getEnvVar('SANITY_PROJECT_ID');
  const sanityDataset = getEnvVar('SANITY_DATASET');
  const sanityTypes = getEnvVar('SANITY_TYPES').split(',');
  const indexName = getEnvVar('ELASTIC_INDEX_NAME');
  const chunkSize = parseInt(getEnvVar('CHUNK_SIZE'), 10);
  try {
    // const dataMap = await exportSanityDataMap(sanityProjectId, sanityDataset, []);
    const dataMap = await exportFromFile('./output.ndjson');
    await createIndex(indexName);
    await processChunkedData(dataMap, sanityTypes, chunkSize, async (chunk) => bulkUpsertToElasticsearch(indexName, chunk));
  } catch (error) {
      console.error(error);
  }
}

