import { Client } from '@elastic/elasticsearch';

import { getEnvVar } from '@/lib/utils';

const useCloud = getEnvVar('ELASTIC_USE_CLOUD');
const id = getEnvVar('ELASTIC_CLOUD_ID');
const username = getEnvVar('ELASTIC_CLOUD_USERNAME');
const password = getEnvVar('ELASTIC_CLOUD_PASSWORD');
const localNode = getEnvVar('ELASTIC_LOCAL_NODE');

export function getClient(): Client {
  const clientConfig =
    useCloud === 'true'
      ? {
          cloud: { id },
          auth: { username, password },
        }
      : {
          node: localNode,
        };

  const client = new Client(clientConfig);
  if (client === undefined) throw new Error('Cannot connect to Elasticsearch.');
  return client;
}

export const client = getClient();
