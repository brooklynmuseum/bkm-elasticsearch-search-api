import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { search } from '@/lib/elasticsearch/api/search';
import type { ElasticsearchDocument } from '@/types';

describe('search function', () => {
  it('searches "Yamashita" and returns the expected result', async () => {
    const result = await search({
      pageNumber: 1,
      size: 10,
      query: 'Yamashita',
    });
    const esDoc = result.data[0] as ElasticsearchDocument;
    expect(esDoc.rawSource._id).toEqual('collection_object_225440');
  });

  it('searches "Spike Lee Atlanta Georgia" and returns the expected result', async () => {
    const result = await search({
      pageNumber: 1,
      size: 10,
      query: 'Spike Lee Atlanta Georgia',
    });
    expect(result.data).toHaveLength(1);
    const esDoc = result.data[0] as ElasticsearchDocument;
    expect(esDoc.rawSource._id).toEqual('232b72a6-3b97-41fe-bfc4-33c5649dda83');
  });

  it('searches "Spike Lee" and returns the expected result', async () => {
    const result = await search({
      pageNumber: 1,
      size: 10,
      query: 'Spike Lee',
    });
    expect(result.data).toHaveLength(10);
    expect(result.metadata?.total).toEqual(11);
  });

  it('searches "Spike Lee" with type "exhibition" and returns the expected result', async () => {
    const result = await search({
      pageNumber: 1,
      size: 10,
      query: 'Spike Lee',
      type: 'exhibition',
    });
    expect(result.data).toHaveLength(1);
    const esDoc = result.data[0] as ElasticsearchDocument;
    expect(esDoc.rawSource._id).toEqual('232b72a6-3b97-41fe-bfc4-33c5649dda83');
  });
});
