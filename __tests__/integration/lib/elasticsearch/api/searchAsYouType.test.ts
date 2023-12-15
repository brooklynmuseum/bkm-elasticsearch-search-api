import dotenv from 'dotenv';
dotenv.config({ path: '.env.test' });
import { searchAsYouType } from '@/lib/elasticsearch/api/searchAsYouType';

describe('search function', () => {
  it('search as you type "Yama" and returns the expected result', async () => {
    const result = await searchAsYouType('Yama');
    expect(result.data).toHaveLength(2);
    expect(result.data[0].title).toEqual('Yamashita Kochikusai');
    expect(result.data[1].title).toEqual('Yamamoto Chikuryusai  I');
  });
});
