import { Client } from '@elastic/elasticsearch';

import { getEnvVar } from '../env'

const useCloud = getEnvVar('ELASTIC_USE_CLOUD');
const cloudId = getEnvVar('ELASTIC_CLOUD_ID');
const cloudUsername = getEnvVar('ELASTIC_CLOUD_USERNAME');
const cloudPassword = getEnvVar('ELASTIC_CLOUD_PASSWORD');
const localNode = getEnvVar('ELASTIC_LOCAL_NODE');

const clientConfig =
	useCloud === 'true'
		? {
				cloud: {
					id: cloudId
				},
				auth: {
					username: cloudUsername,
					password: cloudPassword
				}
		  }
		: {
				node: localNode
		  };

export const client = new Client(clientConfig);
