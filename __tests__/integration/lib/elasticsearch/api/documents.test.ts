import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { getDocuments } from '@/lib/elasticsearch/api/documents';
import type { ElasticsearchDocument, ApiSearchResponse } from '@/types';

describe('getDocuments function', () => {
  it('retrieves a single document by ID', async () => {
    const singleId = 'collection_object_225441'; // Replace with an actual ID in your index
    const response = await getDocuments(singleId);
    expect(response.data).toHaveLength(1);
    const esDoc = response.data[0] as ElasticsearchDocument;
    expect(esDoc._id).toEqual(singleId);
  });

  it('retrieves multiple documents by an array of IDs', async () => {
    const multipleIds = ['collection_object_225441', 'collection_object_225439']; // Replace with actual IDs in your index
    const response = await getDocuments(multipleIds);
    expect(response.data).toHaveLength(multipleIds.length);
    response.data.forEach((doc: ElasticsearchDocument, index: number) => {
      expect(doc._id).toEqual(multipleIds[index]);
    });
  });

  it('handles not found IDs correctly', async () => {
    const notFoundId = 'non_existent_id';
    const response = await getDocuments(notFoundId);
    expect(response.data).toHaveLength(0);
  });

  it('handles a mix of found and not found IDs', async () => {
    const mixedIds = ['collection_object_225441', 'non_existent_id']; // Replace 'existing_id' with an actual ID
    const response = await getDocuments(mixedIds);
    const foundDocuments = response.data.filter(
      (doc) => (doc as ElasticsearchDocument)._id === 'collection_object_225441',
    );
    expect(foundDocuments).toHaveLength(1);
    expect(response.data.length).toBeLessThanOrEqual(mixedIds.length);
  });
});
