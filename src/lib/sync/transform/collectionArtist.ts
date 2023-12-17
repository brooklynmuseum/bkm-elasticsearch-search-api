import { JsonData } from '@/types';
import { setIfHasValue, getEnvVar } from '@/lib/utils';
import { getLegacyId } from '@/lib/utils';

export default function transformCollectionArtist(
  collectionArtist: JsonData,
  websiteUrl: string,
): JsonData {
  const esDoc: JsonData = {
    _id: collectionArtist._id,
    type: 'collectionArtist',
    rawSource: collectionArtist,
    language: 'en-US',
  };

  const artistId = getLegacyId(collectionArtist._id);
  const collectionArtistUrl = `${websiteUrl}/opencollection/artists/${artistId}`;

  setIfHasValue(esDoc, 'url', collectionArtistUrl);
  setIfHasValue(esDoc, 'title', collectionArtist.name?.trim());
  setIfHasValue(esDoc, 'description', collectionArtist.dates?.trim());
  setIfHasValue(esDoc, 'startYear', collectionArtist.startYear);
  setIfHasValue(esDoc, 'endYear', collectionArtist.endYear);
  setIfHasValue(esDoc, 'nationality', collectionArtist.nationality?.trim());
  return esDoc;
}
