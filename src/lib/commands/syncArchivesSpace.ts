import * as dotenv from 'dotenv';
dotenv.config();
import { sync } from '@/lib/archivesspace/sync';

sync();
