import { JsonData } from '@/types';
import { setIfHasValue } from '../../various';

export default function transformCollectionArtist(collectionArtist: JsonData): JsonData {
  const esDoc: JsonData = {
    _id: collectionArtist._id,
    type: 'collectionArtist',
    rawSource: collectionArtist,
    language: 'en-US',
  };
  setIfHasValue(esDoc, 'title', collectionArtist.name);
  setIfHasValue(esDoc, 'description', collectionArtist.dates);
  setIfHasValue(esDoc, 'startYear', collectionArtist.startYear);
  setIfHasValue(esDoc, 'endYear', collectionArtist.endYear);
  setIfHasValue(esDoc, 'nationality', collectionArtist.nationality);
  return esDoc;
}
