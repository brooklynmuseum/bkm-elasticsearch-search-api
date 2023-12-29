import { setIfHasValue, getLegacyId } from './utils';
import type { JsonData, ElasticsearchDocument, ElasticsearchTransformFunction } from '@/types';

const transform: ElasticsearchTransformFunction = (
  sanityDoc: JsonData,
  websiteUrl: string,
): ElasticsearchDocument => {
  const esDoc: ElasticsearchDocument = {
    _id: sanityDoc._id,
    type: 'collectionArtist',
    rawSource: sanityDoc,
  };

  const id = getLegacyId(sanityDoc._id);
  const url = `${websiteUrl}/opencollection/artists/${id}`;

  setIfHasValue(esDoc, 'url', url);
  setIfHasValue(esDoc, 'title', sanityDoc.name?.trim());
  setIfHasValue(esDoc, 'description', sanityDoc.dates?.trim());
  setIfHasValue(esDoc, 'startYear', sanityDoc.startYear);
  setIfHasValue(esDoc, 'endYear', sanityDoc.endYear);
  setIfHasValue(esDoc, 'nationality', sanityDoc.nationality?.trim());
  return esDoc;
};

export default transform;
