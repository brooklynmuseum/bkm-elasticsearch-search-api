import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { searchAsYouType } from '@/lib/elasticsearch/api/searchAsYouType';
import type { ElasticsearchDocument } from '@/types';

describe('search function', () => {
  it('search as you type "Yama" and returns the expected result', async () => {
    const result = await searchAsYouType('Yama');
    expect(result.data).toHaveLength(2);
    expect((result.data[0] as ElasticsearchDocument).title).toEqual('Yamashita Kochikusai');
    expect((result.data[1] as ElasticsearchDocument).title).toEqual('Yamamoto Chikuryusai  I');
  });
});
