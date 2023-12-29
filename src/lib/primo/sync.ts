import { crawlCollections } from './crawler';

export async function sync() {
  for await (const docsBatch of crawlCollections()) {
    // Perform the necessary transformations for Elasticsearch
    // Upsert the transformed batch to Elasticsearch
    console.log(`Upserting batch of size ${docsBatch.length} to Elasticsearch`);
    // ... Elasticsearch upsert logic here
  }
}
