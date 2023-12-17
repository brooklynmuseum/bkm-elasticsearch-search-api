import * as dotenv from 'dotenv';
dotenv.config();
import { getEnvVar } from '@/lib/utils';
import { sync } from '@/lib/sync/sync';

if (getEnvVar('ELASTIC_USE_CLOUD') === 'true') {
  console.error(
    'ERROR: Cannot sync test data to Elasticsearch cloud.  Please use a local Elasticsearch instance.',
  );
} else {
  sync(true, './data/output.ndjson');
}
