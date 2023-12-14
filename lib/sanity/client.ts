import {createClient, type ClientConfig} from '@sanity/client'
import { getEnvVar } from '../env'

// https://www.npmjs.com/package/@sanity/client#typescript
const config: ClientConfig = {
  projectId: getEnvVar('SANITY_PROJECT_ID'),
  dataset: getEnvVar('SANITY_DATASET'),
  useCdn: true, // set to `false` to bypass the edge cache
  apiVersion: '2023-05-03', // use current date (YYYY-MM-DD) to target the latest API version
  // token: process.env.SANITY_TOKEN,
}
export const client = createClient(config)
